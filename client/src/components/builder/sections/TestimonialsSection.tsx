import { Button } from "@/components/ui/button";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical, Quote } from "lucide-react";

interface TestimonialsSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function TestimonialsSection({ section, isSelected, onSelect, onDelete }: TestimonialsSectionProps) {
  const styles = section.styles;
  const data = section.data;

  const defaultTestimonials = [
    {
      quote: "Amazing work and great communication throughout the project. Highly recommended!",
      author: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "Professional, creative, and delivered exactly what we needed on time.",
      author: "Michael Chen",
      role: "Marketing Director, CreativeCorp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const testimonials = data.testimonials || defaultTestimonials;

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
          <span>Testimonials Section</span>
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
            {data.title || 'What Clients Say'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <blockquote className="text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <cite className="font-semibold not-italic">{testimonial.author}</cite>
                  <p className="text-sm text-opacity-80">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
