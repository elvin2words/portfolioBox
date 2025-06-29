import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Section } from "@/types/builder";
import { MousePointer, Upload, Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  selectedSection: Section | null;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onUploadMedia: () => void;
}

export function PropertiesPanel({ 
  selectedSection, 
  onUpdateSection, 
  onUploadMedia 
}: PropertiesPanelProps) {
  
  const updateSectionData = (key: string, value: any) => {
    if (!selectedSection) return;
    
    onUpdateSection(selectedSection.id, {
      data: { ...selectedSection.data, [key]: value }
    });
  };

  const updateSectionStyles = (key: string, value: any) => {
    if (!selectedSection) return;
    
    onUpdateSection(selectedSection.id, {
      styles: { ...selectedSection.styles, [key]: value }
    });
  };

  if (!selectedSection) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Properties</h2>
          <p className="text-sm text-gray-500">Configure selected element</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MousePointer className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No element selected</p>
            <p className="text-sm text-gray-500">Click on an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Properties</h2>
        <p className="text-sm text-gray-500">{selectedSection.type} Section</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Basic Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600">Section ID</Label>
              <Input 
                value={selectedSection.id}
                className="text-sm"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedSection.data.title !== undefined && (
              <div>
                <Label className="text-xs font-medium text-gray-600">Title</Label>
                <Input
                  value={selectedSection.data.title || ''}
                  onChange={(e) => updateSectionData('title', e.target.value)}
                  placeholder="Enter title..."
                  className="text-sm"
                />
              </div>
            )}
            
            {selectedSection.data.subtitle !== undefined && (
              <div>
                <Label className="text-xs font-medium text-gray-600">Subtitle</Label>
                <Input
                  value={selectedSection.data.subtitle || ''}
                  onChange={(e) => updateSectionData('subtitle', e.target.value)}
                  placeholder="Enter subtitle..."
                  className="text-sm"
                />
              </div>
            )}
            
            {selectedSection.data.description !== undefined && (
              <div>
                <Label className="text-xs font-medium text-gray-600">Description</Label>
                <Textarea
                  value={selectedSection.data.description || ''}
                  onChange={(e) => updateSectionData('description', e.target.value)}
                  placeholder="Enter description..."
                  className="text-sm resize-none"
                  rows={3}
                />
              </div>
            )}
            
            {selectedSection.data.content !== undefined && (
              <div>
                <Label className="text-xs font-medium text-gray-600">Content</Label>
                <Textarea
                  value={selectedSection.data.content || ''}
                  onChange={(e) => updateSectionData('content', e.target.value)}
                  placeholder="Enter content..."
                  className="text-sm resize-none"
                  rows={4}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Layout Settings */}
        {selectedSection.type === 'gallery' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-2 block">Columns</Label>
                <Slider
                  value={[selectedSection.styles.columns || 3]}
                  onValueChange={([value]) => updateSectionStyles('columns', value)}
                  min={1}
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span><span>2</span><span>3</span><span>4</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600">Spacing</Label>
                <Select
                  value={selectedSection.styles.spacing || 'medium'}
                  onValueChange={(value) => updateSectionStyles('spacing', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Management */}
        {(selectedSection.type === 'gallery' || selectedSection.type === 'hero' || selectedSection.type === 'about') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-dashed text-sm"
                onClick={onUploadMedia}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
              
              {selectedSection.data.images && selectedSection.data.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedSection.data.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded border overflow-hidden group relative">
                      <img 
                        src={image} 
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newImages = selectedSection.data.images?.filter((_, i) => i !== index);
                          updateSectionData('images', newImages);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Style Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Background Color</Label>
              <div className="flex space-x-2">
                {['#ffffff', '#f3f4f6', '#1f2937', '#6366f1'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 cursor-pointer ${
                      selectedSection.styles.backgroundColor === color 
                        ? 'border-primary' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSectionStyles('backgroundColor', color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600 mb-2 block">Text Color</Label>
              <div className="flex space-x-2">
                {['#1f2937', '#4b5563', '#ffffff', '#6366f1'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 cursor-pointer ${
                      selectedSection.styles.textColor === color 
                        ? 'border-primary' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSectionStyles('textColor', color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">Text Alignment</Label>
              <div className="flex space-x-1 mt-2">
                {[
                  { value: 'left', icon: 'align-left' },
                  { value: 'center', icon: 'align-center' },
                  { value: 'right', icon: 'align-right' }
                ].map(({ value, icon }) => (
                  <Button
                    key={value}
                    variant={selectedSection.styles.textAlign === value ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => updateSectionStyles('textAlign', value)}
                  >
                    <i className={`fas fa-${icon}`}></i>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Spacing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-medium text-gray-600">Padding Top</Label>
                <Slider
                  value={[selectedSection.styles.padding?.top || 80]}
                  onValueChange={([value]) => updateSectionStyles('padding', {
                    ...selectedSection.styles.padding,
                    top: value
                  })}
                  min={0}
                  max={200}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{selectedSection.styles.padding?.top || 80}px</span>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Padding Bottom</Label>
                <Slider
                  value={[selectedSection.styles.padding?.bottom || 80]}
                  onValueChange={([value]) => updateSectionStyles('padding', {
                    ...selectedSection.styles.padding,
                    bottom: value
                  })}
                  min={0}
                  max={200}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{selectedSection.styles.padding?.bottom || 80}px</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button className="w-full">
          Apply Changes
        </Button>
        <Button variant="outline" className="w-full">
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
