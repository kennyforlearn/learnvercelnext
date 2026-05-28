import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * Gmail Unread Count API Route
 * 
 * This route fetches unread email count from Gmail API.
 * Requires OAuth2 setup with Google Cloud Console.
 * 
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project
 * 3. Enable Gmail API
 * 4. Create OAuth2 credentials (Desktop app)
 * 5. Download credentials JSON
 * 6. Use credentials to get refresh token
 * 7. Store tokens in environment variables
 */

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;

    if (!accessToken || accessToken === "your_gmail_access_token_or_refresh_token") {
      return NextResponse.json(
        { email: "Not connected", unreadCount: 0, error: "Gmail not configured" },
        { status: 200 }
      );
    }

    // Fetch unread emails from Gmail API
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Gmail API error: ${response.status} ${response.statusText}`);
      throw new Error(`Gmail API error: ${response.status}`);
    }

    const data = await response.json();
    const unreadCount = data.resultSizeEstimate || 0;

    // Get user profile for email
    const profileResponse = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let email = "Not available";
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      email = profileData.emailAddress || email;
    }

    return NextResponse.json({
      email,
      unreadCount,
    });
  } catch (error) {
    console.error("Gmail API Error:", error);
    return NextResponse.json(
      { email: "Not connected", unreadCount: 0, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 200 }
    );
  }
}
