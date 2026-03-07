import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* top bar */}
      <header
        style={{
          backgroundColor: "white", // main theme background
          // remove visible border
          borderBottom: "none",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 500 }}>
          Logged in as: <strong>{session.user.email}</strong>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            style={{
              padding: "6px 12px",
              fontSize: "18px",
              backgroundColor: "transparent",
              color: "#d32f2f",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Sign out"
          >
            🚪
          </button>
        </form>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* left nav bar */}
        <nav
          style={{
            width: "200px",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRight: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <a href="/dashboard" style={{ textDecoration: "none", color: "#333" }}>
                Home
              </a>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <a href="/dashboard/profile" style={{ textDecoration: "none", color: "#333" }}>
                Profile
              </a>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <a href="/dashboard/settings" style={{ textDecoration: "none", color: "#333" }}>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        {/* main content area */}
        <div style={{ flex: 1, padding: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>
            Dashboard
          </h1>

          <div
            className="section-shadow"
            style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginTop: "20px" }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
              Welcome, {session.user.name || session.user.email}!
            </h2>
            <p style={{ margin: "0", fontSize: "1.1rem" }}>Email: {session.user.email}</p>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Profile"
                style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px", border: "2px solid #ddd" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <footer
        style={{
          backgroundColor: "#fafafa",
          padding: "10px 20px",
          textAlign: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        © {new Date().getFullYear()} learnvercelnext
      </footer>
    </div>
  );
}
