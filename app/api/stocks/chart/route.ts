import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.STOCK_API_KEY || process.env.NEXT_PUBLIC_STOCK_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Stock API key not configured", series: [] });

    const url = new URL(request.url);
    const symbol = url.searchParams.get("symbol") || url.searchParams.get("symbols") || "AAPL";

    const avUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`;
    const resp = await fetch(avUrl, { headers: { Accept: "application/json" } });
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("AlphaVantage error", resp.status, txt);
      return NextResponse.json({ error: "AlphaVantage error", series: [] });
    }

    const data = await resp.json();
    const ts = data["Time Series (Daily)"] || data["Time Series (Daily) "] || {};
    const series = Object.keys(ts).slice(0, 100).reverse().map((date) => ({ date, close: parseFloat(ts[date]["4. close"]) }));

    return NextResponse.json({ symbol, series });
  } catch (err) {
    console.error("stocks/chart error", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown", series: [] });
  }
}
