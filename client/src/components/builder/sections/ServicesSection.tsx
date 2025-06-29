import { Button } from "@/components/ui/button";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical, Globe, Palette, Briefcase, Camera } from "lucide-react";

interface ServicesSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const iconMap = {
  globe: Globe,
  palette: Palette,
  briefcase: Briefcase,
  camera: Camera,
};

export function ServicesSection({ section, isSelected, onSelect, onDelete }: ServicesSectionProps) {
  const styles = section.styles;
  const data = section.data;

  const defaultServices = [
    {
      title: "Web Design",
      description: "Modern, responsive websites that engage your audience",
      icon: "globe"
    },
    {
      title: "Branding",
      description: "Complete brand identity design from concept to execution",
      icon: "palette"
    },
    {
      title: "Consulting",
      description: "Strategic guidance for your digital transformation",
      icon: "briefcase"
    },
    {
      title: "Photography",
      description: "Professional photography for your brand and products",
      icon: "camera"
    }
  ];

  const services = data.services || defaultServices;
  const columns = styles.columns || 2;

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
          <span>Services Section</span>
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
            {data.title || 'My Services'}
          </h2>
          <p className="text-lg text-opacity-80">
            {data.description || 'What I can help you with'}
          </p>
        </div>
        
        <div className={`grid gap-8 grid-cols-1 md:grid-cols-${columns}`}>
          {services.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Briefcase;
            
            return (
              <div key={index} className="bg-white bg-opacity-10 rounded-xl p-8 text-center backdrop-blur-sm hover:bg-opacity-20 transition-all">
                <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-opacity-80 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
