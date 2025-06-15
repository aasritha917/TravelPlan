import { ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface ItineraryHeaderProps {
  templateId: string | null;
  onBack: () => void;
  exportItinerary: () => Record<string, any>;
  scheduledActivities: Record<string, any>;
}

export const ItineraryHeader = ({
  templateId,
  onBack,
  exportItinerary,
  scheduledActivities,
}: ItineraryHeaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleShare = async () => {
    toast({ title: "Share button pressed!" });
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

  const handleSaveDraft = async () => {
    toast({ title: "Save Draft button pressed!" });
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
        scheduledActivities: exportItinerary(),
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
    <header
      style={{
        backgroundColor: "#fafbff",
        borderBottom: "1px solid #e5e7eb",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        paddingTop: "0.75rem",
        paddingBottom: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,.02)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: "#eeebff",
              color: "#554ad8",
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: "0.75rem",
              padding: "0.5rem 1.5rem",
              display: "flex",
              alignItems: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
            Back
          </button>
          <h1 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#1f2937" }}>
            {templateInfo ? templateInfo.name : "Custom Itinerary"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleSaveDraft}
            style={{
              borderRadius: "0.75rem",
              padding: "0.5rem 1.75rem",
              fontSize: "1rem",
              fontWeight: 400,
              border: "2px solid #d1d5db",
              backgroundColor: "#ffffff",
              color: "#111827",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            Save Draft
          </button>
          <button
            onClick={handleShare}
            style={{
              borderRadius: "0.75rem",
              padding: "0.5rem 2rem",
              fontSize: "1rem",
              fontWeight: 400,
              border: "2px solid black",
              backgroundImage: "linear-gradient(to right, #8b5cf6, #3b82f6)",
              color: "#ffffff",
              cursor: "pointer",
              transition: "background-position 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "linear-gradient(to right, #7c3aed, #2563eb)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "linear-gradient(to right, #8b5cf6, #3b82f6)")}
          >
            Share Itinerary
          </button>
        </div>
      </div>
    </header>
  );
};
