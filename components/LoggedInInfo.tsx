"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoggedInInfoProps {
  email: string;
}

export default function LoggedInInfo({ email }: LoggedInInfoProps) {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    // decrement counter every second
    const interval = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);

    // final redirect when counter reaches 0
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "600",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Welcome to Your App
      </h1>

      <div
        className="section-shadow"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
          textAlign: "center", // center contents
        }}
      >
        <p style={{ margin: "0", fontSize: "1.1rem" }}>
          ✓ Logged in as: <strong>{email}</strong>
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "0.95rem", color: "#555" }}>
          Will redirect to main dashboard in <strong>{count}</strong> seconds
        </p>
        <Link href="/dashboard">
          <button
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "white",
              color: "#4caf50",
              border: "1px solid #4caf50",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Dashboard
          </button>
        </Link>
      </div>

      {/* note: redirect happens automatically after five seconds */}
    </main>
  );
}