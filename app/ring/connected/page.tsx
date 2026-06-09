interface RingConnectedProps {
  searchParams: { status?: string; message?: string };
}

export default function RingConnectedPage({ searchParams }: RingConnectedProps) {
  const status = searchParams.status || "unknown";
  const message = searchParams.message || "";

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
