import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Layout, Sparkles, Download, Upload, RotateCcw } from "lucide-react";
import { PortfolioState } from '@/types/builder';

interface ThemeCustomizerProps {
  portfolio: PortfolioState;
  onUpdateSettings: (settings: Partial<PortfolioState['settings']>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const presetThemes = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: '#ffffff',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#333333',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary and sleek',
    preview: '#6366f1',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    }
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined',
    preview: '#1e293b',
    colors: {
      primary: '#1e293b',
      secondary: '#475569',
      background: '#f8fafc',
      text: '#0f172a',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Merriweather',
    }
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and energetic',
    preview: '#ec4899',
    colors: {
      primary: '#ec4899',
      secondary: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Inter',
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Professional dark theme',
    preview: '#0f172a',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#0f172a',
      text: '#f1f5f9',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    }
  }
];

const fontPairings = [
  { heading: 'Inter', body: 'Inter', name: 'Modern Sans' },
  { heading: 'Poppins', body: 'Inter', name: 'Friendly Modern' },
  { heading: 'Playfair Display', body: 'Merriweather', name: 'Classic Serif' },
  { heading: 'Montserrat', body: 'Open Sans', name: 'Clean Professional' },
  { heading: 'Oswald', body: 'Lato', name: 'Strong & Light' },
  { heading: 'Roboto Slab', body: 'Roboto', name: 'Tech Modern' },
];

const colorPalettes = [
  { name: 'Blue Ocean', primary: '#0ea5e9', secondary: '#0284c7', background: '#f0f9ff', text: '#0c4a6e' },
  { name: 'Purple Magic', primary: '#8b5cf6', secondary: '#a855f7', background: '#faf5ff', text: '#581c87' },
  { name: 'Green Nature', primary: '#10b981', secondary: '#059669', background: '#f0fdf4', text: '#064e3b' },
  { name: 'Orange Sunset', primary: '#f59e0b', secondary: '#d97706', background: '#fffbeb', text: '#92400e' },
  { name: 'Pink Blossom', primary: '#ec4899', secondary: '#db2777', background: '#fdf2f8', text: '#831843' },
  { name: 'Red Energy', primary: '#ef4444', secondary: '#dc2626', background: '#fef2f2', text: '#991b1b' },
];

export function ThemeCustomizer({ portfolio, onUpdateSettings, isOpen, onClose }: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState('presets');
  const [customColors, setCustomColors] = useState(portfolio.settings.colors);
  const [customFonts, setCustomFonts] = useState(portfolio.settings.fonts);

  const applyPresetTheme = (theme: typeof presetThemes[0]) => {
    onUpdateSettings({
      theme: theme.id,
      colors: theme.colors,
      fonts: theme.fonts,
    });
    setCustomColors(theme.colors);
    setCustomFonts(theme.fonts);
  };

  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    const newColors = {
      primary: palette.primary,
      secondary: palette.secondary,
      background: palette.background,
      text: palette.text,
    };
    setCustomColors(newColors);
    onUpdateSettings({ colors: newColors });
  };

  const applyFontPairing = (pairing: typeof fontPairings[0]) => {
    const newFonts = {
      heading: pairing.heading,
      body: pairing.body,
    };
    setCustomFonts(newFonts);
    onUpdateSettings({ fonts: newFonts });
  };

  const updateCustomColor = (colorType: string, value: string) => {
    const newColors = { ...customColors, [colorType]: value };
    setCustomColors(newColors);
    onUpdateSettings({ colors: newColors });
  };

  const exportTheme = () => {
    const themeData = {
      colors: customColors,
      fonts: customFonts,
      name: `${portfolio.name} Theme`,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${portfolio.slug}-theme.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    const defaultTheme = presetThemes[1]; // Modern theme
    applyPresetTheme(defaultTheme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
          <DialogDescription>
            Customize the visual appearance of your portfolio with themes, colors, and typography.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="presets">
              <Sparkles className="w-4 h-4 mr-2" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
          </TabsList>

          {/* Preset Themes */}
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presetThemes.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    portfolio.settings.theme === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => applyPresetTheme(theme)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{theme.name}</CardTitle>
                      {portfolio.settings.theme === theme.id && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">{theme.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded border" 
                        style={{ backgroundColor: theme.colors.background }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: theme.colors.text }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {theme.fonts.heading} / {theme.fonts.body}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Color Customization */}
          <TabsContent value="colors" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Color Palettes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorPalettes.map((palette) => (
                  <Card 
                    key={palette.name} 
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => applyColorPalette(palette)}
                  >
                    <CardContent className="p-3">
                      <div className="flex space-x-1 mb-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }}></div>
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: palette.background }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.text }}></div>
                      </div>
                      <p className="text-xs font-medium">{palette.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => updateCustomColor('primary', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customColors.primary}
                      onChange={(e) => updateCustomColor('primary', e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => updateCustomColor('secondary', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customColors.secondary}
                      onChange={(e) => updateCustomColor('secondary', e.target.value)}
                      placeholder="#666666"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="background-color"
                      type="color"
                      value={customColors.background}
                      onChange={(e) => updateCustomColor('background', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customColors.background}
                      onChange={(e) => updateCustomColor('background', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="text-color"
                      type="color"
                      value={customColors.text}
                      onChange={(e) => updateCustomColor('text', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={customColors.text}
                      onChange={(e) => updateCustomColor('text', e.target.value)}
                      placeholder="#333333"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Font Pairings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fontPairings.map((pairing, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      customFonts.heading === pairing.heading && customFonts.body === pairing.body 
                        ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => applyFontPairing(pairing)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <p className="font-semibold" style={{ fontFamily: pairing.heading }}>
                          Heading Font
                        </p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: pairing.body }}>
                          Body text sample
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {pairing.name}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Fonts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select
                    value={customFonts.heading}
                    onValueChange={(value) => {
                      const newFonts = { ...customFonts, heading: value };
                      setCustomFonts(newFonts);
                      onUpdateSettings({ fonts: newFonts });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="Oswald">Oswald</SelectItem>
                      <SelectItem value="Roboto Slab">Roboto Slab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select
                    value={customFonts.body}
                    onValueChange={(value) => {
                      const newFonts = { ...customFonts, body: value };
                      setCustomFonts(newFonts);
                      onUpdateSettings({ fonts: newFonts });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Layout Options */}
          <TabsContent value="layout" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Responsive Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mobile-responsive">Mobile Responsive</Label>
                    <p className="text-sm text-gray-600">Optimize for mobile devices</p>
                  </div>
                  <Switch
                    id="mobile-responsive"
                    checked={portfolio.settings.responsive.mobile}
                    onCheckedChange={(checked) => 
                      onUpdateSettings({
                        responsive: { ...portfolio.settings.responsive, mobile: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tablet-responsive">Tablet Responsive</Label>
                    <p className="text-sm text-gray-600">Optimize for tablet devices</p>
                  </div>
                  <Switch
                    id="tablet-responsive"
                    checked={portfolio.settings.responsive.tablet}
                    onCheckedChange={(checked) => 
                      onUpdateSettings({
                        responsive: { ...portfolio.settings.responsive, tablet: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="desktop-responsive">Desktop Responsive</Label>
                    <p className="text-sm text-gray-600">Optimize for desktop devices</p>
                  </div>
                  <Switch
                    id="desktop-responsive"
                    checked={portfolio.settings.responsive.desktop}
                    onCheckedChange={(checked) => 
                      onUpdateSettings({
                        responsive: { ...portfolio.settings.responsive, desktop: checked }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="w-4 h-4 mr-2" />
              Export Theme
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Theme
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClose}>
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}