import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Dashboard</h1>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>Welcome, {session.user.name || session.user.email}!</h2>
        <p>Email: {session.user.email}</p>
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }}
          />
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
