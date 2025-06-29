import { useState, useCallback, useRef } from 'react';
import { PortfolioState, Section, ViewMode } from '@/types/builder';
import { createDefaultSection } from '@/lib/sectionTemplates';

const defaultPortfolio: PortfolioState = {
  name: 'My Creative Portfolio',
  slug: 'my-portfolio',
  sections: [],
  settings: {
    theme: 'default',
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
};

export const useBuilder = () => {
  const [portfolio, setPortfolio] = useState<PortfolioState>(defaultPortfolio);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<PortfolioState[]>([defaultPortfolio]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newState: PortfolioState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addSection = useCallback((sectionType: string, index?: number) => {
    const newSection = createDefaultSection(sectionType as any);
    const newSections = [...portfolio.sections];
    
    if (index !== undefined) {
      newSections.splice(index, 0, newSection);
    } else {
      newSections.push(newSection);
    }

    const newPortfolio = { ...portfolio, sections: newSections };
    setPortfolio(newPortfolio);
    saveToHistory(newPortfolio);
    setSelectedSectionId(newSection.id);
  }, [portfolio, saveToHistory]);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    const newSections = portfolio.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    const newPortfolio = { ...portfolio, sections: newSections };
    setPortfolio(newPortfolio);
    saveToHistory(newPortfolio);
  }, [portfolio, saveToHistory]);

  const deleteSection = useCallback((sectionId: string) => {
    const newSections = portfolio.sections.filter(section => section.id !== sectionId);
    const newPortfolio = { ...portfolio, sections: newSections };
    setPortfolio(newPortfolio);
    saveToHistory(newPortfolio);
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }, [portfolio, selectedSectionId, saveToHistory]);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    const newSections = Array.from(portfolio.sections);
    const [removed] = newSections.splice(startIndex, 1);
    newSections.splice(endIndex, 0, removed);
    
    const newPortfolio = { ...portfolio, sections: newSections };
    setPortfolio(newPortfolio);
    saveToHistory(newPortfolio);
  }, [portfolio, saveToHistory]);

  const updatePortfolioSettings = useCallback((settings: Partial<PortfolioState['settings']>) => {
    const newPortfolio = { 
      ...portfolio, 
      settings: { ...portfolio.settings, ...settings } 
    };
    setPortfolio(newPortfolio);
    saveToHistory(newPortfolio);
  }, [portfolio, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPortfolio(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPortfolio(history[newIndex]);
    }
  }, [history, historyIndex]);

  const loadPortfolio = useCallback((newPortfolio: PortfolioState) => {
    setPortfolio(newPortfolio);
    setHistory([newPortfolio]);
    setHistoryIndex(0);
    setSelectedSectionId(null);
  }, []);

  const selectedSection = selectedSectionId 
    ? portfolio.sections.find(s => s.id === selectedSectionId) || null 
    : null;

  return {
    portfolio,
    selectedSection,
    selectedSectionId,
    viewMode,
    isPreviewMode,
    isDragging,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
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
  };
};
