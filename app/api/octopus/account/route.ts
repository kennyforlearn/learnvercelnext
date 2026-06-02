import { NextRequest, NextResponse } from "next/server";

/**
 * Octopus Energy Account Route
 * Fetches bill and usage info from Octopus Energy API
 * 
 * Env vars required:
 * - OCTOPUS_API_KEY (or NEXT_PUBLIC_OCTOPUS_API_KEY)
 * - OCTOPUS_ACCOUNT (or NEXT_PUBLIC_OCTOPUS_ACCOUNT)
 */

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OCTOPUS_API_KEY || process.env.NEXT_PUBLIC_OCTOPUS_API_KEY;
    const accountNumber = process.env.OCTOPUS_ACCOUNT || process.env.NEXT_PUBLIC_OCTOPUS_ACCOUNT;

    if (!apiKey || !accountNumber) {
      console.warn("Octopus credentials not configured");
      // Return mock data
      return NextResponse.json({
        currentBill: 0,
        dueDate: "---",
        usage: 0,
        status: "disconnected",
      });
    }

    // Basic auth header for Octopus API
    const auth = Buffer.from(`${apiKey}:`).toString("base64");

    // Fetch account details (includes bill info)
    const response = await fetch(
      `https://api.octopus.energy/v1/accounts/${accountNumber}/`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Octopus API error: ${response.status}`);
      return NextResponse.json({
        currentBill: 0,
        dueDate: "---",
        usage: 0,
        status: "disconnected",
      });
    }

    const data = await response.json();

    // Parse nested structure
    const property = data.properties?.[0];
    if (!property) {
      return NextResponse.json({
        currentBill: 0,
        dueDate: "---",
        usage: 0,
        status: "disconnected",
      });
    }

    // Try to get electricity meter and latest consumption
    let usage = 0;
    const elecMeters = property.electricity_meter_points?.[0]?.meters || [];
    if (elecMeters.length > 0) {
      // This is a simplified approach; real consumption requires separate API call to /meter-point/{MPAN}/consumption/
      usage = elecMeters[0].consumption_standard || 0;
    }

    // Extract bill info
    const currentBill = data.current_bill_amount || 0;
    const dueDate = data.current_bill_due_date || "---";

    return NextResponse.json({
      currentBill,
      dueDate,
      usage,
      status: "connected",
    });
  } catch (err) {
    console.error("Octopus account error:", err);
    return NextResponse.json({
      currentBill: 0,
      dueDate: "---",
      usage: 0,
      status: "disconnected",
    });
  }
}
