import { useState, useEffect } from "react";

interface YahooMailData {
  status: "connected" | "disconnected";
  unreadCount: number;
}

export default function YahooMail() {
  const [yahooMail, setYahooMail] = useState<YahooMailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{id:string, from:string, subject:string, date:string}>>([]);
  const [max, setMax] = useState<number>(10);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchYahooMailData = async () => {
      try {
        // Use server-side endpoint for Yahoo
        const response = await fetch("/api/email/yahoo-unread");
        if (!response.ok) throw new Error("Failed to fetch Yahoo Mail data");
        const data = await response.json();
        setYahooMail({
          status: data.status || (data.unreadCount ? "connected" : "disconnected"),
          unreadCount: data.unreadCount || 0,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching Yahoo Mail data");
        setYahooMail({
          status: "disconnected",
          unreadCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchYahooMailData();
    // Refresh Yahoo Mail data every 15 minutes
    const interval = setInterval(fetchYahooMailData, 900000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const resp = await fetch(`/api/email/yahoo-messages?max=${max}`);
        if (resp.ok) {
          const data = await resp.json();
          setMessages(data.messages || []);
        } else setMessages([]);
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
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Yahoo Mail</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : yahooMail ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Status: {yahooMail.status === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Unread: {yahooMail.unreadCount}</p>
          <div style={{ marginTop: "12px" }}>
            <label style={{ fontSize: "0.85rem" }}>Show messages:</label>
            <select value={max} onChange={(e) => setMax(parseInt(e.target.value))} style={{ marginLeft: "8px" }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
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
