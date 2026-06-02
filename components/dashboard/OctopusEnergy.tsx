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
        // Use server-side endpoint to avoid exposing credentials
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
        <div style={{ marginTop: 16, overflow: 'auto' }}>
          <div style={{ fontSize: '0.85rem', marginBottom: 8, fontWeight: 600 }}>Usage ({type})</div>
          <svg viewBox="0 0 400 250" width="100%" height="250" preserveAspectRatio="xMidYMid meet" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            {/* Y-axis */}
            <line x1="40" y1="10" x2="40" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
            {/* X-axis */}
            <line x1="40" y1="220" x2="390" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
            
            {/* Y-axis labels and ticks */}
            {(() => {
              const vals = series.map(s => s.value);
              const min = Math.min(...vals);
              const max = Math.max(...vals);
              const step = Math.ceil((max - min) / 4);
              const labels = [];
              for (let i = 0; i <= 4; i++) {
                const val = min + step * i;
                const y = 220 - (i / 4) * 200;
                labels.push(
                  <g key={`y-${i}`}>
                    <text x="30" y={y + 4} fontSize="11" fill="rgba(255,255,255,0.6)" textAnchor="end">{val}</text>
                    <line x1="35" y1={y} x2="40" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                  </g>
                );
              }
              return labels;
            })()}
            
            {/* X-axis labels and ticks (every 5 days or so) */}
            {(() => {
              const labels = [];
              const interval = Math.max(1, Math.floor(series.length / 6));
              for (let i = 0; i < series.length; i += interval) {
                const x = 40 + ((i / (series.length - 1)) * 350);
                const dateStr = series[i].date.slice(5); // MM-DD
                labels.push(
                  <g key={`x-${i}`}>
                    <text x={x} y="240" fontSize="10" fill="rgba(255,255,255,0.6)" textAnchor="middle">{dateStr}</text>
                    <line x1={x} y1="218" x2={x} y2="222" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                  </g>
                );
              }
              return labels;
            })()}
            
            {/* Grid lines (optional) */}
            {(() => {
              const lines = [];
              for (let i = 1; i < 4; i++) {
                const y = 220 - (i / 4) * 200;
                lines.push(
                  <line key={`grid-${i}`} x1="40" y1={y} x2="390" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="2,2" />
                );
              }
              return lines;
            })()}
            
            {/* Data polyline */}
            {(() => {
              const vals = series.map(s => s.value);
              const min = Math.min(...vals);
              const max = Math.max(...vals);
              const points = series.map((s, i) => {
                const x = 40 + ((i / (series.length - 1)) * 350);
                const y = max === min ? 120 : 220 - ((s.value - min) / (max - min)) * 200;
                return `${x},${y}`;
              }).join(' ');
              return <polyline fill="none" stroke={type === 'electricity' ? '#51cf66' : '#ffa94d'} strokeWidth={2} points={points} />
            })()}
            
            {/* Axis labels */}
            <text x="10" y="100" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="middle" transform="rotate(-90 10 100)">Usage (kWh)</text>
            <text x="215" y="260" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="middle">Days</text>
          </svg>
        </div>
      )}
        </>
      ) : null}
    </div>
  );
}
