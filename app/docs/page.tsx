import { readFileSync } from "fs";
import { join } from "path";

export default function DocsPage() {
  // Read the markdown file
  const filePath = join(process.cwd(), "docs", "authentication-process.md");
  const content = readFileSync(filePath, "utf8");

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", textAlign: "center" }}>Learning Documentation</h1>

      <div className="section-shadow" style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.5", color: "#333", fontSize: "1rem" }}>
          {content}
        </pre>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <a href="/" style={{ color: "#2196f3", textDecoration: "none", fontSize: "1.1rem", fontWeight: "500" }}>
          ← Back to Home
        </a>
      </div>
    </main>
  );
}