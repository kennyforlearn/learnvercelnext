import { useState, useEffect } from "react";

interface UtilitiesData {
  powerStatus: "stable" | "warning" | "critical";
  floodingAlert: string;
  weatherAlert: string;
}

export default function PowerUtilities() {
  const [utilities, setUtilities] = useState<UtilitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_UTILITIES_API_KEY;
        
        // Default to stable, can be updated with real API
        let powerStatus: "stable" | "warning" | "critical" = "stable";
        let floodingAlert = "None";
        let weatherAlert = "None";

        if (apiKey) {
          try {
            // Fetch from UK Power Networks or similar service
            // Example endpoint structure - customize based on your API
            const response = await fetch(
              `https://api.example.com/utilities?location=london&apiKey=${apiKey}`
            );

            if (response.ok) {
              const data = await response.json();
              powerStatus = data.powerStatus || "stable";
              floodingAlert = data.floodingAlert || "None";
              weatherAlert = data.weatherAlert || "None";
            }
          } catch (apiError) {
            console.log("Could not fetch utilities data, using defaults");
          }
        }

        setUtilities({
          powerStatus,
          floodingAlert,
          weatherAlert,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching utilities");
      } finally {
        setLoading(false);
      }
    };

    fetchUtilities();
    // Refresh utilities every 30 minutes
    const interval = setInterval(fetchUtilities, 1800000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "#ff6b6b";
      case "warning":
        return "#ffa94d";
      case "stable":
      default:
        return "#51cf66";
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Power & Utilities</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Checking...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : utilities ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Power: <span style={{ color: getStatusColor(utilities.powerStatus) }}>● {utilities.powerStatus.toUpperCase()}</span>
          </p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Flooding: {utilities.floodingAlert}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Weather Alert: {utilities.weatherAlert}</p>
        </>
      ) : null}
    </div>
  );
}
