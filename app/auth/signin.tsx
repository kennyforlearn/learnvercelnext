"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const providers = [
    { id: "google", label: "Sign in with Google" },
    { id: "facebook", label: "Sign in with Facebook" },
    { id: "microsoft-entra-id", label: "Sign in with Microsoft" },
    { id: "linkedin", label: "Sign in with LinkedIn" },
  ];

  const handleSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    await signIn(providerId, { redirect: true, redirectTo: "/" });
    setIsLoading(null);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "100px auto" }}>
      <h1>Sign In</h1>
      <p>Only authorized accounts can access this application.</p>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSignIn(provider.id)}
            disabled={isLoading !== null}
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: isLoading === provider.id ? "not-allowed" : "pointer",
              opacity: isLoading === provider.id ? 0.6 : 1,
              backgroundColor: "#f5f5f5",
              transition: "all 0.3s",
            }}
          >
            {isLoading === provider.id ? "Loading..." : provider.label}
          </button>
        ))}
      </div>

      <p style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
        If you don't have authorization, please contact the administrator.
      </p>
    </div>
  );
}
