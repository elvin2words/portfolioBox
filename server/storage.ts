import { users, portfolios, mediaAssets, type User, type InsertUser, type Portfolio, type InsertPortfolio, type MediaAsset, type InsertMediaAsset } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getPortfolioBySlug(slug: string): Promise<Portfolio | undefined>;
  getUserPortfolios(userId: number): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;
  
  getMediaAsset(id: number): Promise<MediaAsset | undefined>;
  getPortfolioMediaAssets(portfolioId: number): Promise<MediaAsset[]>;
  createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset>;
  deleteMediaAsset(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private mediaAssets: Map<number, MediaAsset>;
  private currentUserId: number;
  private currentPortfolioId: number;
  private currentAssetId: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.mediaAssets = new Map();
    this.currentUserId = 1;
    this.currentPortfolioId = 1;
    this.currentAssetId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfolioBySlug(slug: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(
      (portfolio) => portfolio.slug === slug,
    );
  }

  async getUserPortfolios(userId: number): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId,
    );
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.currentPortfolioId++;
    const now = new Date();
    const portfolio: Portfolio = { 
      ...insertPortfolio, 
      id, 
      userId: 1, // Default user for demo
      sections: insertPortfolio.sections || [],
      settings: insertPortfolio.settings || {},
      isPublished: insertPortfolio.isPublished || false,
      createdAt: now,
      updatedAt: now 
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio: Portfolio = { 
      ...portfolio, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    return this.mediaAssets.get(id);
  }

  async getPortfolioMediaAssets(portfolioId: number): Promise<MediaAsset[]> {
    return Array.from(this.mediaAssets.values()).filter(
      (asset) => asset.portfolioId === portfolioId,
    );
  }

  async createMediaAsset(insertAsset: InsertMediaAsset): Promise<MediaAsset> {
    const id = this.currentAssetId++;
    const asset: MediaAsset = { 
      ...insertAsset, 
      id, 
      portfolioId: insertAsset.portfolioId || null,
      createdAt: new Date() 
    };
    this.mediaAssets.set(id, asset);
    return asset;
  }

  async deleteMediaAsset(id: number): Promise<boolean> {
    return this.mediaAssets.delete(id);
  }
}

export const storage = new MemStorage();
