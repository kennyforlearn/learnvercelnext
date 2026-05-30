import { NextRequest, NextResponse } from "next/server";

function mockSeries(days: number) {
  const series = [] as { date: string; value: number }[];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    series.push({ date: d.toISOString().slice(0, 10), value: Math.round(20 + Math.random() * 80) });
  }
  return series;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "electricity";
    const days = Math.min(parseInt(url.searchParams.get("days") || "30"), 365);

    const apiKey = process.env.OCTOPUS_API_KEY || process.env.NEXT_PUBLIC_OCTOPUS_API_KEY;
    const account = process.env.OCTOPUS_ACCOUNT || process.env.NEXT_PUBLIC_OCTOPUS_ACCOUNT;

    if (!apiKey || !account) {
      return NextResponse.json({ series: mockSeries(days) });
    }

    // Real Octopus consumption requires meter IDs; for now return mock if not configured fully
    return NextResponse.json({ series: mockSeries(days) });
  } catch (err) {
    console.error("octopus consumption error", err);
    return NextResponse.json({ series: [] });
  }
}
