import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertPortfolioSchema, insertMediaAssetSchema } from "@shared/schema";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all portfolios
  app.get("/api/portfolios", async (req, res) => {
    try {
      const portfolios = await storage.getUserPortfolios(1); // Default user
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  // Get portfolio by ID
  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Create new portfolio
  app.post("/api/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Update portfolio
  app.put("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPortfolioSchema.partial().parse(req.body);
      const portfolio = await storage.updatePortfolio(id, validatedData);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Delete portfolio
  app.delete("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePortfolio(id);
      if (!deleted) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });

  // Upload media files
  app.post("/api/portfolios/:id/media", upload.array('files', 10), async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedAssets = [];
      for (const file of files) {
        const asset = await storage.createMediaAsset({
          portfolioId,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
        });
        uploadedAssets.push(asset);
      }

      res.status(201).json(uploadedAssets);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload files" });
    }
  });

  // Get portfolio media assets
  app.get("/api/portfolios/:id/media", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const assets = await storage.getPortfolioMediaAssets(portfolioId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media assets" });
    }
  });

  // Delete media asset
  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMediaAsset(id);
      if (!deleted) {
        return res.status(404).json({ message: "Media asset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media asset" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
