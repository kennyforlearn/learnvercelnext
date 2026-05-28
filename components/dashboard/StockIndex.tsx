import { useState, useEffect } from "react";

interface Quote {
  symbol: string;
  price: number | null;
  change: number | null;
}

export default function StockIndex() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stocks");
        if (!response.ok) throw new Error(`Failed to fetch stocks: ${response.status}`);

        const data = await response.json();
        // Expecting data.quotes = [{ symbol, price, change }]
        setQuotes(data.quotes || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 900000);
    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change: number | null) => {
    if (change === null) return "#999";
    if (change > 0) return "#51cf66";
    if (change < 0) return "#ff6b6b";
    return "#999";
  };

  const formatNumber = (num: number | null) => {
    return num !== null ? num.toLocaleString("en-GB", { maximumFractionDigits: 2 }) : "---";
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
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Stock Index</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : quotes && quotes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {quotes.map((q) => (
            <div key={q.symbol} style={{ fontSize: "0.9rem" }}>
              <strong>{q.symbol}</strong>: {formatNumber(q.price)}
              <span style={{ color: getChangeColor(q.change), marginLeft: "8px" }}>
                {q.change !== null ? (q.change > 0 ? "▲" : "▼") : ""} {formatNumber(q.change)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>No stock data available</p>
      )}
    </div>
  );
}
