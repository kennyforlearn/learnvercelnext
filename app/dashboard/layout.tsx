import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import navItems from "./navItems.json";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      {/* top bar */}
      <header
        style={{
          backgroundColor: "var(--bg-color)",
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
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Sign out"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              logout
            </span>
          </button>
        </form>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* navigation column */}
        <nav
          style={{
            width: "200px",
            backgroundColor: "var(--bg-color)",
            padding: "20px",
            border: "none",
            boxSizing: "border-box",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                <a href={item.href} style={{ textDecoration: "none", color: "#333" }}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* page content */}
        <main style={{ flex: 1 }}>{children}</main>
      </div>

      {/* footer */}
      <footer
        style={{
          backgroundColor: "var(--bg-color)",
          padding: "10px 20px",
          textAlign: "center",
          borderTop: "none",
        }}
      >
        © {new Date().getFullYear()} learnvercelnext
      </footer>
    </div>
  );
}
