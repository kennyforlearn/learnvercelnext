import { useState, useEffect } from "react";

interface EnergyData {
  currentBill: number;
  dueDate: string;
  usage: number;
  status: "connected" | "disconnected";
}

export default function OctopusEnergy() {
  const [energy, setEnergy] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<{date:string,value:number}[]>([]);
  const [type, setType] = useState<'electricity'|'gas'>('electricity');

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OCTOPUS_API_KEY;
        const accountNumber = process.env.NEXT_PUBLIC_OCTOPUS_ACCOUNT;

        if (!apiKey || !accountNumber) {
          throw new Error("Octopus Energy credentials not configured");
        }

        // Fetch from Octopus Energy API
        const response = await fetch(
          `https://api.octopus.energy/v1/accounts/${accountNumber}/`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch energy data");
        }

        const data = await response.json();

        // Parse the response structure from Octopus Energy
        const property = data.properties?.[0];
        const electricity = property?.electricity_meter_points?.[0]?.meters?.[0];

        setEnergy({
          currentBill: data.current_bill_amount || 0,
          dueDate: data.current_bill_due_date || "---",
          usage: electricity?.consumption_standard || 0,
          status: "connected",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching energy data");
        // Set default values on error
        setEnergy({
          currentBill: 0,
          dueDate: "---",
          usage: 0,
          status: "disconnected",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
    // Refresh energy data every 60 minutes
    const interval = setInterval(fetchEnergyData, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const resp = await fetch(`/api/octopus/consumption?type=${type}&days=30`);
        if (!resp.ok) {
          setSeries([]);
          return;
        }
        const data = await resp.json();
        setSeries(data.series || []);
      } catch (e) {
        setSeries([]);
      }
    };
    fetchSeries();
  }, [type]);

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Octopus Energy</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Octopus Energy</h3>
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="electricity">Electricity</option>
            <option value="gas">Gas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : energy ? (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Bill: £{energy.currentBill.toFixed(2)}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Due: {energy.dueDate}</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Usage: {energy.usage} kWh</p>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Status: {energy.status === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </p>

          {series && series.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <svg viewBox="0 0 300 80" width="100%" height="80" preserveAspectRatio="none">
                {/* simple polyline chart */}
                {(() => {
                  const vals = series.map(s => s.value);
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  const points = series.map((s, i) => {
                    const x = (i / (series.length - 1)) * 300;
                    const y = max === min ? 40 : 80 - ((s.value - min) / (max - min)) * 70;
                    return `${x},${y}`;
                  }).join(' ');
                  return <polyline fill="none" stroke="#51cf66" strokeWidth={2} points={points} />
                })()}
              </svg>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
