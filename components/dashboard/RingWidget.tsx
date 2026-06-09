"use client";

import { useState, useEffect } from "react";

export default function RingWidget() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<null | { ok: boolean; valid?: boolean; endpoint?: string; sample?: any; error?: string }>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ring/validate");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setStatus({ ok: false, error: err instanceof Error ? err.message : String(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 15, border: "1px solid #ddd", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.03)" }}>
      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Ring</h3>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Validation</div>
          {loading ? (
            <div style={{ color: "#999", marginTop: 6 }}>Checking...</div>
          ) : status?.ok && status.valid ? (
            <div style={{ color: "#28a745", marginTop: 6 }}>Connected ✓</div>
          ) : (
            <div style={{ color: "#ff6b6b", marginTop: 6 }}>Not connected{status?.error ? ` — ${status.error}` : ""}</div>
          )}
        </div>

        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Devices</div>
          <div style={{ marginTop: 6, color: "#999" }}>Device list & snapshots (coming soon)</div>
        </div>

        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Locks</div>
          <div style={{ marginTop: 6, color: "#999" }}>Lock/unlock controls (coming soon)</div>
        </div>

        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Events</div>
          <div style={{ marginTop: 6, color: "#999" }}>Recent motion/doorbell events (coming soon)</div>
        </div>
      </div>

      {status?.sample && (
        <pre style={{ marginTop: 10, fontSize: "0.7rem", color: "#666", maxHeight: 120, overflow: "auto" }}>{JSON.stringify(status.sample, null, 2)}</pre>
      )}
    </div>
  );
}
