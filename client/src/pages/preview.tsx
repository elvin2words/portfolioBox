import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit, Share2, Settings, ArrowLeft } from "lucide-react";
import { HeroSection } from '@/components/builder/sections/HeroSection';
import { GallerySection } from '@/components/builder/sections/GallerySection';
import { AboutSection } from '@/components/builder/sections/AboutSection';
import { ContactSection } from '@/components/builder/sections/ContactSection';
import { TestimonialsSection } from '@/components/builder/sections/TestimonialsSection';
import { ServicesSection } from '@/components/builder/sections/ServicesSection';
import { Portfolio } from '@shared/schema';
import { Section } from '@/types/builder';

const SectionComponent = ({ section }: { section: Section }) => {
  const sectionProps = {
    section,
    isSelected: false,
    onSelect: () => {},
    onDelete: () => {},
  };

  switch (section.type) {
    case 'hero':
      return <HeroSection {...sectionProps} />;
    case 'gallery':
      return <GallerySection {...sectionProps} />;
    case 'about':
      return <AboutSection {...sectionProps} />;
    case 'contact':
      return <ContactSection {...sectionProps} />;
    case 'testimonials':
      return <TestimonialsSection {...sectionProps} />;
    case 'services':
      return <ServicesSection {...sectionProps} />;
    default:
      return null;
  }
};

export default function Preview() {
  const [, setLocation] = useLocation();
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setPortfolioId(id);
  }, []);

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['/api/portfolios', portfolioId],
    queryFn: async () => {
      if (!portfolioId) return null;
      const response = await fetch(`/api/portfolios/${portfolioId}`);
      if (!response.ok) throw new Error('Portfolio not found');
      return response.json();
    },
    enabled: !!portfolioId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Portfolio not found</h2>
          <p className="text-gray-600 mb-6">The portfolio you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const portfolioSections: Section[] = Array.isArray(portfolio.sections) ? portfolio.sections : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-gray-300"
                onClick={() => setLocation('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="h-4 w-px bg-gray-600"></div>
              
              <div>
                <h1 className="font-semibold">{portfolio.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>portfoliobox.com/{portfolio.slug}</span>
                  <Badge variant={portfolio.isPublished ? "default" : "secondary"} className="text-xs">
                    {portfolio.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-gray-300"
                onClick={() => {
                  // Share functionality
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-gray-300"
                onClick={() => setLocation(`/builder?id=${portfolioId}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-gray-300"
                onClick={() => setLocation('/settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <main className="relative">
        {portfolioSections.length > 0 ? (
          <div className="space-y-0">
            {portfolioSections.map((section) => (
              <div key={section.id} className="preview-section">
                <SectionComponent section={section} />
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
              <p className="text-gray-600 mb-6">This portfolio doesn't have any sections yet.</p>
              <Button onClick={() => setLocation(`/builder?id=${portfolioId}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Portfolio Footer */}
      {portfolioSections.length > 0 && (
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              Built with PortfolioBox • {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}