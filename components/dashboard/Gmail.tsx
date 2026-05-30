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
  const [messages, setMessages] = useState<Array<{id:string, from:string, subject:string, date:string}>>([]);
  const [max, setMax] = useState<number>(10);
  const [loadingMessages, setLoadingMessages] = useState(false);

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

  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const resp = await fetch(`/api/email/gmail-messages?max=${max}`);
        if (resp.ok) {
          const data = await resp.json();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [max]);

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

          <div style={{ marginTop: "12px" }}>
            <label style={{ fontSize: "0.85rem" }}>Show messages:</label>
            <select value={max} onChange={(e) => setMax(parseInt(e.target.value))} style={{ marginLeft: "8px" }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div style={{ marginTop: "10px" }}>
            {loadingMessages ? (
              <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p style={{ margin: "5px 0", fontSize: "0.85rem" }}>No messages available</p>
            ) : (
              <ul style={{ paddingLeft: "16px", fontSize: "0.85rem" }}>
                {messages.map((m) => (
                  <li key={m.id} style={{ marginBottom: "6px" }}>
                    <strong>{m.from}</strong>: {m.subject} <br />
                    <span style={{ color: "#999", fontSize: "0.75rem" }}>{m.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
