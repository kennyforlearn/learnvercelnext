"use client";

import { useState, useEffect } from "react";
import Weather from "./Weather";
import News from "./News";
import NetworkStatus from "./NetworkStatus";
import PowerUtilities from "./PowerUtilities";
import StockIndex from "./StockIndex";

export default function PublicInfo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="section-shadow"
      style={{
        backgroundColor: "var(--bg-color)",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>
        Public Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <Weather />
        <News />
        <NetworkStatus />
        <PowerUtilities />
        <StockIndex />
      </div>
    </div>
  );
}
