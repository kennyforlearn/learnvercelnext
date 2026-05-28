import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey || apiKey === "your_newsapi_api_key") {
      return NextResponse.json(
        { error: "News API key not configured", articles: [] },
        { status: 200 }
      );
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
      console.error(`News API error: ${resp.status}`, text);
      // Return empty articles on error instead of failing
      return NextResponse.json(
        { error: `News API error: ${resp.status}`, articles: [], detail: text },
        { status: 200 }
      );
    }

    const data = await resp.json();
    return NextResponse.json({ articles: data.articles || [] });
  } catch (err) {
    console.error("News fetch error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error", articles: [] },
      { status: 200 }
    );
  }
}
