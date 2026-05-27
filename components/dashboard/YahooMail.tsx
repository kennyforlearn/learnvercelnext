import { useState, useEffect } from "react";

interface YahooMailData {
  status: "connected" | "disconnected";
  unreadCount: number;
}

export default function YahooMail() {
  const [yahooMail, setYahooMail] = useState<YahooMailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYahooMailData = async () => {
      try {
        // Yahoo Mail uses OAuth2 for API access
        const accessToken = process.env.NEXT_PUBLIC_YAHOO_ACCESS_TOKEN;

        if (!accessToken) {
          throw new Error("Yahoo Mail access token not configured");
        }

        // Fetch from Yahoo Mail API
        // This requires server-side authentication with Yahoo OAuth2
        const response = await fetch("/api/email/yahoo-unread", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Yahoo Mail data");
        }

        const data = await response.json();

        setYahooMail({
          status: "connected",
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
        </>
      ) : null}
    </div>
  );
}
