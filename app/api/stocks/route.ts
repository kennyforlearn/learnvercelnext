import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.STOCK_API_KEY || process.env.NEXT_PUBLIC_STOCK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Stock API key not configured" }, { status: 500 });
    }

    // Symbols can be set via env or query param
    const defaultSymbols = (process.env.STOCK_SYMBOLS || "MSFT,IBM,AAPL").split(",").map(s => s.trim()).filter(Boolean);
    const urlSearch = new URL(request.url).searchParams;
    const symbolsParam = urlSearch.get("symbols");
    const symbols = symbolsParam ? symbolsParam.split(",").map(s => s.trim()).filter(Boolean) : defaultSymbols;

    // Alpha Vantage GLOBAL_QUOTE endpoint per symbol
    const fetchQuote = async (symbol: string) => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
      const resp = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "learnvercelnext/1.0" } });
      if (!resp.ok) return { symbol, price: null, change: null };
      const data = await resp.json();
      const gq = data["Global Quote"] || data["Global quote"] || {};
      const price = gq["05. price"] ? parseFloat(gq["05. price"]) : null;
      const change = gq["09. change"] ? parseFloat(gq["09. change"]) : null;
      return { symbol, price, change };
    };

    const results = await Promise.all(symbols.map(fetchQuote));
    return NextResponse.json({ quotes: results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
