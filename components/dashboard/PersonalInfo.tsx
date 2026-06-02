"use client";

import { useState, useEffect } from "react";
import OctopusEnergy from "./OctopusEnergy";
import HSBCBank from "./HSBCBank";
import Gmail from "./Gmail";
import YahooMail from "./YahooMail";

interface PersonalInfoProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function PersonalInfo({ user }: PersonalInfoProps) {
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
        Personal Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <OctopusEnergy />
        <HSBCBank />
        <Gmail />
        <YahooMail />
      </div>

      {user?.image && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={user.image}
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px solid #ddd",
            }}
          />
          <p style={{ marginTop: "10px", fontSize: "0.95rem" }}>{user?.name || "User"}</p>
        </div>
      )}
    </div>
  );
}
