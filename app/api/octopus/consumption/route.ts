import { NextRequest, NextResponse } from "next/server";

interface ConsumptionResult {
  interval_start: string;
  consumption: number;
}

interface ConsumptionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ConsumptionResult[];
}

async function fetchOctopusConsumption(
  mpan: string,
  serial: string,
  periodFrom: string,
  periodTo: string,
  apiKey: string
): Promise<number[]> {
  const monthlyData: { [key: string]: number } = {};

  const url = new URL(`https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serial}/consumption/`);
  url.searchParams.set("group_by", "month");
  url.searchParams.set("period_from", periodFrom);
  url.searchParams.set("period_to", periodTo);
  url.searchParams.set("page_size", "25000");
  url.searchParams.set("order_by", "period");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "User-Agent": "learnvercelnext/1.0",
      },
    });

    if (!response.ok) {
      console.error(`Octopus API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: ConsumptionResponse = await response.json();

    // Group results by month (YYYY-MM)
    data.results.forEach((result: ConsumptionResult) => {
      const month = result.interval_start.substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + result.consumption;
    });

    // Convert to 12-month array for the current/requested period
    const months = Object.keys(monthlyData).sort();
    const monthly = Array(12).fill(0);

    if (months.length > 0) {
      const startMonth = months[0];
      months.forEach((month) => {
        const d = new Date(`${month}-01`);
        const monthIndex = d.getMonth();
        monthly[monthIndex] = Math.round(monthlyData[month] * 100) / 100;
      });
    }

    return monthly;
  } catch (err) {
    console.error("Octopus consumption fetch error:", err);
    return [];
  }
}

async function fetchGasConsumption(
  mprn: string,
  serial: string,
  periodFrom: string,
  periodTo: string,
  apiKey: string
): Promise<number[]> {
  const monthlyData: { [key: string]: number } = {};

  const url = new URL(`https://api.octopus.energy/v1/gas-meter-points/${mprn}/meters/${serial}/consumption/`);
  url.searchParams.set("group_by", "month");
  url.searchParams.set("period_from", periodFrom);
  url.searchParams.set("period_to", periodTo);
  url.searchParams.set("page_size", "25000");
  url.searchParams.set("order_by", "period");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "User-Agent": "learnvercelnext/1.0",
      },
    });

    if (!response.ok) {
      console.error(`Octopus API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: ConsumptionResponse = await response.json();

    // Group results by month (YYYY-MM)
    data.results.forEach((result: ConsumptionResult) => {
      const month = result.interval_start.substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + result.consumption;
    });

    // Convert to 12-month array for the current/requested period
    const months = Object.keys(monthlyData).sort();
    const monthly = Array(12).fill(0);

    if (months.length > 0) {
      const startMonth = months[0];
      months.forEach((month) => {
        const d = new Date(`${month}-01`);
        const monthIndex = d.getMonth();
        monthly[monthIndex] = Math.round(monthlyData[month] * 100) / 100;
      });
    }

    return monthly;
  } catch (err) {
    console.error("Octopus gas consumption fetch error:", err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const years = Math.min(Math.max(parseInt(url.searchParams.get("years") || "3"), 1), 5);
    const type = url.searchParams.get("type") || "electricity";

    const apiKey = process.env.NEXT_PUBLIC_OCTOPUS_API_KEY;

    if (!apiKey) {
      console.warn("Octopus API key not configured");
      return NextResponse.json({ seriesByYear: [] });
    }

    const seriesByYear: { year: number; monthly: number[] }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < years; i++) {
      const year = currentYear - i;
      const periodFrom = `${year}-01-01T00:00:00Z`;
      const periodTo = `${year + 1}-01-01T00:00:00Z`;

      let monthly: number[] = [];

      if (type === "electricity") {
        const mpan = process.env.NEXT_PUBLIC_OCTOPUS_ELECTRICITY_MPAN;
        const serial = process.env.NEXT_PUBLIC_OCTOPUS_ELECTRICITY_SERIAL;

        if (mpan && serial) {
          monthly = await fetchOctopusConsumption(mpan, serial, periodFrom, periodTo, apiKey);
        }
      } else if (type === "gas") {
        const mprn = process.env.NEXT_PUBLIC_OCTOPUS_GAS_MPAN;
        const serial = process.env.NEXT_PUBLIC_OCTOPUS_GAS_SERIAL;

        if (mprn && serial) {
          monthly = await fetchGasConsumption(mprn, serial, periodFrom, periodTo, apiKey);
        }
      }

      if (monthly.length > 0 && monthly.some((v) => v > 0)) {
        seriesByYear.push({ year, monthly });
      }
    }

    return NextResponse.json({ seriesByYear });
  } catch (err) {
    console.error("octopus consumption error", err);
    return NextResponse.json({ seriesByYear: [] });
  }
}
