import { useState, useEffect } from "react";

interface EnergyData {
  currentBill: number;
  dueDate: string;
  usage: number;
  status: "connected" | "disconnected";
}

interface YearlySeries {
  year: number;
  monthly: number[];
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const chartColors = ["#51cf66", "#74c0fc", "#fcc419", "#ffa94d", "#ba4a8d"];

function renderYearlyChart(title: string, data: YearlySeries[]) {
  const width = 760;
  const height = 300;
  const padding = { top: 24, right: 100, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const monthlyValues = data.flatMap((series) => series.monthly);
  const minValue = Math.min(...monthlyValues, 0);
  const maxValue = Math.max(...monthlyValues, 100);
  const range = maxValue - minValue || 1;

  return (
    <div style={{ width: "100%", marginTop: 24 }}>
      <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div style={{ color: "#999", fontSize: "0.85rem" }}>Y axis: usage (kWh) • X axis: months</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {data.map((series, index) => (
            <span key={series.year} style={{ display: "flex", alignItems: "center", gap: "6px", color: chartColors[index % chartColors.length], fontSize: "0.85rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: chartColors[index % chartColors.length], display: "inline-block" }} />
              {series.year}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="320" style={{ display: "block", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, backgroundColor: "rgba(0,0,0,0.02)" }}>
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="rgba(0,0,0,0.2)" />
        <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="rgba(0,0,0,0.2)" />

        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding.top + chartHeight - (chartHeight * i) / 4;
          const labelValue = Math.round(minValue + (range * i) / 4);
          return (
            <g key={`grid-${i}`}>
              <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="rgba(0,0,0,0.08)" />
              <text x={padding.left - 8} y={y + 4} fontSize="10" fill="#666" textAnchor="end">{labelValue}</text>
            </g>
          );
        })}

        {monthLabels.map((month, index) => {
          const x = padding.left + (chartWidth * index) / (monthLabels.length - 1);
          return (
            <g key={`x-${month}`}>
              <line x1={x} y1={padding.top + chartHeight} x2={x} y2={padding.top + chartHeight + 6} stroke="rgba(0,0,0,0.2)" />
              <text x={x} y={padding.top + chartHeight + 20} fontSize="10" fill="#666" textAnchor="middle">{month}</text>
            </g>
          );
        })}

        {data.map((series, seriesIndex) => {
          const points = series.monthly.map((value, index) => {
            const x = padding.left + (chartWidth * index) / (monthLabels.length - 1);
            const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
            return `${x},${y}`;
          }).join(" ");

          return (
            <g key={`line-${series.year}`}>
              <polyline fill="none" stroke={chartColors[seriesIndex % chartColors.length]} strokeWidth={2.5} points={points} />
              {series.monthly.map((value, index) => {
                const x = padding.left + (chartWidth * index) / (monthLabels.length - 1);
                const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
                return <circle key={`${series.year}-${index}`} cx={x} cy={y} r={3} fill={chartColors[seriesIndex % chartColors.length]} />;
              })}
            </g>
          );
        })}

        <text x={padding.left - 28} y={padding.top + chartHeight / 2} fontSize="11" fill="#666" textAnchor="middle" transform={`rotate(-90 ${padding.left - 28} ${padding.top + chartHeight / 2})`}>Usage (kWh)</text>
        <text x={padding.left + chartWidth / 2} y={height - 6} fontSize="11" fill="#666" textAnchor="middle">Months</text>
      </svg>
    </div>
  );
}

export default function OctopusEnergy() {
  const [energy, setEnergy] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electricitySeries, setElectricitySeries] = useState<YearlySeries[]>([]);
  const [gasSeries, setGasSeries] = useState<YearlySeries[]>([]);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await fetch("/api/octopus/account");

        if (!response.ok) {
          throw new Error("Failed to fetch energy data");
        }

        const data = await response.json();
        setEnergy({
          currentBill: data.currentBill || 0,
          dueDate: data.dueDate || "---",
          usage: data.usage || 0,
          status: data.status || "disconnected",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching energy data");
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
    const interval = setInterval(fetchEnergyData, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const [electricityResp, gasResp] = await Promise.all([
          fetch("/api/octopus/consumption?type=electricity&years=3"),
          fetch("/api/octopus/consumption?type=gas&years=3"),
        ]);

        if (!electricityResp.ok || !gasResp.ok) {
          setElectricitySeries([]);
          setGasSeries([]);
          return;
        }

        const electricityData = await electricityResp.json();
        const gasData = await gasResp.json();

        setElectricitySeries(electricityData.seriesByYear || []);
        setGasSeries(gasData.seriesByYear || []);
      } catch (e) {
        setElectricitySeries([]);
        setGasSeries([]);
      }
    };

    fetchUsage();
  }, []);

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

      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : (
        <>
          <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
            Status: {energy?.status === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </p>

          {electricitySeries.length > 0 ? renderYearlyChart("Electricity Usage", electricitySeries) : (
            <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#999" }}>No electricity usage data available.</p>
          )}

          {gasSeries.length > 0 ? renderYearlyChart("Gas Usage", gasSeries) : (
            <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#999" }}>No gas usage data available.</p>
          )}
        </>
      )}
    </div>
  );
}
