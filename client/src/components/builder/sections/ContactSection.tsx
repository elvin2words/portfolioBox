import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/types/builder";
import { Edit, Trash2, GripVertical, Mail, Phone, MapPin } from "lucide-react";

interface ContactSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ContactSection({ section, isSelected, onSelect, onDelete }: ContactSectionProps) {
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
          <span>Contact Section</span>
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
            {data.title || 'Get In Touch'}
          </h2>
          <p className="text-lg text-opacity-80">
            {data.description || "Let's work together on your next project"}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-opacity-80">{data.email || 'hello@example.com'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-opacity-80">{data.phone || '+1 (555) 123-4567'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-opacity-80">New York, NY</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {data.showForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" className="bg-white bg-opacity-10 border-opacity-20" />
                <Input placeholder="Last Name" className="bg-white bg-opacity-10 border-opacity-20" />
              </div>
              <Input placeholder="Email" type="email" className="bg-white bg-opacity-10 border-opacity-20" />
              <Input placeholder="Subject" className="bg-white bg-opacity-10 border-opacity-20" />
              <Textarea 
                placeholder="Your message..." 
                rows={5} 
                className="bg-white bg-opacity-10 border-opacity-20 resize-none"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
