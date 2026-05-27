import { useState, useEffect } from "react";

interface GmailData {
  email: string;
  unreadCount: number;
  status: "connected" | "disconnected";
}

export default function Gmail() {
  const [gmail, setGmail] = useState<GmailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGmailData = async () => {
      try {
        // Gmail uses OAuth2 for API access. Tokens are handled server-side.
        // Call the server-side endpoint which performs authenticated requests.
        const response = await fetch("/api/email/gmail-unread");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Gmail OAuth not configured or expired (401)");
          }
          throw new Error("Failed to fetch Gmail data");
        }

        const data = await response.json();

        setGmail({
          email: data.email || "Not connected",
          unreadCount: data.unreadCount || 0,
          status: "connected",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching Gmail data");
        setGmail({
          email: "Not connected",
          unreadCount: 0,
          status: "disconnected",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGmailData();
    // Refresh Gmail data every 10 minutes
    const interval = setInterval(fetchGmailData, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Gmail</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : gmail ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Email: {gmail.email}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Unread: {gmail.unreadCount}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Status: {gmail.status === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </p>
        </>
      ) : null}
    </div>
  );
}
