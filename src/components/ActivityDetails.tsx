import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Clock, MapPin, DollarSign, Star, Users, Calendar } from "lucide-react";
import activitiesData from "../data/activities.json";

interface ActivityDetailsProps {
  activityId: string | null;
}

export const ActivityDetails = ({ activityId }: ActivityDetailsProps) => {
  if (!activityId) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <MapPin style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", opacity: 0.5 }} />
        <p>Select an activity to view details</p>
      </div>
    );
  }

  const activity = activitiesData.find(a => a.id === activityId);

  if (!activity) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <MapPin style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", opacity: 0.5 }} />
        <p>Activity not found</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sightseeing': return { backgroundColor: "#3B82F6", color: "white" };
      case 'culture': return { backgroundColor: "#8B5CF6", color: "white" };
      case 'food': return { backgroundColor: "#F87171", color: "white" };
      case 'leisure': return { backgroundColor: "#10B981", color: "white" };
      default: return { backgroundColor: "#6B7280", color: "white" };
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>{activity.icon}</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>{activity.title}</h3>
          <Badge style={getCategoryColor(activity.category)}>
            {activity.category}
          </Badge>
        </div>

        {/* Quick Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", fontSize: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Clock style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6B7280" }} />
            <span>{activity.duration}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DollarSign style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6B7280" }} />
            <span>{activity.price}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gridColumn: "span 2" }}>
            <Star style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", fill: "#FBBF24", color: "#FBBF24" }} />
            <span>{activity.rating} ({activity.reviews.toLocaleString()} reviews)</span>
          </div>
        </div>

        {/* Address */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: 500 }}>
            <MapPin style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", color: "#6B7280" }} />
            Location
          </div>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", paddingLeft: "1.5rem" }}>{activity.address}</p>
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{ fontWeight: 500, fontSize: "0.875rem" }}>Description</h4>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: "1.625" }}>
            {activity.description}
          </p>
        </div>

        {/* Highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{ fontWeight: 500, fontSize: "0.875rem" }}>Highlights</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {activity.highlights.map((highlight: string, index: number) => (
              <div key={index} style={{ display: "flex", alignItems: "center", fontSize: "0.875rem" }}>
                <div style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "#3B82F6", borderRadius: "9999px", marginRight: "0.75rem" }}></div>
                {highlight}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{ fontWeight: 500, fontSize: "0.875rem" }}>Tips</h4>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: "1.625", backgroundColor: "#DBEAFE", padding: "0.75rem", borderRadius: "0.5rem" }}>
            {activity.tips}
          </p>
        </div>

        {/* Schedule Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid #E5E7EB", paddingTop: "1rem" }}>
          <h4 style={{ fontWeight: 500, fontSize: "0.875rem", display: "flex", alignItems: "center" }}>
            <Calendar style={{ width: "1rem", height: "1rem", marginRight: "2.25rem" }} />
            Schedule This Activity
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input type="time" placeholder="Select time" />
            <Input type="date" />
            <Input type="number" placeholder="Group size" />
            <Textarea placeholder="Add notes..." rows={3} />
          </div>
          <Button style={{
            width: "100%",
            background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer"
          }}>
            Add to Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};
