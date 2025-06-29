import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, User, Palette, Globe, Shield, CreditCard, Download, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    bio: string;
    website: string;
    location: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    gridSnap: boolean;
    showRulers: boolean;
    defaultFontFamily: string;
    defaultColorScheme: string;
  };
  notifications: {
    emailUpdates: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
    collaborationNotifications: boolean;
  };
  plan: {
    current: 'free' | 'pro' | 'business';
    portfoliosUsed: number;
    portfoliosLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
}

const defaultSettings: UserSettings = {
  profile: {
    name: 'Creative User',
    email: 'user@example.com',
    bio: 'Passionate creative professional',
    website: 'https://mywebsite.com',
    location: 'New York, NY',
  },
  preferences: {
    theme: 'light',
    autoSave: true,
    gridSnap: true,
    showRulers: false,
    defaultFontFamily: 'Inter',
    defaultColorScheme: 'blue',
  },
  notifications: {
    emailUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
    collaborationNotifications: true,
  },
  plan: {
    current: 'free',
    portfoliosUsed: 2,
    portfoliosLimit: 3,
    storageUsed: 156,
    storageLimit: 1024,
  },
};

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
];

const colorSchemes = [
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
  { value: 'green', label: 'Green', color: '#10b981' },
  { value: 'orange', label: 'Orange', color: '#f59e0b' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
];

const planFeatures = {
  free: {
    name: 'Free',
    price: '$0',
    features: ['3 Portfolios', '1GB Storage', 'Basic Templates', 'Community Support'],
  },
  pro: {
    name: 'Pro',
    price: '$19/month',
    features: ['Unlimited Portfolios', '50GB Storage', 'Premium Templates', 'Priority Support', 'Custom Domain', 'Analytics'],
  },
  business: {
    name: 'Business',
    price: '$49/month',
    features: ['Everything in Pro', '200GB Storage', 'Team Collaboration', 'White Label', 'API Access', 'Custom Integrations'],
  },
};

export default function Settings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newSettings;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfoliobox-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "This feature will be implemented soon. Contact support for assistance.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setLocation('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={saveSettingsMutation.isPending}
              >
                {saveSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Globe className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and public profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.profile.name}
                      onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={settings.profile.bio}
                    onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={settings.profile.website}
                      onChange={(e) => updateSettings('profile', 'website', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={settings.profile.location}
                      onChange={(e) => updateSettings('profile', 'location', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>
                  Customize your portfolio builder experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-gray-600">Choose your preferred theme</p>
                  </div>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => updateSettings('preferences', 'theme', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave">Auto Save</Label>
                    <p className="text-sm text-gray-600">Automatically save changes</p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => updateSettings('preferences', 'autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gridSnap">Grid Snap</Label>
                    <p className="text-sm text-gray-600">Snap elements to grid</p>
                  </div>
                  <Switch
                    id="gridSnap"
                    checked={settings.preferences.gridSnap}
                    onCheckedChange={(checked) => updateSettings('preferences', 'gridSnap', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showRulers">Show Rulers</Label>
                    <p className="text-sm text-gray-600">Display rulers in editor</p>
                  </div>
                  <Switch
                    id="showRulers"
                    checked={settings.preferences.showRulers}
                    onCheckedChange={(checked) => updateSettings('preferences', 'showRulers', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="defaultFont">Default Font Family</Label>
                  <Select
                    value={settings.preferences.defaultFontFamily}
                    onValueChange={(value) => updateSettings('preferences', 'defaultFontFamily', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultColor">Default Color Scheme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          settings.preferences.defaultColorScheme === scheme.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateSettings('preferences', 'defaultColorScheme', scheme.value)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: scheme.color }}
                          ></div>
                          <span className="text-sm font-medium">{scheme.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                    <p className="text-sm text-gray-600">Receive updates about new features</p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={settings.notifications.emailUpdates}
                    onCheckedChange={(checked) => updateSettings('notifications', 'emailUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional content</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => updateSettings('notifications', 'marketingEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="securityAlerts">Security Alerts</Label>
                    <p className="text-sm text-gray-600">Important security notifications</p>
                  </div>
                  <Switch
                    id="securityAlerts"
                    checked={settings.notifications.securityAlerts}
                    onCheckedChange={(checked) => updateSettings('notifications', 'securityAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="collaborationNotifications">Collaboration</Label>
                    <p className="text-sm text-gray-600">Notifications about shared portfolios</p>
                  </div>
                  <Switch
                    id="collaborationNotifications"
                    checked={settings.notifications.collaborationNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'collaborationNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{planFeatures[settings.plan.current].name} Plan</h3>
                    <p className="text-gray-600">{planFeatures[settings.plan.current].price}</p>
                  </div>
                  <Badge variant={settings.plan.current === 'free' ? 'secondary' : 'default'}>
                    {settings.plan.current.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Portfolios Used</span>
                      <span>{settings.plan.portfoliosUsed} / {settings.plan.portfoliosLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(settings.plan.portfoliosUsed / settings.plan.portfoliosLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Used</span>
                      <span>{settings.plan.storageUsed}MB / {settings.plan.storageLimit}MB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(settings.plan.storageUsed / settings.plan.storageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {settings.plan.current === 'free' && (
                  <Button className="w-full">
                    Upgrade to Pro
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(planFeatures).map(([key, plan]) => (
                <Card key={key} className={settings.plan.current === key ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      <span className="text-2xl font-bold">{plan.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant={settings.plan.current === key ? 'outline' : 'default'}
                      disabled={settings.plan.current === key}
                    >
                      {settings.plan.current === key ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage your data and privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={handleExportData} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Danger Zone</h4>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}