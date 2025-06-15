import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Map } from "lucide-react";
import { DragDropProvider } from "@/components/DragDropProvider";
import { ActivityList } from "@/components/ActivityList";
import { DailyTimeline } from "@/components/DailyTimeline";
import { ActivityDetails } from "@/components/ActivityDetails";
import { MapView } from "@/components/MapView";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface ItineraryBuilderProps {
  templateId: string | null;
  onBack: () => void;
}

export const ItineraryBuilder = ({
  templateId,
  onBack,
}: ItineraryBuilderProps) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  // Placeholder: You should link this to your activities logic!
  const [scheduledActivities] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const templateInfo = templateId
    ? {
        adventure: { name: "Adventure Explorer", emoji: "🏔️" },
        cultural: { name: "Cultural Journey", emoji: "🏛️" },
        budget: { name: "Budget Traveler", emoji: "💰" },
        leisure: { name: "Leisure & Relaxation", emoji: "🏖️" },
        family: { name: "Family Fun", emoji: "👨‍👩‍👧‍👦" },
        foodie: { name: "Culinary Adventure", emoji: "🍜" },
      }[templateId]
    : null;

  // ----- SHARE -----
  const handleShare = async () => {
    toast({ title: "Share button pressed!" }); // debug
    const shareData = {
      title: templateInfo ? templateInfo.name : "Custom Itinerary",
      text: "Check out my travel itinerary!",
      url: window.location.href,
    };
    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Your itinerary has been shared",
        });
      } else {
        await fallbackShare();
      }
    } catch (err) {
      await fallbackShare();
    }
  };

  const fallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Itinerary link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Share",
        description: "Copy this URL to share your itinerary: " + window.location.href,
        duration: 5000,
      });
    }
  };

  // ----- SAVE DRAFT -----
  const handleSaveDraft = async () => {
    toast({ title: "Save Draft button pressed!" }); // debug
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your itinerary draft.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    try {
      const draftData = {
        userId: user.uid,
        templateId,
        scheduledActivities,
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "drafts"), draftData);
      toast({
        title: "Draft saved!",
        description: "Your itinerary has been saved.",
      });
    } catch (error) {
      toast({
        title: "Draft not saved!",
        description: "There was an error saving. See console.",
        variant: "destructive",
      });
      console.error("Error saving draft:", error);
    }
  };

  return (
    <DragDropProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "20px 0",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "rgba(79, 70, 229, 0.1)",
                    color: "#4f46e5",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <ArrowLeft style={{ width: "16px", height: "16px" }} />
                  Back
                </Button>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {templateInfo && (
                    <span style={{ fontSize: "24px" }}>
                      {templateInfo.emoji}
                    </span>
                  )}
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    {templateInfo ? templateInfo.name : "Custom Itinerary"}
                  </h1>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "white",
                    border: "2px solid #e5e7eb",
                    color: "#374151",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Save Draft
                </Button>
                
                <Button
                  onClick={handleShare}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Share Itinerary
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr 300px",
              gap: "24px",
              height: "calc(100vh - 120px)",
            }}
          >
            {/* Left Panel - Activities */}
            <Card
              style={{
                height: "100%",
                border: "none",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(15px)",
                borderRadius: "20px",
              }}
            >
              <CardHeader style={{ padding: "24px 24px 16px 24px" }}>
                <CardTitle
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  <Plus
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  Activities & Places
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: "0" }}>
                <ActivityList onSelectActivity={setSelectedActivity} />
              </CardContent>
            </Card>

            {/* Center Panel - Timeline & Map */}
            <Card
              style={{
                height: "100%",
                border: "none",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(15px)",
                borderRadius: "20px",
              }}
            >
              <CardHeader style={{ padding: "24px 24px 16px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CardTitle
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    <Calendar
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                      }}
                    />
                    Itinerary
                    Builder&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </CardTitle>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    <Clock style={{ width: "16px", height: "16px" }} />
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent style={{ padding: "0", height: "100%" }}>
                <Tabs
                  defaultValue="timeline"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TabsList
                    style={{
                      margin: "0 24px 16px 24px",
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <TabsTrigger
                      value="timeline"
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "8px",
                        padding: "8px 16px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "1px solid #2563eb",
                        borderRadius: "8px",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Calendar style={{ width: "16px", height: "16px" }} />
                      Timeline
                    </TabsTrigger>

                    <TabsTrigger
                      value="map"
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "8px",
                        padding: "8px 16px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "1px solid #2563eb",
                        borderRadius: "8px",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Map style={{ width: "16px", height: "16px" }} />
                      Map View
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="timeline"
                    style={{ flex: 1, marginTop: 0 }}
                  >
                    <DailyTimeline
                      date={currentDate}
                      onSelectActivity={setSelectedActivity}
                    />
                  </TabsContent>
                  <TabsContent
                    value="map"
                    style={{
                      flex: 1,
                      marginTop: 0,
                      padding: "0 24px 24px 24px",
                    }}
                  >
                    <MapView
                      selectedActivities={
                        selectedActivity ? [selectedActivity] : []
                      }
                      onActivitySelect={setSelectedActivity}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Right Panel - Activity Details */}
            <Card
              style={{
                height: "100%",
                border: "none",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(15px)",
                borderRadius: "20px",
              }}
            >
              <CardHeader style={{ padding: "24px 24px 16px 24px" }}>
                <CardTitle
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  <MapPin
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: "0", marginLeft: "20px" }}>
                <ActivityDetails activityId={selectedActivity} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
};