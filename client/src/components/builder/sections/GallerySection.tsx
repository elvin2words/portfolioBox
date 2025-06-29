import { Button } from "@/components/ui/button";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface GallerySectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function GallerySection({ section, isSelected, onSelect, onDelete }: GallerySectionProps) {
  const styles = section.styles;
  const data = section.data;
  const columns = styles.columns || 3;

  // Placeholder images for demo
  const placeholderImages = [
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400',
    'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400',
  ];

  const images = data.images && data.images.length > 0 ? data.images : placeholderImages;

  return (
    <div 
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
      }`}
      onClick={onSelect}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        paddingTop: `${styles.padding?.top || 80}px`,
        paddingBottom: `${styles.padding?.bottom || 80}px`,
        paddingLeft: `${styles.padding?.left || 24}px`,
        paddingRight: `${styles.padding?.right || 24}px`,
      }}
    >
      {/* Section Controls */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-2">
        <div className="bg-primary text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <GripVertical className="w-3 h-3" />
          <span>Gallery Section</span>
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

      <div className="max-w-6xl mx-auto">
        <div className={`text-${styles.textAlign || 'center'} mb-16`}>
          <h2 className="text-4xl font-bold mb-4">
            {data.title || 'Featured Work'}
          </h2>
          <p className="text-lg text-opacity-80">
            {data.description || 'A selection of my recent projects and creative endeavors'}
          </p>
        </div>
        
        <div 
          className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}
        >
          {images.slice(0, 6).map((image, index) => (
            <div 
              key={index} 
              className="group/item cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <img 
                src={image} 
                alt={`Gallery item ${index + 1}`}
                className="w-full h-64 object-cover group-hover/item:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
