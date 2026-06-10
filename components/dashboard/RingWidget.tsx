"use client";

import { useState, useEffect } from "react";

type RingStatus = {
  ok: boolean;
  valid?: boolean;
  error?: string;
  devices?: Array<Record<string, unknown>>;
};

export default function RingWidget() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<RingStatus | null>(null);

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

  const connected = !!status?.ok && !!status?.valid;
  const hasDevices = Array.isArray(status?.devices) && status.devices.length > 0;

  return (
    <div style={{ padding: 15, border: "1px solid #ddd", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.03)" }}>
      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Ring</h3>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Validation</div>
          {loading ? (
            <div style={{ color: "#999", marginTop: 6 }}>Checking...</div>
          ) : connected ? (
            <div style={{ color: "#28a745", marginTop: 6 }}>Connected ✓</div>
          ) : (
            <div style={{ color: "#ff6b6b", marginTop: 6 }}>Not connected{status?.error ? ` — ${status.error}` : ""}</div>
          )}
        </div>

        <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Devices</div>
          {loading ? (
            <div style={{ color: "#999", marginTop: 6 }}>Loading devices...</div>
          ) : connected ? (
            hasDevices ? (
              <div style={{ marginTop: 6, display: "grid", gap: 8 }}>
                {status.devices!.slice(0, 4).map((device, index) => (
                  <div
                    key={`${device.id ?? index}-${index}`}
                    style={{ padding: 8, borderRadius: 6, background: "rgba(255,255,255,0.08)" }}
                  >
                    <div style={{ fontWeight: 600 }}>{String(device.name ?? device.device_name ?? `Device ${index + 1}`)}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
                      {String(device.type ?? device.device_type ?? device.kind ?? "Ring device")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 6, color: "#999" }}>No devices found.</div>
            )
          ) : (
            <a
              href="/api/ring/oauth/authorize"
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#0070f3",
                color: "white",
                textDecoration: "none",
              }}
            >
              Log in to Ring
            </a>
          )}
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

      {status?.devices && hasDevices && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>Device details</div>
          <pre style={{ marginTop: 0, fontSize: "0.7rem", color: "#666", maxHeight: 140, overflow: "auto" }}>
            {JSON.stringify(status.devices.slice(0, 3), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
