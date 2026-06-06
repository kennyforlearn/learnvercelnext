import { NextRequest, NextResponse } from "next/server";

function mockUsage(years: number) {
  const results: { year: number; monthly: number[] }[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = currentYear - i;
    const monthly: number[] = [];
    for (let month = 0; month < 12; month++) {
      const base = 120 + (years - i) * 10;
      const variation = Math.sin((month / 11) * Math.PI * 2) * 20;
      monthly.push(Math.max(10, Math.round(base + variation + Math.random() * 16 - 8)));
    }
    results.push({ year, monthly });
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const years = Math.min(Math.max(parseInt(url.searchParams.get("years") || "3"), 1), 5);
    const type = url.searchParams.get("type") || "electricity";

    const apiKey = process.env.OCTOPUS_API_KEY || process.env.NEXT_PUBLIC_OCTOPUS_API_KEY;
    const account = process.env.OCTOPUS_ACCOUNT || process.env.NEXT_PUBLIC_OCTOPUS_ACCOUNT;

    const seriesByYear = mockUsage(years).map((entry) => ({
      year: entry.year,
      monthly: entry.monthly.map((value) => (type === "electricity" ? value : Math.round(value * 0.7))),
    }));

    if (!apiKey || !account) {
      return NextResponse.json({ seriesByYear });
    }

    // Real Octopus consumption requires meter IDs; for now return mock if not configured fully
    return NextResponse.json({ seriesByYear });
  } catch (err) {
    console.error("octopus consumption error", err);
    return NextResponse.json({ seriesByYear: [] });
  }
}
