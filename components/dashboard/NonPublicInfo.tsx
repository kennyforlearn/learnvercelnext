"use client";

import { useState, useEffect } from "react";
import OctopusEnergy from "./OctopusEnergy";
import Gmail from "./Gmail";
import YahooMail from "./YahooMail";

export default function NonPublicInfo() {
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
        Private Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <OctopusEnergy />
        <Gmail />
        <YahooMail />
      </div>
    </div>
  );
}
