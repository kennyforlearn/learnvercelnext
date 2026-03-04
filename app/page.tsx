import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Welcome to Your App</h1>

      {session?.user ? (
        <div style={{ backgroundColor: "#e8f5e9", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
          <p style={{ margin: "0" }}>✓ Logged in as: <strong>{session.user.email}</strong></p>
          <Link href="/dashboard">
            <button
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: "#fff3e0", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
          <p style={{ margin: "0" }}>Not logged in</p>
          <Link href="/auth/signin">
            <button
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
