import { useState, useEffect } from "react";

interface NetworkData {
  status: "online" | "offline";
  isps: string[];
  outages: string[];
}

export default function NetworkStatus() {
  const [network, setNetwork] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        // Check general internet connectivity
        const isOnline = navigator.onLine;
        
        // Fetch ISP and outage information if API is configured
        const apiKey = process.env.NEXT_PUBLIC_NETWORK_API_KEY;
        let ispData = [];
        let outageData = [];

        if (apiKey) {
          try {
            // Example using DownDetector or similar service
            // This is a placeholder - implement based on your chosen service
            const response = await fetch(`/api/network-status?apiKey=${apiKey}`);
            if (response.ok) {
              const data = await response.json();
              ispData = data.isps || [];
              outageData = data.outages || [];
            }
          } catch (apiError) {
            console.log("Could not fetch ISP data, using fallback");
          }
        }

        setNetwork({
          status: isOnline ? "online" : "offline",
          isps: ispData,
          outages: outageData,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error checking network");
      } finally {
        setLoading(false);
      }
    };

    checkNetwork();

    // Listen for online/offline events
    const handleOnline = () => setNetwork((prev) => (prev ? { ...prev, status: "online" } : null));
    const handleOffline = () => setNetwork((prev) => (prev ? { ...prev, status: "offline" } : null));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Refresh network status every 5 minutes
    const interval = setInterval(checkNetwork, 300000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
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
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Network Status</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Checking...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : network ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Status: {network.status === "online" ? "✓ Online" : "✗ Offline"}
          </p>
          {network.outages && network.outages.length > 0 ? (
            <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff9999" }}>
              Outages: {network.outages.join(", ")}
            </p>
          ) : (
            <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Outages: None detected</p>
          )}
        </>
      ) : null}
    </div>
  );
}
