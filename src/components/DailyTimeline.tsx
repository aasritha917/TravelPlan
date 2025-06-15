import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, X, MapPin } from "lucide-react";
import { useDragDrop } from "@/components/DragDropProvider";

interface ScheduledActivity {
  id: string;
  activityId: string;
  title: string;
  time: string;
  duration: string;
  category: string;
  emoji: string;
}

interface DailyTimelineProps {
  date: Date;
  onSelectActivity: (activityId: string) => void;
}

export const DailyTimeline = ({ date, onSelectActivity }: DailyTimelineProps) => {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([
    {
      id: 'sched-1',
      activityId: '1',
      title: 'Eiffel Tower Visit',
      time: '09:00',
      duration: '2 hours',
      category: 'Sightseeing',
      emoji: '🗼'
    },
    {
      id: 'sched-2',
      activityId: '6',
      title: 'Latin Quarter Café',
      time: '12:00',
      duration: '1 hour',
      category: 'Food',
      emoji: '☕'
    }
  ]);

  const { draggedItem, dropTarget, setDropTarget } = useDragDrop();

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sightseeing': return { background: '#3b82f6', color: 'white' };
      case 'culture': return { background: '#7c3aed', color: 'white' };
      case 'food': return { background: '#ef4444', color: 'white' };
      case 'leisure': return { background: '#10b981', color: 'white' };
      default: return { background: '#6b7280', color: 'white' };
    }
  };

  const handleDrop = (timeSlot: string) => {
    if (draggedItem) {
      const newActivity: ScheduledActivity = {
        id: `sched-${Date.now()}`,
        activityId: draggedItem.id,
        title: draggedItem.title,
        time: timeSlot,
        duration: draggedItem.duration || '1 hour',
        category: draggedItem.category || 'General',
        emoji: '📍'
      };
      
      setScheduledActivities(prev => [...prev, newActivity]);
    }
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    setDropTarget(timeSlot);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const removeActivity = (activityId: string) => {
    setScheduledActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const getActivityAtTime = (timeSlot: string) => {
    return scheduledActivities.find(activity => activity.time === timeSlot);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {timeSlots.map((timeSlot) => {
          const activity = getActivityAtTime(timeSlot);
          const isDropTarget = dropTarget === timeSlot;
          
          return (
            <div
              key={timeSlot}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                borderRadius: '12px',
                border: isDropTarget 
                  ? '2px dashed #3b82f6' 
                  : activity 
                    ? '2px solid transparent' 
                    : '2px dashed #e5e7eb',
                background: isDropTarget 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'transparent',
                transition: 'all 0.2s ease'
              }}
              onDragOver={(e) => handleDragOver(e, timeSlot)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(timeSlot)}
            >
              <div style={{
                width: '64px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Clock style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                {timeSlot}
              </div>
              
              <div style={{ flex: 1 }}>
                {activity ? (
                  <Card 
                    style={{
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      background: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: '12px'
                    }}
                    onClick={() => onSelectActivity(activity.activityId)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <CardContent style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '18px' }}>{activity.emoji}</span>
                          <div>
                            <h4 style={{ 
                              fontWeight: '500', 
                              fontSize: '14px',
                              margin: 0,
                              color: '#1f2937'
                            }}>
                              {activity.title}
                            </h4>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              marginTop: '4px'
                            }}>
                              <Badge style={{
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                ...getCategoryColor(activity.category)
                              }}>
                                {activity.category}
                              </Badge>
                              <span style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                {activity.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeActivity(activity.id);
                          }}
                          style={{
                            height: '32px',
                            width: '32px',
                            padding: 0,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            color: '#6b7280'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: isDropTarget ? '#3b82f6' : '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      {isDropTarget ? 'Drop activity here' : 'Drag an activity here'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
