export interface Section {
  id: string;
  type: SectionType;
  data: SectionData;
  styles: SectionStyles;
}

export type SectionType = 'hero' | 'gallery' | 'about' | 'contact' | 'testimonials' | 'services';

export interface SectionData {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  items?: any[];
  [key: string]: any;
}

export interface SectionStyles {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  layout?: string;
  columns?: number;
  spacing?: 'small' | 'medium' | 'large';
}

export interface PortfolioState {
  id?: number;
  name: string;
  slug: string;
  sections: Section[];
  settings: {
    theme: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    responsive: {
      mobile: boolean;
      tablet: boolean;
      desktop: boolean;
    };
  };
  isPublished: boolean;
}

export interface DragItem {
  id: string;
  type: 'section' | 'element';
  sectionType?: SectionType;
  elementType?: string;
  index?: number;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
