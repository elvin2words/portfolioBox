import { Button } from "@/components/ui/button";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface HeroSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function HeroSection({ section, isSelected, onSelect, onDelete }: HeroSectionProps) {
  const styles = section.styles;
  const data = section.data;

  return (
    <div 
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
      }`}
      onClick={onSelect}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        paddingTop: `${styles.padding?.top || 100}px`,
        paddingBottom: `${styles.padding?.bottom || 100}px`,
        paddingLeft: `${styles.padding?.left || 24}px`,
        paddingRight: `${styles.padding?.right || 24}px`,
      }}
    >
      {/* Section Controls */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-2">
        <div className="bg-primary text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <GripVertical className="w-3 h-3" />
          <span>Hero Section</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Background Overlay */}
      {data.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 min-h-[400px] flex items-center justify-center">
        <div className={`max-w-4xl mx-auto text-${styles.textAlign || 'center'}`}>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            {data.title || 'Creative Portfolio'}
          </h1>
          <p className="text-xl mb-8 text-opacity-90">
            {data.subtitle || 'Showcasing beautiful work & innovative design'}
          </p>
          <div className="space-x-4">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {data.ctaText || 'View My Work'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
