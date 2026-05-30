import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    if (!accessToken || accessToken === "your_gmail_access_token_or_refresh_token") {
      return NextResponse.json({ messages: [] });
    }

    const url = new URL(request.url);
    const max = Math.min(parseInt(url.searchParams.get("max") || "10"), 100);

    // List messages
    const listResp = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&q=`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!listResp.ok) {
      const text = await listResp.text();
      console.error("Gmail list error:", listResp.status, text);
      return NextResponse.json({ messages: [] });
    }

    const listData = await listResp.json();
    const messages = listData.messages || [];

    // Fetch details for each message (batch sequentially to avoid quotas)
    const details = [] as any[];
    for (let i = 0; i < messages.length; i++) {
      const id = messages[i].id;
      try {
        const mRes = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!mRes.ok) {
          console.warn("Failed to fetch message", id, mRes.status);
          continue;
        }
        const m = await mRes.json();
        const headers = m.payload?.headers || [];
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "(no subject)";
        const date = headers.find((h: any) => h.name === "Date")?.value || "";
        details.push({ id, from, subject, date });
      } catch (e) {
        console.warn("Message fetch error", e);
      }
    }

    return NextResponse.json({ messages: details });
  } catch (err) {
    console.error("gmail-messages error", err);
    return NextResponse.json({ messages: [] });
  }
}
