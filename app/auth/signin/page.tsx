"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { InfoButton } from "@/components/InfoButton";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // each provider now includes an icon (sourced from Flaticon) and a
  // human‑readable name. the button will render the icon instead of the
  // lengthy "Sign in with …" text so the UI relies on symbols.
  const providers = [
    {
      id: "google",
      name: "Google",
      icon: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "https://cdn-icons-png.flaticon.com/512/145/145802.png",
    },
    {
      id: "microsoft-entra-id",
      name: "Microsoft",
      icon: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "https://cdn-icons-png.flaticon.com/512/145/145807.png",
    },
  ];

  const handleSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    await signIn(providerId, { redirect: true, redirectTo: "/" });
    setIsLoading(null);
  };

  return (
    <div className="section-shadow" style={{ padding: "40px", maxWidth: "500px", margin: "100px auto", backgroundColor: "white", position: "relative" }}>
      <InfoButton />
      <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "1rem", textAlign: "center" }}>Sign In</h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>Only authorized accounts can access this application.</p>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSignIn(provider.id)}
            disabled={isLoading !== null}
            className="provider-btn"
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: isLoading === provider.id ? "not-allowed" : "pointer",
              opacity: isLoading === provider.id ? 0.6 : 1,
              backgroundColor: "#f5f5f5",
              transition: "all 0.3s",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isLoading === provider.id ? (
              "Loading..."
            ) : (
              <>
                <img
                  src={provider.icon}
                  alt={provider.name}
                  style={{ width: "24px", height: "24px" }}
                />
                <span
                  style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    padding: 0,
                    margin: "-1px",
                    overflow: "hidden",
                    clip: "rect(0,0,0,0)",
                    whiteSpace: "nowrap",
                    border: 0,
                  }}
                >
                  Sign in with {provider.name}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      <p style={{ marginTop: "30px", fontSize: "14px", color: "#666", textAlign: "center" }}>
        If you don't have authorization, please contact the administrator.
      </p>

      {/* hover effect for provider buttons */}
      <style jsx>{`
        .provider-btn:hover {
          background-color: #e0e0e0;
          transform: scale(1.02);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}