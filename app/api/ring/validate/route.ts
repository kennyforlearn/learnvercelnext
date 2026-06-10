import { NextRequest, NextResponse } from "next/server";

const USER_ENDPOINT = "https://api.amazonvision.com/v1/users/me";
const DEVICES_ENDPOINT = "https://api.amazonvision.com/v1/devices";
const TOKEN_URL = "https://oauth.ring.com/oauth/v2/token";

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.RING_CLIENT_ID;
  const clientSecret = process.env.RING_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) return null;
  return response.json();
}

async function fetchRingData(accessToken: string, endpoint: string) {
  const resp = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "User-Agent": "learnvercelnext/1.0",
    },
  });

  if (!resp.ok) {
    return { ok: false, status: resp.status, endpoint };
  }

  let data: any = null;
  try {
    data = await resp.json();
  } catch {
    data = await resp.text();
  }

  return { ok: true, data, endpoint };
}

export async function GET(request: NextRequest) {
  try {
    const envToken = process.env.RING_ACCESS_TOKEN;
    const refreshToken = request.cookies.get("ring_refresh_token")?.value;
    let accessToken = envToken;
    let refreshResponse: any = null;

    if (!accessToken && refreshToken) {
      refreshResponse = await refreshAccessToken(refreshToken);
      if (refreshResponse?.access_token) {
        accessToken = refreshResponse.access_token;
      }
    }

    if (!accessToken) {
      return NextResponse.json({ ok: false, valid: false, error: "Not connected to Ring" }, { status: 200 });
    }

    const deviceResult = await fetchRingData(accessToken, DEVICES_ENDPOINT);

    if (deviceResult.ok) {
      const devices = Array.isArray(deviceResult.data) ? deviceResult.data : [];
      const sample = devices.slice(0, 5);
      const response = NextResponse.json({ ok: true, valid: true, devices, sample }, { status: 200 });

      if (refreshResponse?.refresh_token) {
        response.cookies.set("ring_refresh_token", refreshResponse.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return response;
    }

    if (deviceResult.status === 401 || deviceResult.status === 403) {
      return NextResponse.json({ ok: false, valid: false, status: deviceResult.status, endpoint: deviceResult.endpoint }, { status: 200 });
    }

    const userResult = await fetchRingData(accessToken, USER_ENDPOINT);
    if (userResult.ok) {
      const sample = Array.isArray(userResult.data) ? userResult.data.slice(0, 5) : userResult.data;
      const response = NextResponse.json({ ok: true, valid: true, endpoint: userResult.endpoint, sample }, { status: 200 });
      if (refreshResponse?.refresh_token) {
        response.cookies.set("ring_refresh_token", refreshResponse.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return response;
    }

    return NextResponse.json({ ok: false, valid: false, error: "Unable to verify Ring credentials" }, { status: 200 });
  } catch (err) {
    console.error("Ring validate error:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
