import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Globe, Eye, Copy, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Portfolio } from '@shared/schema';

const createPortfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required"),
  slug: z.string().min(1, "URL slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
});

type CreatePortfolioForm = z.infer<typeof createPortfolioSchema>;

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['/api/portfolios'],
  });

  const form = useForm<CreatePortfolioForm>({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: CreatePortfolioForm) => {
      return apiRequest('POST', '/api/portfolios', {
        ...data,
        sections: [],
        settings: {
          theme: 'modern',
          colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            background: '#ffffff',
            text: '#1f2937',
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
          },
          responsive: {
            mobile: true,
            tablet: true,
            desktop: true,
          },
        },
        isPublished: false,
      });
    },
    onSuccess: (newPortfolio) => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: "Portfolio created",
        description: "Your new portfolio has been created successfully.",
      });
      setIsCreateModalOpen(false);
      form.reset();
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

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/portfolios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: "Portfolio deleted",
        description: "Portfolio has been deleted successfully.",
      });
    },
  });

  const duplicatePortfolioMutation = useMutation({
    mutationFn: async (portfolio: Portfolio) => {
      return apiRequest('POST', '/api/portfolios', {
        name: `${portfolio.name} (Copy)`,
        slug: `${portfolio.slug}-copy-${Date.now()}`,
        sections: portfolio.sections,
        settings: portfolio.settings,
        isPublished: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: "Portfolio duplicated",
        description: "Portfolio has been duplicated successfully.",
      });
    },
  });

  const handleCreatePortfolio = (data: CreatePortfolioForm) => {
    createPortfolioMutation.mutate(data);
  };

  const generateSlugFromName = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('slug', slug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PortfolioBox</h1>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Portfolio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Portfolio</DialogTitle>
                  <DialogDescription>
                    Start building your creative portfolio website.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={form.handleSubmit(handleCreatePortfolio)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Portfolio Name</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="My Creative Portfolio"
                      onChange={(e) => {
                        form.setValue('name', e.target.value);
                        generateSlugFromName(e.target.value);
                      }}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">portfoliobox.com/</span>
                      <Input
                        id="slug"
                        {...form.register('slug')}
                        placeholder="my-portfolio"
                        className="flex-1"
                      />
                    </div>
                    {form.formState.errors.slug && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.slug.message}</p>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createPortfolioMutation.isPending}
                    >
                      {createPortfolioMutation.isPending ? 'Creating...' : 'Create Portfolio'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Manage and edit your creative portfolios.</p>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : portfolios && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio: Portfolio) => (
              <Card key={portfolio.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant={portfolio.isPublished ? "default" : "secondary"}>
                      {portfolio.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg truncate">{portfolio.name}</CardTitle>
                      <CardDescription className="text-sm">
                        portfoliobox.com/{portfolio.slug}
                      </CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocation(`/builder?id=${portfolio.id}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicatePortfolioMutation.mutate(portfolio)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {portfolio.isPublished && (
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Live
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deletePortfolioMutation.mutate(portfolio.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/builder?id=${portfolio.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {portfolio.isPublished && (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No portfolios yet</h3>
            <p className="text-gray-600 mb-6">Create your first portfolio to get started.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Portfolio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}