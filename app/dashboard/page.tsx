import { auth } from "@/lib/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div style={{ flex: 1, padding: "40px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>
        Dashboard
      </h1>

      <div
        className="section-shadow"
        style={{ backgroundColor: "var(--bg-color)", padding: "20px", borderRadius: "8px", marginTop: "20px" }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
          Welcome, {session?.user?.name || session?.user?.email}!
        </h2>
        <p style={{ margin: "0", fontSize: "1.1rem" }}>Email: {session?.user?.email}</p>
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px", border: "2px solid #ddd" }}
          />
        )}
      </div>
    </div>
  );
}
