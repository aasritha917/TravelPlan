import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface Draft {
  id: string;
  templateId: string | null;
  scheduledActivities: Record<string, any>;
  updatedAt: { seconds: number } | null;
}

interface DraftsHistoryProps {
  onLoadDraft: (draft: Draft) => void;
}

export const DraftsHistory = ({ onLoadDraft }: DraftsHistoryProps) => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const draftsRef = collection(db, "drafts");
        const q = query(
          draftsRef,
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const items: Draft[] = [];
        snapshot.forEach(doc => {
          items.push({
            id: doc.id,
            ...doc.data(),
          } as Draft);
        });
        setDrafts(items);
      } catch (e) {
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [user]);

  if (!user) return null;

  return (
    <div
      style={{
        marginBottom: "1.25rem",
        marginTop: "0.75rem",
        padding: "0.75rem",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: "#374151",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        📝 Saved Drafts
      </h3>
      {loading && (
        <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
          Loading drafts...
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "0.875rem",
                color: "#374151",
                maxWidth: "80%",
              }}
            >
              {draft.templateId || "Custom"} &nbsp;
              <span style={{ color: "#9ca3af" }}>
                {draft.updatedAt && typeof draft.updatedAt === "object"
                  ? new Date((draft.updatedAt.seconds ?? 0) * 1000).toLocaleString()
                  : ""}
              </span>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLoadDraft(draft)}
              style={{ marginLeft: "0.5rem" }}
            >
              Load
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
