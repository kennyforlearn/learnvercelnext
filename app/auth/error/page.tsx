"use client";

import Link from "next/link";

export default function AuthError() {
  return (
    <div className="section-shadow" style={{ padding: "40px", maxWidth: "500px", margin: "100px auto", backgroundColor: "white", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "1rem", color: "#d32f2f" }}>Authorization Failed</h1>
      <p style={{ color: "#d32f2f", marginTop: "20px", fontSize: "16px", marginBottom: "1.5rem" }}>
        Your email address is not authorized to access this application.
      </p>
      <p style={{ marginTop: "20px", color: "#666", marginBottom: "2rem" }}>
        Please contact the administrator if you believe this is an error.
      </p>
      <Link href="/auth/signin">
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Back to Sign In
        </button>
      </Link>
    </div>
  );
}