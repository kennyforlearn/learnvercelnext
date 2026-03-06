import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InfoButton } from "@/components/InfoButton";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>Welcome to Your App</h1>

      <div className="section-shadow" style={{ backgroundColor: "#e8f5e9", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <p style={{ margin: "0", fontSize: "1.1rem" }}>✓ Logged in as: <strong>{session.user.email}</strong></p>
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
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Go to Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
