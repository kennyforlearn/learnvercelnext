import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL = "https://oauth.ring.com/oauth/v2/token";

function getRedirectUri() {
  const explicit = process.env.RING_OAUTH_REDIRECT_URI;
  if (explicit) return explicit;

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  return `${baseUrl ?? "http://localhost:3000"}/api/ring/oauth/callback`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get("ring_oauth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      `/ring/connected?status=error&message=${encodeURIComponent("Invalid Ring OAuth callback state")}`
    );
  }

  const clientId = process.env.RING_CLIENT_ID;
  const clientSecret = process.env.RING_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `/ring/connected?status=error&message=${encodeURIComponent("Ring client credentials are not configured")}`
    );
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: getRedirectUri(),
  });

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    const message = tokenData.error_description || tokenData.error || "Ring token exchange failed";
    return NextResponse.redirect(`/ring/connected?status=error&message=${encodeURIComponent(message)}`);
  }

  const response = NextResponse.redirect("/ring/connected?status=success");
  response.cookies.set("ring_refresh_token", tokenData.refresh_token ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.delete("ring_oauth_state", { path: "/" });
  return response;
}
