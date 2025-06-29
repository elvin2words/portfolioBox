import { Button } from "@/components/ui/button";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface AboutSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function AboutSection({ section, isSelected, onSelect, onDelete }: AboutSectionProps) {
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
          <span>About Section</span>
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={data.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
              alt="Profile"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
          <div className={`text-${styles.textAlign || 'left'}`}>
            <h2 className="text-4xl font-bold mb-6">
              {data.title || 'About Me'}
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              {data.content || "I'm a passionate creative with years of experience in design and digital arts. My work focuses on creating meaningful connections between brands and their audiences."}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-opacity-80">8+ Years</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Projects</h3>
                <p className="text-opacity-80">150+ Completed</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Clients</h3>
                <p className="text-opacity-80">50+ Happy</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Awards</h3>
                <p className="text-opacity-80">12 Design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
