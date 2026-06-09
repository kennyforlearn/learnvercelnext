import { NextRequest, NextResponse } from "next/server";

const AUTH_URL = "https://oauth.ring.com/oauth/v2/authorize";
const DEFAULT_SCOPE = "offline_access device:read";

function getRedirectUri() {
  const explicit = process.env.RING_OAUTH_REDIRECT_URI;
  if (explicit) return explicit;

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  return `${baseUrl ?? "http://localhost:3000"}/api/ring/oauth/callback`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.RING_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "RING_CLIENT_ID is not configured" }, { status: 500 });
  }

  const state = crypto.randomUUID();
  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("scope", process.env.RING_OAUTH_SCOPE ?? DEFAULT_SCOPE);
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("ring_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  return response;
}
