import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section, ViewMode } from "@/types/builder";
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Undo, Redo, Eye, Rocket, Menu, Monitor, Tablet, Smartphone } from "lucide-react";
import { HeroSection } from "./sections/HeroSection";
import { GallerySection } from "./sections/GallerySection";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ServicesSection } from "./sections/ServicesSection";

interface CanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  viewMode: ViewMode;
  canUndo: boolean;
  canRedo: boolean;
  onSelectSection: (sectionId: string | null) => void;
  onSetViewMode: (mode: ViewMode) => void;
  onDeleteSection: (sectionId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onPublish: () => void;
}

const SectionComponent = ({ section, isSelected, onSelect, onDelete }: {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) => {
  const sectionProps = {
    section,
    isSelected,
    onSelect,
    onDelete,
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

export function Canvas({
  sections,
  selectedSectionId,
  viewMode,
  canUndo,
  canRedo,
  onSelectSection,
  onSetViewMode,
  onDeleteSection,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
}: CanvasProps) {
  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="h-4 w-px bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex bg-gray-100 rounded p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => onSetViewMode('desktop')}
              >
                <Monitor className="w-3 h-3 mr-1" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => onSetViewMode('tablet')}
              >
                <Tablet className="w-3 h-3 mr-1" />
                Tablet
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => onSetViewMode('mobile')}
              >
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={onPublish}>
            <Rocket className="w-4 h-4 mr-1" />
            Publish
          </Button>
        </div>
      </div>

      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Canvas</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Zoom:</span>
          <Select defaultValue="100">
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-100 overflow-auto p-4">
        <div className={`mx-auto ${getCanvasWidth()}`}>
          <div className="bg-white rounded-lg shadow-sm min-h-screen">
            {/* Browser Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 rounded-t-lg flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-6">
                <div className="bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
                  <i className="fas fa-lock mr-2"></i>
                  myportfolio.portfoliobox.com
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <Droppable droppableId="canvas-sections">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-screen p-6 ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onSelectSection(null)}
                >
                  {sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-4 ${
                            snapshot.isDragging ? 'shadow-2xl rotate-1' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSection(section.id);
                          }}
                        >
                          <div {...provided.dragHandleProps}>
                            <SectionComponent
                              section={section}
                              isSelected={selectedSectionId === section.id}
                              onSelect={() => onSelectSection(section.id)}
                              onDelete={() => onDeleteSection(section.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  
                  {sections.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                      <div className="mb-4">
                        <i className="fas fa-plus-circle text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-lg font-medium mb-2">Start building your portfolio</p>
                      <p className="text-sm">Drag sections from the sidebar to get started</p>
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </div>
  );
}
