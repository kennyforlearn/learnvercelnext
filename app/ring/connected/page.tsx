export const dynamic = "force-dynamic";

interface RingConnectedProps {
  searchParams: { status?: string | string[]; message?: string | string[] };
}

function normalizeQueryValue(value: string | string[] | undefined) {
  if (!value) return "unknown";
  return Array.isArray(value) ? value[0] : value;
}

export default function RingConnectedPage({ searchParams }: RingConnectedProps) {
  const status = normalizeQueryValue(searchParams.status);
  const message = normalizeQueryValue(searchParams.message) || "";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1>Ring account connection</h1>
      <p>
        Status: <strong>{status}</strong>
      </p>
      {message ? <p>{message}</p> : null}
      {status === "success" ? (
        <p>Your Ring account is now linked. You can return to the dashboard.</p>
      ) : (
        <p>
          If the flow failed, try again from the <a href="/ring/link">Ring login page</a>.
        </p>
      )}
    </main>
  );
}
