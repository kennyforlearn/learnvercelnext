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

    // Allow optional query params for keywords and country (default us).
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "us";
    const query = searchParams.get("q")?.trim();

    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("country", country);
    url.searchParams.set("pageSize", "5");
    if (query) {
      url.searchParams.set("q", query);
    }

    const resp = await fetch(url.toString(), {
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
