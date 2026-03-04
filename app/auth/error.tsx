"use client";

import Link from "next/link";

export default function AuthError() {
  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "100px auto", textAlign: "center" }}>
      <h1>Authorization Failed</h1>
      <p style={{ color: "#d32f2f", marginTop: "20px", fontSize: "16px" }}>
        Your email address is not authorized to access this application.
      </p>
      <p style={{ marginTop: "20px", color: "#666" }}>
        Please contact the administrator if you believe this is an error.
      </p>
      <Link href="/auth/signin">
        <button
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to Sign In
        </button>
      </Link>
    </div>
  );
}
