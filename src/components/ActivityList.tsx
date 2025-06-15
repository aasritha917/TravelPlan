import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Camera, Coffee, Utensils } from "lucide-react";
import { useDragDrop } from "@/components/DragDropProvider";
import activitiesData from "@/data/activities.json";

interface Activity {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: string;
  description: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'sightseeing': return MapPin;
    case 'culture': return Camera;
    case 'food': return Utensils;
    case 'leisure': return Coffee;
    default: return MapPin;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'sightseeing': return { background: '#3b82f6', color: 'white' };
    case 'culture': return { background: '#7c3aed', color: 'white' };
    case 'food': return { background: '#ef4444', color: 'white' };
    case 'leisure': return { background: '#10b981', color: 'white' };
    default: return { background: '#6b7280', color: 'white' };
  }
};

interface ActivityListProps {
  onSelectActivity: (activityId: string) => void;
}

export const ActivityList = ({ onSelectActivity }: ActivityListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { setDraggedItem } = useDragDrop();

  const activities = activitiesData as Activity[];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(activities.map(a => a.category)));

  const handleDragStart = (activity: Activity) => {
    setDraggedItem({
      id: activity.id,
      type: 'activity',
      title: activity.title,
      duration: activity.duration,
      category: activity.category
    });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6b7280', 
            width: '16px', 
            height: '16px' 
          }} />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '40px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Badge
            style={{
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500',
              ...(selectedCategory === null 
                ? { background: '#3b82f6', color: 'white' }
                : { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' })
            }}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              style={{
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                ...(selectedCategory === category 
                  ? getCategoryColor(category)
                  : { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' })
              }}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: 0
      }}>
        {filteredActivities.map((activity) => {
          const IconComponent = getCategoryIcon(activity.category);
          
          return (
            <Card
              key={activity.id}
              style={{
                cursor: 'grab',
                border: 'none',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              draggable
              onClick={() => onSelectActivity(activity.id)}
              onDragStart={() => handleDragStart(activity)}
              onDragEnd={handleDragEnd}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <CardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>{activity.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      margin: '0 0 4px 0',
                      color: '#1f2937',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.title}
                    </h4>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {activity.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Badge style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        ...getCategoryColor(activity.category)
                      }}>
                        <IconComponent style={{ width: '12px', height: '12px' }} />
                        {activity.category}
                      </Badge>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '11px', 
                        color: '#6b7280'
                      }}>
                        <Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                        {activity.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredActivities.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            padding: '32px'
          }}>
            No activities found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};