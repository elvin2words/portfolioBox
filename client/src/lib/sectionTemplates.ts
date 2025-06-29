import { Section, SectionType } from "@/types/builder";

export const createDefaultSection = (type: SectionType): Section => {
  const templates: Record<SectionType, Section> = {
    hero: {
      id: `hero-${Date.now()}`,
      type: 'hero',
      data: {
        title: 'Creative Portfolio',
        subtitle: 'Showcasing beautiful work & innovative design',
        ctaText: 'View My Work',
        backgroundImage: '',
      },
      styles: {
        backgroundColor: '#1e293b',
        textColor: '#ffffff',
        textAlign: 'center',
        padding: { top: 100, bottom: 100, left: 24, right: 24 },
        fontSize: 'large',
      },
    },
    gallery: {
      id: `gallery-${Date.now()}`,
      type: 'gallery',
      data: {
        title: 'Featured Work',
        description: 'A selection of my recent projects and creative endeavors',
        images: [],
        layout: 'grid',
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        textAlign: 'center',
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
        columns: 3,
        spacing: 'medium',
      },
    },
    about: {
      id: `about-${Date.now()}`,
      type: 'about',
      data: {
        title: 'About Me',
        content: 'I\'m a passionate creative with years of experience in design and digital arts.',
        image: '',
        skills: [],
      },
      styles: {
        backgroundColor: '#f9fafb',
        textColor: '#1f2937',
        textAlign: 'left',
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
      },
    },
    contact: {
      id: `contact-${Date.now()}`,
      type: 'contact',
      data: {
        title: 'Get In Touch',
        description: 'Let\'s work together on your next project',
        email: 'hello@example.com',
        phone: '+1 (555) 123-4567',
        showForm: true,
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        textAlign: 'center',
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
      },
    },
    testimonials: {
      id: `testimonials-${Date.now()}`,
      type: 'testimonials',
      data: {
        title: 'What Clients Say',
        testimonials: [
          {
            quote: 'Amazing work and great communication throughout the project.',
            author: 'Client Name',
            role: 'CEO, Company',
            avatar: '',
          },
        ],
      },
      styles: {
        backgroundColor: '#f9fafb',
        textColor: '#1f2937',
        textAlign: 'center',
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
      },
    },
    services: {
      id: `services-${Date.now()}`,
      type: 'services',
      data: {
        title: 'My Services',
        description: 'What I can help you with',
        services: [
          {
            title: 'Web Design',
            description: 'Modern, responsive websites',
            icon: 'globe',
          },
          {
            title: 'Branding',
            description: 'Logo and brand identity design',
            icon: 'palette',
          },
        ],
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        textAlign: 'center',
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
        columns: 2,
      },
    },
  };

  return templates[type];
};

export const sectionTypes = [
  {
    type: 'hero' as SectionType,
    name: 'Hero Section',
    description: 'Full-width cover with title',
    icon: 'image',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    type: 'gallery' as SectionType,
    name: 'Image Gallery',
    description: 'Showcase your work',
    icon: 'th',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    type: 'about' as SectionType,
    name: 'About Me',
    description: 'Personal info & bio',
    icon: 'user',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    type: 'contact' as SectionType,
    name: 'Contact',
    description: 'Contact form & details',
    icon: 'envelope',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    type: 'testimonials' as SectionType,
    name: 'Testimonials',
    description: 'Client reviews',
    icon: 'quote-left',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    type: 'services' as SectionType,
    name: 'Services',
    description: 'What you offer',
    icon: 'briefcase',
    color: 'bg-purple-100 text-purple-600',
  },
];
