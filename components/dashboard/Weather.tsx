import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          throw new Error("Weather API key not configured");
        }

        // Default to London, UK. Can be customized based on user location
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
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
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Weather</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : weather ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Temperature: {weather.temperature}°C</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Condition: {weather.condition}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Humidity: {weather.humidity}%</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Wind: {weather.windSpeed} m/s</p>
        </>
      ) : null}
    </div>
  );
}
