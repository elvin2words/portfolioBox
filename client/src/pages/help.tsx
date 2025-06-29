import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, Book, MessageCircle, FileText, Video, ArrowLeft, ExternalLink, Lightbulb } from "lucide-react";

const faqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Lightbulb,
    faqs: [
      {
        question: 'How do I create my first portfolio?',
        answer: 'Click "New Portfolio" on the dashboard, choose a template or start from scratch, then drag sections from the sidebar to build your portfolio. Use the properties panel to customize each section.'
      },
      {
        question: 'What sections can I add to my portfolio?',
        answer: 'You can add Hero sections, Image Galleries, About sections, Contact forms, Testimonials, and Services sections. Each section is fully customizable with your content and styling.'
      },
      {
        question: 'How do I customize the appearance of my portfolio?',
        answer: 'Use the theme customizer in the sidebar to change colors, fonts, and layout. You can also select individual sections to modify their specific styling in the properties panel.'
      }
    ]
  },
  {
    id: 'building',
    name: 'Building Portfolios',
    icon: Book,
    faqs: [
      {
        question: 'How do I add images to my portfolio?',
        answer: 'Click on a gallery section or hero section, then use the "Upload Images" button in the properties panel. You can upload multiple images at once and rearrange them as needed.'
      },
      {
        question: 'Can I rearrange sections in my portfolio?',
        answer: 'Yes! Simply drag and drop sections in the canvas area to reorder them. You can also use the drag handles that appear when you hover over sections.'
      },
      {
        question: 'How do I preview my portfolio before publishing?',
        answer: 'Click the "Preview" button in the top toolbar to see how your portfolio will look to visitors. You can also test different device sizes using the responsive preview modes.'
      }
    ]
  },
  {
    id: 'publishing',
    name: 'Publishing & Sharing',
    icon: ExternalLink,
    faqs: [
      {
        question: 'How do I publish my portfolio?',
        answer: 'Once you\'re happy with your portfolio, click the "Publish" button in the top toolbar. Your portfolio will be live at portfoliobox.com/your-slug.'
      },
      {
        question: 'Can I use a custom domain?',
        answer: 'Yes, with Pro and Business plans you can connect your own custom domain. Go to Settings > Billing to upgrade and configure your domain.'
      },
      {
        question: 'How do I share my portfolio?',
        answer: 'After publishing, you can share your portfolio URL with anyone. You can also use the share button to copy the link or generate social media previews.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Billing',
    icon: MessageCircle,
    faqs: [
      {
        question: 'What are the differences between plans?',
        answer: 'Free: 3 portfolios, 1GB storage. Pro: Unlimited portfolios, 50GB storage, custom domains, analytics. Business: Everything in Pro plus team collaboration and white-label options.'
      },
      {
        question: 'How do I upgrade my plan?',
        answer: 'Go to Settings > Billing to view available plans and upgrade. You can change your plan at any time, and upgrades take effect immediately.'
      },
      {
        question: 'Can I export my portfolio data?',
        answer: 'Yes, you can export your settings and portfolio data from Settings > Security. This includes your themes, content, and configurations.'
      }
    ]
  }
];

const tutorials = [
  {
    id: 'first-portfolio',
    title: 'Creating Your First Portfolio',
    description: 'Step-by-step guide to building your first portfolio',
    duration: '5 min',
    difficulty: 'Beginner',
    steps: [
      'Click "New Portfolio" on the dashboard',
      'Choose a template or start from scratch',
      'Add a Hero section with your name and tagline',
      'Upload images to a Gallery section',
      'Add an About section with your bio',
      'Include a Contact section with your details',
      'Customize colors and fonts using the theme editor',
      'Preview your portfolio on different devices',
      'Publish when you\'re ready to share'
    ]
  },
  {
    id: 'advanced-customization',
    title: 'Advanced Theme Customization',
    description: 'Learn to create unique designs with advanced theme options',
    duration: '10 min',
    difficulty: 'Intermediate',
    steps: [
      'Open the theme customizer from the sidebar',
      'Experiment with preset themes as starting points',
      'Create custom color palettes for your brand',
      'Mix and match font pairings for different moods',
      'Configure responsive settings for all devices',
      'Use layout options to control spacing and alignment',
      'Export your theme for use in other portfolios',
      'Import themes from other designers'
    ]
  },
  {
    id: 'seo-optimization',
    title: 'Optimizing for Search Engines',
    description: 'Make your portfolio discoverable online',
    duration: '8 min',
    difficulty: 'Intermediate',
    steps: [
      'Choose descriptive titles for your portfolio',
      'Write compelling descriptions for each section',
      'Use relevant keywords naturally in your content',
      'Optimize image alt texts for accessibility',
      'Set up proper meta descriptions',
      'Configure social media preview images',
      'Submit your portfolio to search engines',
      'Monitor performance with analytics'
    ]
  }
];

const resources = [
  {
    category: 'Design Inspiration',
    items: [
      { name: 'Portfolio Examples Gallery', url: '/templates', type: 'internal' },
      { name: 'Design Trends 2024', url: '#', type: 'external' },
      { name: 'Color Theory Guide', url: '#', type: 'external' },
      { name: 'Typography Best Practices', url: '#', type: 'external' }
    ]
  },
  {
    category: 'Technical Resources',
    items: [
      { name: 'API Documentation', url: '#', type: 'external' },
      { name: 'Custom Domain Setup', url: '#', type: 'guide' },
      { name: 'SEO Optimization Guide', url: '#', type: 'guide' },
      { name: 'Performance Tips', url: '#', type: 'guide' }
    ]
  },
  {
    category: 'Community',
    items: [
      { name: 'User Forum', url: '#', type: 'external' },
      { name: 'Discord Community', url: '#', type: 'external' },
      { name: 'Feature Requests', url: '#', type: 'external' },
      { name: 'Bug Reports', url: '#', type: 'external' }
    ]
  }
];

export default function Help() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                <p className="text-sm text-gray-600">Find answers and learn how to use PortfolioBox</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setLocation('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help topics, tutorials, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials">
              <Video className="w-4 h-4 mr-2" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="guides">
              <FileText className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Book className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            {searchQuery ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Search Results</h2>
                {filteredFaqs.map((category) => (
                  <div key={category.id}>
                    <h3 className="text-lg font-medium mb-4">{category.name}</h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {faqCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <span>{category.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="space-y-2">
                          {category.faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`${category.id}-${index}`}>
                              <AccordionTrigger className="text-left">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-600">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials">
            <div className="grid gap-6">
              {(searchQuery ? filteredTutorials : tutorials).map((tutorial) => (
                <Card key={tutorial.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{tutorial.title}</CardTitle>
                        <CardDescription className="mt-1">{tutorial.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{tutorial.duration}</Badge>
                        <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : 'secondary'}>
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tutorial.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Best Practices</CardTitle>
                  <CardDescription>Tips for creating compelling portfolios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep your portfolio focused and concise</li>
                    <li>• Use high-quality images and consistent styling</li>
                    <li>• Tell your story through your work</li>
                    <li>• Make contact information easy to find</li>
                    <li>• Test on multiple devices and browsers</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Optimization</CardTitle>
                  <CardDescription>Improve your portfolio's visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Use descriptive titles and headings</li>
                    <li>• Add alt text to all images</li>
                    <li>• Include relevant keywords naturally</li>
                    <li>• Optimize loading speed</li>
                    <li>• Submit to search engines</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Design Principles</CardTitle>
                  <CardDescription>Create visually appealing layouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Use consistent spacing and alignment</li>
                    <li>• Choose a cohesive color palette</li>
                    <li>• Maintain visual hierarchy</li>
                    <li>• Balance text and whitespace</li>
                    <li>• Ensure good contrast for readability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Tips</CardTitle>
                  <CardDescription>Optimize your portfolio for speed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Compress images before uploading</li>
                    <li>• Limit the number of sections</li>
                    <li>• Use web-optimized image formats</li>
                    <li>• Test loading speed regularly</li>
                    <li>• Enable caching when possible</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-8">
              {resources.map((resourceCategory) => (
                <div key={resourceCategory.category}>
                  <h3 className="text-lg font-semibold mb-4">{resourceCategory.category}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {resourceCategory.items.map((item) => (
                      <Card key={item.name} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              {item.type === 'external' && <ExternalLink className="w-4 h-4 text-gray-400" />}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>Can't find what you're looking for?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    <Book className="w-4 h-4 mr-2" />
                    Request Feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}