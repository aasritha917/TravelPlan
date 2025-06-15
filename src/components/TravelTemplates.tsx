interface TravelTemplate {
  id: string;
  title: string;
  description: string;
  duration: string;
  activities: number;
  gradient: string;
  emoji: string;
}

const templates: TravelTemplate[] = [
  {
    id: 'adventure',
    title: 'Adventure Explorer',
    description: 'Hiking, outdoor activities, and adrenaline-pumping experiences',
    duration: '7 days',
    activities: 12,
    gradient: 'linear-gradient(45deg, #059669, #10b981)',
    emoji: '🏔️'
  },
  {
    id: 'cultural',
    title: 'Cultural Journey',
    description: 'Museums, historical sites, and local cultural experiences',
    duration: '5 days',
    activities: 15,
    gradient: 'linear-gradient(45deg, #7c3aed, #a855f7)',
    emoji: '🏛️'
  },
  {
    id: 'budget',
    title: 'Budget Traveler',
    description: 'Cost-effective activities and budget-friendly accommodations',
    duration: '10 days',
    activities: 18,
    gradient: 'linear-gradient(45deg, #d97706, #f59e0b)',
    emoji: '💰'
  },
  {
    id: 'leisure',
    title: 'Leisure & Relaxation',
    description: 'Spas, beaches, and peaceful moments to unwind',
    duration: '6 days',
    activities: 8,
    gradient: 'linear-gradient(45deg, #0ea5e9, #3b82f6)',
    emoji: '🏖️'
  },
  {
    id: 'family',
    title: 'Family Fun',
    description: 'Kid-friendly activities and family bonding experiences',
    duration: '8 days',
    activities: 20,
    gradient: 'linear-gradient(45deg, #eab308, #facc15)',
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: 'foodie',
    title: 'Culinary Adventure',
    description: 'Food tours, cooking classes, and restaurant experiences',
    duration: '4 days',
    activities: 14,
    gradient: 'linear-gradient(45deg, #dc2626, #ef4444)',
    emoji: '🍜'
  }
];

interface TravelTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TravelTemplates = ({ onSelectTemplate }: TravelTemplatesProps) => {
  return (
    <div className="animate-fade-in">
      <div className="section-title">
        <h3>Choose Your Travel Style</h3>
        <p>
          Start with a template or create a custom itinerary from scratch
        </p>
      </div>
      
      <div className="grid grid-cols-3">
        {templates.map((template, index) => (
          <div 
            key={template.id} 
            className="template-card"
            style={{ 
              animationDelay: `${index * 150}ms`,
              position: 'relative'
            }}
            onClick={() => {
              console.log('Template selected:', template.id);
              onSelectTemplate(template.id);
            }}
          >
            <div className="template-icon" style={{ background: template.gradient }}>
              <span>{template.emoji}</span>
            </div>
            <h4 className="card-title">
              {template.title}
            </h4>
            <p className="card-description mb-4">{template.description}</p>
            
            <div className="template-meta">
              <div className="flex items-center gap-2">
                ⏰ {template.duration}
              </div>
              <div className="flex items-center gap-2">
                📍 {template.activities} activities
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                console.log('Button clicked for template:', template.id);
                onSelectTemplate(template.id);
              }}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
            >
              ✨ Use This Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
