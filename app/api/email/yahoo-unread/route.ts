import { NextRequest, NextResponse } from "next/server";

/**
 * Yahoo Mail Unread Count API Route
 * 
 * This route fetches unread email count from Yahoo Mail API.
 * Requires OAuth2 setup with Yahoo Developer Portal.
 * 
 * Setup instructions:
 * 1. Go to https://developer.yahoo.com/
 * 2. Register and create an app
 * 3. Enable Yahoo Mail API
 * 4. Set up OAuth2 credentials
 * 5. Get and store access token
 */

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.YAHOO_ACCESS_TOKEN;

    if (!accessToken || accessToken.startsWith("your_") || accessToken === "dj0yJmk9") {
      return NextResponse.json(
        { unreadCount: 0, status: "disconnected", error: "Yahoo Mail not configured" },
        { status: 200 }
      );
    }

    // Yahoo Mail API to get unread message count
    const response = await fetch(
      "https://ymail.imap.mail.yahoo.com/api/v1/users/me/folders",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Yahoo Mail API error: ${response.status} ${response.statusText}`);
      throw new Error(`Yahoo Mail API error: ${response.status}`);
    }

    const data = await response.json();

    // Find INBOX and get unread count
    let unreadCount = 0;
    if (data.folders) {
      const inbox = data.folders.find((f: any) => f.name === "INBOX");
      unreadCount = inbox?.unseen || 0;
    }

    return NextResponse.json({
      unreadCount,
    });
  } catch (error) {
    console.error("Yahoo Mail API Error:", error);
    return NextResponse.json(
      { unreadCount: 0, status: "disconnected", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 200 }
    );
  }
}
