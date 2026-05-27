import { auth } from "@/lib/auth";
import PublicInfo from "@/components/dashboard/PublicInfo";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div style={{ flex: 1, padding: "40px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <PublicInfo />
      </div>
    </div>
  );
}
