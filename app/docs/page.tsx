import { readFileSync } from "fs";
import { join } from "path";

export default function DocsPage() {
  // Read the markdown file
  const filePath = join(process.cwd(), "docs", "authentication-process.md");
  const content = readFileSync(filePath, "utf8");

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Learning Documentation</h1>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", lineHeight: "1.5", color: "#333" }}>
          {content}
        </pre>
      </div>

      <div style={{ marginTop: "20px" }}>
        <a href="/" style={{ color: "#2196f3", textDecoration: "none" }}>
          ← Back to Home
        </a>
      </div>
    </main>
  );
}