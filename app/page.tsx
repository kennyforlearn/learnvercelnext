import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // session.user.email is passed to a client component which handles the
  // white themed layout and the auto-redirect logic.
  return <LoggedInInfo email={session.user.email} />;
}

// ---------------------------------------------------------------------------
// Client component ----------------------------------------------------------
// ---------------------------------------------------------------------------

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoggedInInfoProps {
  email: string;
}

function LoggedInInfo({ email }: LoggedInInfoProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>
        Welcome to Your App
      </h1>

      <div
        className="section-shadow"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <p style={{ margin: "0", fontSize: "1.1rem" }}>
          ✓ Logged in as: <strong>{email}</strong>
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
            Go to Dashboard
          </button>
        </Link>
      </div>

      {/* note: redirect happens automatically after five seconds */}
    </main>
  );
}
