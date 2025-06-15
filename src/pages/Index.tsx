import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { TravelTemplates } from "@/components/TravelTemplates";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "builder">(
    "dashboard"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { user, loading, logout } = useAuth();
   const isMobile = useIsMobile();

  const handleCreateItinerary = (templateId?: string) => {
    console.log("Creating itinerary with template:", templateId);
    setSelectedTemplate(templateId || null);
    setCurrentView("builder");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
       }
  };

  // Share Handler
  const handleShare = async () => {
    const shareData = {
      title: "TravelPlan",
      text: "Check out this travel planner app!",
      url: window.location.href
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        alert("Shared successfully!");
      } catch (e) {
        await fallbackShare();
      }
    } else {
      await fallbackShare();
    }
  };

  const fallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (e) {
      alert("Copy this URL to share: " + window.location.href);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>📍</div>
          <div style={{ fontSize: "1.125rem", color: "#4b5563" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  if (currentView === "builder") {
    return (
      <ItineraryBuilder
        templateId={selectedTemplate}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "1rem 0",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div style={{ fontSize: "1.5rem" }}>📍</div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                TravelPlan
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                Welcome, {user.email}
              </span>
                <button 
                className="btn btn-outline"
                onClick={handleShare}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  color: "#2563eb",
                  cursor: "pointer",
                  fontSize: 15,
                  marginLeft: 8,
                  fontWeight: 500,
                  transition: "background 0.2s"
                }}
                type="button"
              >
                🔗 Share
              </button>
              <button
                onClick={() => handleCreateItinerary()}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  borderRadius: "0.375rem",
                }}
              >
                Create New Trip
              </button>
              <button
                  onClick={handleLogout}
                  type="button"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "#fff",
                    border: "1.5px solid wheat",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginLeft: 8,
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                    (e.currentTarget as HTMLButtonElement).style.color = "#b91c1c";
                    (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #dc2626";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                    (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #ef4444";
                  }}
                >
               <LogOut style={{ width: 10, height: 12 }} />
                  {!isMobile && <span>SignOut</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section style={{ padding: "4rem 1rem", backgroundColor: "#f3f4f6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Plan Your Perfect Journey
            </h1>
            <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
              Create detailed itineraries with drag-and-drop simplicity.
              Collaborate with friends and visualize your route on interactive
              maps.
            </p>
            <button
              onClick={() => handleCreateItinerary()}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#3b82f6",
                color: "#fff",
                borderRadius: "0.375rem",
              }}
            >
              🚀 Start Planning Now
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
            }}
          >
            <div
              style={{
                padding: "2rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  display: "inline-block",
                  color: "#fff",
                }}
              >
                🎯
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginTop: "1rem",
                }}
              >
                Drag & Drop Planning
              </h3>
              <p style={{ marginTop: "0.5rem" }}>
                Effortlessly organize activities by dragging them onto your
                timeline. Rearrange your schedule with smooth, intuitive
                interactions.
              </p>
            </div>

            <div
              style={{
                padding: "2rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  background: "linear-gradient(45deg, #059669, #10b981)",
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  display: "inline-block",
                  color: "#fff",
                }}
              >
                🗺️
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginTop: "1rem",
                }}
              >
                Interactive Maps
              </h3>
              <p style={{ marginTop: "0.5rem" }}>
                Visualize your journey with pinned destinations and optimized
                routes. Discover nearby attractions and restaurants.
              </p>
            </div>

            <div
              style={{
                padding: "2rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  background: "linear-gradient(45deg, #dc2626, #ef4444)",
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  display: "inline-block",
                  color: "#fff",
                }}
              >
                👥
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginTop: "1rem",
                }}
              >
                Real-time Collaboration
              </h3>
              <p style={{ marginTop: "0.5rem" }}>
                Share your itinerary with travel companions. Edit together in
                real-time and leave comments on activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <TravelTemplates onSelectTemplate={handleCreateItinerary} />
        </div>
      </section>
    </div>
  );
};

export default Index;
