import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Palette, Briefcase, Code, Heart, Star, Search, Filter } from "lucide-react";
import { createDefaultSection } from '@/lib/sectionTemplates';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const templateCategories = [
  { id: 'all', name: 'All Templates', icon: Star },
  { id: 'photography', name: 'Photography', icon: Camera },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'developer', name: 'Developer', icon: Code },
  { id: 'creative', name: 'Creative', icon: Heart },
];

const portfolioTemplates = [
  {
    id: 'photographer-minimal',
    name: 'Minimal Photographer',
    category: 'photography',
    description: 'Clean, minimal design perfect for showcasing photography work',
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop',
    tags: ['minimal', 'photography', 'clean'],
    sections: ['hero', 'gallery', 'about', 'contact'],
    theme: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        background: '#ffffff',
        text: '#1e293b',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
      }
    }
  },
  {
    id: 'designer-creative',
    name: 'Creative Designer',
    category: 'design',
    description: 'Bold and colorful design for creative professionals',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    tags: ['creative', 'colorful', 'modern'],
    sections: ['hero', 'services', 'gallery', 'testimonials', 'contact'],
    theme: {
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        background: '#fafafa',
        text: '#1f2937',
      },
      fonts: {
        heading: 'Poppins',
        body: 'Inter',
      }
    }
  },
  {
    id: 'business-professional',
    name: 'Professional Business',
    category: 'business',
    description: 'Corporate-friendly design for business professionals',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
    tags: ['professional', 'corporate', 'clean'],
    sections: ['hero', 'about', 'services', 'testimonials', 'contact'],
    theme: {
      colors: {
        primary: '#059669',
        secondary: '#0891b2',
        background: '#ffffff',
        text: '#374151',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      }
    }
  },
  {
    id: 'developer-tech',
    name: 'Tech Developer',
    category: 'developer',
    description: 'Modern tech-focused portfolio for developers',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    tags: ['tech', 'modern', 'dark'],
    sections: ['hero', 'about', 'services', 'gallery', 'contact'],
    theme: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f172a',
        text: '#f1f5f9',
      },
      fonts: {
        heading: 'JetBrains Mono',
        body: 'Inter',
      }
    }
  },
  {
    id: 'artist-portfolio',
    name: 'Artist Showcase',
    category: 'creative',
    description: 'Artistic and expressive design for visual artists',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    tags: ['artistic', 'expressive', 'gallery'],
    sections: ['hero', 'gallery', 'about', 'testimonials', 'contact'],
    theme: {
      colors: {
        primary: '#dc2626',
        secondary: '#ea580c',
        background: '#fffbeb',
        text: '#92400e',
      },
      fonts: {
        heading: 'Merriweather',
        body: 'Open Sans',
      }
    }
  },
  {
    id: 'freelancer-modern',
    name: 'Modern Freelancer',
    category: 'business',
    description: 'Versatile design perfect for freelancers and consultants',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    tags: ['versatile', 'freelancer', 'modern'],
    sections: ['hero', 'services', 'about', 'gallery', 'contact'],
    theme: {
      colors: {
        primary: '#7c3aed',
        secondary: '#2563eb',
        background: '#ffffff',
        text: '#1f2937',
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Inter',
      }
    }
  }
];

export default function Templates() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createFromTemplateMutation = useMutation({
    mutationFn: async (template: typeof portfolioTemplates[0]) => {
      const portfolioData = {
        name: `${template.name} Portfolio`,
        slug: `${template.id}-${Date.now()}`,
        sections: template.sections.map(sectionType => createDefaultSection(sectionType as any)),
        settings: {
          theme: template.id,
          colors: template.theme.colors,
          fonts: template.theme.fonts,
          responsive: {
            mobile: true,
            tablet: true,
            desktop: true,
          },
        },
        isPublished: false,
      };
      
      return apiRequest('POST', '/api/portfolios', portfolioData);
    },
    onSuccess: (newPortfolio) => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: "Portfolio created",
        description: "Your portfolio has been created from the template.",
      });
      setLocation(`/builder?id=${newPortfolio.id}`);
    },
    onError: () => {
      toast({
        title: "Creation failed",
        description: "There was an error creating your portfolio.",
        variant: "destructive",
      });
    },
  });

  const filteredTemplates = portfolioTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: typeof portfolioTemplates[0]) => {
    createFromTemplateMutation.mutate(template);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Gallery</h1>
                <p className="text-sm text-gray-600">Choose a template to start building your portfolio</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setLocation('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {templateCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {templateCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="group hover:shadow-lg transition-all">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {template.sections.length} sections
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Preview functionality could be added here
                              toast({
                                title: "Preview coming soon",
                                description: "Template preview will be available soon.",
                              });
                            }}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleUseTemplate(template)}
                            disabled={createFromTemplateMutation.isPending}
                          >
                            {createFromTemplateMutation.isPending ? 'Creating...' : 'Use Template'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}