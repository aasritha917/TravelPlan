import activitiesData from '@/data/activities.json';
import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  selectedActivities?: string[];
  onActivitySelect?: (activityId: string) => void;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyANG3FxFxKSQIsldl_BnFvB6jM8MXzVJ0c"; 

export const MapView = ({ selectedActivities = [], onActivitySelect }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleMaps = async () => {
    try {
      if ((window as any).google && (window as any).google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }
      // Dynamically load Google Maps JS API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      script.onerror = () => {
        setIsGoogleMapsLoaded(false);
        setError("Failed to load Google Maps. Please check your API key and Internet connection.");
      };
    } catch (err: any) {
      setError("Failed to load Google Maps.");
      console.error("Failed to load Google Maps:", err);
    }
  };

  const initializeMap = () => {
    try {
      if (!mapContainer.current || !isGoogleMapsLoaded || !(window as any).google?.maps) return;

      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: 11.9139, lng: 79.8083 },
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      // Cleanup existing markers
      markers.forEach(marker => marker.setMap(null));
      const newMarkers: google.maps.Marker[] = [];

      activitiesData.forEach((activity) => {
        if (!map.current || !window.google?.maps) return;

        const marker = new window.google.maps.Marker({
          position: { lat: activity.coordinates[1], lng: activity.coordinates[0] },
          map: map.current,
          title: activity.title,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${selectedActivities.includes(activity.id) ? '#3b82f6' : 'white'}" stroke="#3b82f6" stroke-width="4"/>
                <text x="20" y="26" text-anchor="middle" font-size="16">${activity.icon}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h4 style="margin: 0 0 8px 0; font-weight: 600;">${activity.title}</h4>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${activity.description}</p>
              <p style="margin: 0; font-size: 14px; font-weight: 500; color: #3b82f6;">${activity.price} • ${activity.duration}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map.current, marker);
          onActivitySelect?.(activity.id);
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    } catch (err: any) {
      setError('An error occurred while initializing the map. Please ensure your API key is correct and the Google Maps API is available.');
      console.error('MapView error:', err);
    }
  };

  useEffect(() => {
    loadGoogleMaps();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isGoogleMapsLoaded) {
      initializeMap();
    }
    // eslint-disable-next-line
  }, [isGoogleMapsLoaded, selectedActivities]);
  // Error UI
  if (error) {
    return (
      <div style={{
        padding: 24,
        borderRadius: 12,
        background: "#fff0f0",
        color: "#b91c1c",
        textAlign: "center",
        minHeight: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(185,28,28,0.05)"
      }}>
        {error}
      </div>
    );
  }

  // Loading state
  if (!isGoogleMapsLoaded) {
    return (
      <div style={{
        height: "100%", minHeight: 240, minWidth: 180,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32, height: 32,
            border: "4px solid #2563eb", borderTop: "4px solid #e5e7eb",
            borderRadius: "50%",
            margin: "0 auto 12px auto",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#697287", fontSize: 15 }}>Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  // Map container styles for responsiveness
  return (
    <div style={{
      height: "100%",
      minHeight: 300,
      width: "100%",
      maxWidth: "100%",
      position: "relative",
      boxSizing: "border-box",
      overflow: "hidden",
      borderRadius: 12
    }}>
      <div ref={mapContainer} style={{
        position: "absolute",
        inset: 0,
        borderRadius: 12,
        width: "100%",
        height: "100%",
        minHeight: 300,
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden"
      }} />
    </div>
  );
};
