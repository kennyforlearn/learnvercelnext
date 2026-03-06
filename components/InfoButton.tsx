"use client";

import Link from "next/link";
import { useState } from "react";

export function InfoButton() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInfo(!showInfo)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#666",
        }}
        title="Learn about authentication"
      >
        ℹ️
      </button>

      {showInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowInfo(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h2>How Authentication Works</h2>
            <div style={{ lineHeight: "1.6", color: "#333" }}>
              <p>This app uses OAuth authentication with multiple providers:</p>
              <ol>
                <li><strong>User clicks "Sign In"</strong> → Redirected to provider login</li>
                <li><strong>Provider authenticates</strong> → User grants permission</li>
                <li><strong>Callback to app</strong> → Receives user profile data</li>
                <li><strong>Email check</strong> → Verifies against authorized whitelist</li>
                <li><strong>Session created</strong> → User logged in successfully</li>
              </ol>
              <p><strong>Security:</strong> Only pre-approved emails can access. Sessions managed server-side.</p>
              <p><Link href="/docs" style={{ color: "#2196f3" }}>Read full documentation →</Link></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}