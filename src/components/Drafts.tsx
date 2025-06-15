import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface Draft {
  id: string;
  userId: string;
  content: string;
  createdAt: { seconds: number };
}

export const Drafts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "drafts"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const items: Draft[] = [];
        snapshot.forEach(doc => {
          items.push({
            id: doc.id,
            ...(doc.data() as Omit<Draft, "id">)
          });
        });
        setDrafts(items);
      } catch (e) {
        setDrafts([]);
      }
      setLoading(false);
    };
    fetchDrafts();
  }, [user]);

  const handleSaveDraft = async () => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in to save a draft.",
        variant: "destructive"
      });
      return;
    }
    const draftData = {
      userId: user.uid,
      content: "your content here",
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "drafts"), draftData);
      toast({
        title: "Draft Saved!",
        description: "Draft was saved successfully.",
        variant: "default"
      });
      setDrafts(prevDrafts => [
        {
          id: String(Date.now()),
          userId: user.uid,
          content: "your content here",
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        },
        ...prevDrafts
      ]);
    } catch (err) {
      toast({
        title: "Could not save draft.",
        description: "There was an error saving your draft.",
        variant: "destructive"
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "32rem",
        margin: "2rem auto",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.75rem" }}>
        Drafts
      </h3>
      <button
        onClick={handleSaveDraft}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderRadius: "0.375rem",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
      >
        Save Draft
      </button>
      <hr style={{ margin: "1.25rem 0" }} />
      <div>
        <h4 style={{ fontWeight: "500", marginBottom: "0.5rem", color: "#374151" }}>
          Your Drafts
        </h4>
        {loading && (
          <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Loading...
          </div>
        )}
        {!loading && drafts.length === 0 && (
          <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            No drafts found.
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {drafts.map((draft) => (
            <li
              key={draft.id}
              style={{
                padding: "0.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "#4b5563" }}>
                {draft.content}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginLeft: "0.5rem" }}>
                {draft.createdAt && draft.createdAt.seconds
                  ? new Date(draft.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
