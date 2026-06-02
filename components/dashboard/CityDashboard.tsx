import { useState, useEffect } from "react";

interface CityData {
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  network?: {
    status: "online" | "issues" | "offline";
    details: string;
  };
  power?: {
    status: "stable" | "issues" | "outage";
    details: string;
  };
}

export default function CityDashboard() {
  const [city, setCity] = useState<string>("London");
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityData = async () => {
      if (!city.trim()) return;
      
      setLoading(true);
      const allData: CityData = {};

      try {
        // Fetch weather
        try {
          const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
          if (apiKey) {
            const weatherResp = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
            );
            if (weatherResp.ok) {
              const weatherData = await weatherResp.json();
              allData.weather = {
                temperature: Math.round(weatherData.main.temp),
                condition: weatherData.weather[0].main,
                humidity: weatherData.main.humidity,
                windSpeed: Math.round(weatherData.wind.speed),
              };
            }
          }
        } catch (e) {
          console.warn("Weather fetch error:", e);
        }

        // Fetch network status (stub - would connect to real service)
        try {
          allData.network = {
            status: "online",
            details: "ISP network stable",
          };
        } catch (e) {
          console.warn("Network fetch error:", e);
        }

        // Fetch power utility status (stub - would connect to real service)
        try {
          allData.power = {
            status: "stable",
            details: "Power grid stable",
          };
        } catch (e) {
          console.warn("Power fetch error:", e);
        }

        setCityData(allData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching city data");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchCityData, 500);
    return () => clearTimeout(timeout);
  }, [city]);

  const getStatusColor = (status: string) => {
    if (status === "online" || status === "stable") return "#51cf66";
    if (status === "issues") return "#ffa94d";
    return "#ff6b6b";
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
      <div style={{ marginBottom: "12px" }}>
        <label style={{ fontSize: "0.9rem", fontWeight: "600", marginRight: "8px" }}>City:</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{
            padding: "6px 8px",
            fontSize: "0.9rem",
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            color: "inherit",
          }}
        />
      </div>

      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : cityData ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Weather */}
          {cityData.weather && (
            <div style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "600", margin: "0 0 6px 0" }}>Weather</h4>
              <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                <strong>{cityData.weather.temperature}°C</strong> {cityData.weather.condition}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                Humidity: {cityData.weather.humidity}% | Wind: {cityData.weather.windSpeed} m/s
              </p>
            </div>
          )}

          {/* Network Status */}
          {cityData.network && (
            <div style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "600", margin: "0 0 6px 0" }}>Network Status</h4>
              <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                Status: <span style={{ color: getStatusColor(cityData.network.status), fontWeight: "600" }}>
                  {cityData.network.status.toUpperCase()}
                </span>
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#999" }}>{cityData.network.details}</p>
            </div>
          )}

          {/* Power Utilities */}
          {cityData.power && (
            <div style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "600", margin: "0 0 6px 0" }}>Power & Utilities</h4>
              <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                Status: <span style={{ color: getStatusColor(cityData.power.status), fontWeight: "600" }}>
                  {cityData.power.status.toUpperCase()}
                </span>
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#999" }}>{cityData.power.details}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
