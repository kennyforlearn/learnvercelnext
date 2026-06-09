import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature =
    request.headers.get("x-ring-signature") || request.headers.get("ring-signature") || "";

  const body = await request.text();
  console.log("Ring webhook received", { signature, body });

  // TODO: implement HMAC signature verification using RING_HMAC_SIGNITURE_KEY when available.

  return NextResponse.json({ ok: true });
}
