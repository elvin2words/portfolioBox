import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DropResult } from '@hello-pangea/dnd';
import { DragDropProvider } from '@/components/DragDropProvider';
import { Sidebar } from '@/components/builder/Sidebar';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { MediaUploadModal } from '@/components/MediaUploadModal';
import { ThemeCustomizer } from '@/components/builder/ThemeCustomizer';
import { useBuilder } from '@/hooks/useBuilder';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Portfolio } from '@shared/schema';

export default function Builder() {
  const {
    portfolio,
    selectedSection,
    selectedSectionId,
    viewMode,
    isPreviewMode,
    isDragging,
    canUndo,
    canRedo,
    setSelectedSectionId,
    setViewMode,
    setIsPreviewMode,
    setIsDragging,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    updatePortfolioSettings,
    loadPortfolio,
    undo,
    redo,
  } = useBuilder();

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load portfolio data
  const { data: portfolios } = useQuery({
    queryKey: ['/api/portfolios'],
  });

  // Save portfolio mutation
  const savePortfolioMutation = useMutation({
    mutationFn: async (portfolioData: any) => {
      if (portfolio.id) {
        return apiRequest('PUT', `/api/portfolios/${portfolio.id}`, portfolioData);
      } else {
        return apiRequest('POST', '/api/portfolios', portfolioData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: "Portfolio saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "There was an error saving your portfolio.",
        variant: "destructive",
      });
    },
  });

  // Upload media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const portfolioId = portfolio.id || 1; // Default to 1 for demo
      return apiRequest('POST', `/api/portfolios/${portfolioId}/media`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your media files have been uploaded.",
      });
    },
  });

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Handle drag from sidebar to canvas
    if (source.droppableId === 'sidebar-sections' && destination.droppableId === 'canvas-sections') {
      const sectionType = draggableId.replace('sidebar-', '');
      addSection(sectionType, destination.index);
      return;
    }

    // Handle reordering within canvas
    if (source.droppableId === 'canvas-sections' && destination.droppableId === 'canvas-sections') {
      reorderSections(source.index, destination.index);
      return;
    }
  }, [addSection, reorderSections, setIsDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleSavePortfolio = useCallback(() => {
    const portfolioData = {
      name: portfolio.name,
      slug: portfolio.slug,
      sections: portfolio.sections,
      settings: portfolio.settings,
      isPublished: portfolio.isPublished,
    };
    savePortfolioMutation.mutate(portfolioData);
  }, [portfolio, savePortfolioMutation]);

  const handlePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode, setIsPreviewMode]);

  const handlePublish = useCallback(() => {
    const portfolioData = {
      ...portfolio,
      isPublished: true,
    };
    savePortfolioMutation.mutate(portfolioData);
  }, [portfolio, savePortfolioMutation]);

  const handleUploadMedia = useCallback(async (files: File[]) => {
    await uploadMediaMutation.mutateAsync(files);
    setIsMediaModalOpen(false);
  }, [uploadMediaMutation]);

  return (
    <div className="h-screen bg-gray-50 flex">
      <DragDropProvider 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Sidebar
          projectName={portfolio.name}
          onSave={handleSavePortfolio}
          onPreview={handlePreview}
          onAddSection={addSection}
          onOpenThemeCustomizer={() => setIsThemeCustomizerOpen(true)}
        />

        <Canvas
          sections={portfolio.sections}
          selectedSectionId={selectedSectionId}
          viewMode={viewMode}
          canUndo={canUndo}
          canRedo={canRedo}
          onSelectSection={setSelectedSectionId}
          onSetViewMode={setViewMode}
          onDeleteSection={deleteSection}
          onUndo={undo}
          onRedo={redo}
          onPreview={handlePreview}
          onPublish={handlePublish}
        />

        <PropertiesPanel
          selectedSection={selectedSection}
          onUpdateSection={updateSection}
          onUploadMedia={() => setIsMediaModalOpen(true)}
        />
      </DragDropProvider>

      <MediaUploadModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onUpload={handleUploadMedia}
        portfolioId={portfolio.id}
      />

      <ThemeCustomizer
        portfolio={portfolio}
        onUpdateSettings={updatePortfolioSettings}
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
      />
    </div>
  );
}
