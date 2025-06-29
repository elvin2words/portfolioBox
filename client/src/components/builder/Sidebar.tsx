import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sectionTypes } from "@/lib/sectionTemplates";
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Palette, Save, Eye } from "lucide-react";

interface SidebarProps {
  projectName: string;
  onSave: () => void;
  onPreview: () => void;
  onAddSection: (sectionType: string) => void;
  onOpenThemeCustomizer?: () => void;
}

export function Sidebar({ projectName, onSave, onPreview, onAddSection, onOpenThemeCustomizer }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-semibold text-gray-900">PortfolioBox</h1>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{projectName}</span>
          <span className="text-xs text-gray-500">Draft</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={onSave}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={onPreview}
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sections" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="sections" className="p-4 space-y-4 m-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Portfolio Sections</h3>
              <Droppable droppableId="sidebar-sections" isDropDisabled={true}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {sectionTypes.map((section, index) => (
                      <Draggable
                        key={section.type}
                        draggableId={`sidebar-${section.type}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-grab hover:shadow-md transition-all ${
                              snapshot.isDragging ? 'shadow-lg rotate-3' : ''
                            }`}
                            onClick={() => onAddSection(section.type)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
                                  <i className={`fas fa-${section.icon} text-sm`}></i>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{section.name}</div>
                                  <div className="text-xs text-gray-500">{section.description}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="p-4 space-y-4 m-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <i className="fas fa-camera mr-2 text-gray-400"></i>
                  Photographer
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <i className="fas fa-pencil-ruler mr-2 text-gray-400"></i>
                  Designer
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <i className="fas fa-brush mr-2 text-gray-400"></i>
                  Artist
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="p-4 space-y-4 m-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Theme Options</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={onOpenThemeCustomizer}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Customize Theme
                </Button>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600 mb-2">Quick Themes</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-1"></div>
                      <div className="text-xs">Modern</div>
                    </div>
                    <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-6 bg-gradient-to-r from-gray-800 to-gray-600 rounded mb-1"></div>
                      <div className="text-xs">Dark</div>
                    </div>
                    <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-6 bg-gradient-to-r from-white to-gray-100 rounded mb-1 border"></div>
                      <div className="text-xs">Minimal</div>
                    </div>
                    <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded mb-1"></div>
                      <div className="text-xs">Vibrant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
