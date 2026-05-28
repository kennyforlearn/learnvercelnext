import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "News API key not configured" }, { status: 500 });
    }

    // Use NewsAPI server-side to avoid client TLS/protocol issues (426)
    const url = `https://newsapi.org/v2/top-headlines?country=gb&pageSize=5`;
    const resp = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/json",
        "User-Agent": "learnvercelnext/1.0",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `News API error: ${resp.status}`, detail: text }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json({ articles: data.articles || [] });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
