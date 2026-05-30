import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.YAHOO_ACCESS_TOKEN;
    if (!accessToken || accessToken.startsWith("your_") || accessToken === "dj0yJmk9") {
      return NextResponse.json({ messages: [] });
    }

    // Yahoo Mail API is not standardized here; return empty and log for now
    console.warn("Yahoo message listing not implemented - token provided but no endpoint configured");
    return NextResponse.json({ messages: [] });
  } catch (err) {
    console.error("yahoo-messages error", err);
    return NextResponse.json({ messages: [] });
  }
}
