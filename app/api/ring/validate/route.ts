import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.RING_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: "RING_ACCESS_TOKEN not configured" }, { status: 400 });
    }

    const endpoints = [
      "https://api.amazonvision.com/v1/users/me",
      "https://api.amazonvision.com/v1/devices"
    ];

    for (const url of endpoints) {
      try {
        const resp = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "User-Agent": "learnvercelnext/1.0",
          },
        });

        if (resp.status === 401 || resp.status === 403) {
          return NextResponse.json({ ok: false, valid: false, status: resp.status, endpoint: url }, { status: 200 });
        }

        if (resp.ok) {
          let data: any = null;
          try { data = await resp.json(); } catch { data = await resp.text(); }
          // Return a small sample to avoid huge payloads
          const sample = Array.isArray(data) ? data.slice(0, 5) : data;
          return NextResponse.json({ ok: true, valid: true, endpoint: url, sample }, { status: 200 });
        }
      } catch (err) {
        // try next endpoint
        console.warn("Ring endpoint request failed:", url, err);
      }
    }

    return NextResponse.json({ ok: false, error: "No Ring endpoints responded successfully" }, { status: 200 });
  } catch (err) {
    console.error("Ring validate error:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
