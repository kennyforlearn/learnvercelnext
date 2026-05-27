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

    if (!accessToken) {
      return NextResponse.json(
        { error: "Yahoo Mail access token not configured" },
        { status: 500 }
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
      throw new Error(`Yahoo Mail API error: ${response.statusText}`);
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
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
