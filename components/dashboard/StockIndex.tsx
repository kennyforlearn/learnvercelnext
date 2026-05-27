import { useState, useEffect } from "react";

interface StockData {
  ftse100: number;
  ftse100Change: number;
  sp500: number;
  sp500Change: number;
  dax: number;
  daxChange: number;
}

export default function StockIndex() {
  const [stocks, setStocks] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STOCK_API_KEY;
        if (!apiKey) {
          throw new Error("Stock API key not configured");
        }

        // Using Alpha Vantage or similar service
        // Fetch FTSE 100, S&P 500, and DAX indices
        const indices = ["^FTSE", "^GSPC", "^GDAXI"];
        const stockData: any = {};

        // Note: This is a simplified example. Adjust based on your API provider
        // Some providers like Alpha Vantage have rate limits, so consider caching
        const response = await fetch(
          `https://api.example.com/indices?symbols=${indices.join(",")}&apiKey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }

        const data = await response.json();

        // Parse response based on your API structure
        setStocks({
          ftse100: data.FTSE?.price || 0,
          ftse100Change: data.FTSE?.change || 0,
          sp500: data.SP500?.price || 0,
          sp500Change: data.SP500?.change || 0,
          dax: data.DAX?.price || 0,
          daxChange: data.DAX?.change || 0,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    // Refresh stocks every 15 minutes (markets are closed outside trading hours)
    const interval = setInterval(fetchStocks, 900000);
    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change: number) => {
    if (change > 0) return "#51cf66";
    if (change < 0) return "#ff6b6b";
    return "#999";
  };

  const formatNumber = (num: number) => {
    return num ? num.toLocaleString("en-GB", { maximumFractionDigits: 2 }) : "---";
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
      ) : stocks ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            FTSE 100: {formatNumber(stocks.ftse100)}
            <span style={{ color: getChangeColor(stocks.ftse100Change), marginLeft: "8px" }}>
              {stocks.ftse100Change > 0 ? "▲" : "▼"} {formatNumber(stocks.ftse100Change)}
            </span>
          </p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            S&P 500: {formatNumber(stocks.sp500)}
            <span style={{ color: getChangeColor(stocks.sp500Change), marginLeft: "8px" }}>
              {stocks.sp500Change > 0 ? "▲" : "▼"} {formatNumber(stocks.sp500Change)}
            </span>
          </p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            DAX: {formatNumber(stocks.dax)}
            <span style={{ color: getChangeColor(stocks.daxChange), marginLeft: "8px" }}>
              {stocks.daxChange > 0 ? "▲" : "▼"} {formatNumber(stocks.daxChange)}
            </span>
          </p>
        </>
      ) : null}
    </div>
  );
}
