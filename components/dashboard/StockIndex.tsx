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
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [series, setSeries] = useState<{date:string,close:number}[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

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

  useEffect(() => {
    const fetchChart = async () => {
      if (!symbol) return;
      setChartLoading(true);
      try {
        const resp = await fetch(`/api/stocks/chart?symbol=${encodeURIComponent(symbol)}`);
        if (!resp.ok) {
          setSeries([]);
          return;
        }
        const data = await resp.json();
        setSeries(data.series || []);
      } catch (e) {
        setSeries([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [symbol]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Stock Index</h3>
        <div>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol e.g. AAPL" style={{ padding: '4px' }} />
        </div>
      </div>
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
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.85rem', marginBottom: 6 }}>Price chart for {symbol}</div>
            {chartLoading ? (
              <div style={{ fontSize: '0.85rem' }}>Loading chart...</div>
            ) : series.length === 0 ? (
              <div style={{ fontSize: '0.85rem' }}>No chart data</div>
            ) : (
              <svg viewBox="0 0 300 80" width="100%" height="80" preserveAspectRatio="none">
                {(() => {
                  const vals = series.map(s => s.close);
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  const points = series.map((s, i) => {
                    const x = (i / (series.length - 1)) * 300;
                    const y = max === min ? 40 : 80 - ((s.close - min) / (max - min)) * 70;
                    return `${x},${y}`;
                  }).join(' ');
                  return <polyline fill="none" stroke="#339af0" strokeWidth={2} points={points} />
                })()}
              </svg>
            )}
          </div>
        </div>
      ) : (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>No stock data available</p>
      )}
    </div>
  );
}
