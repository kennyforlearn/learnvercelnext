import { useState, useEffect } from "react";

interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Use server-side endpoint to avoid client protocol/TLS issues (HTTP 426)
        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }

        const data = await response.json();
        setArticles(
          (data.articles || []).slice(0, 3).map((article: any) => ({
            title: article.title,
            source: article.source?.name || article.source,
            publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "",
            url: article.url,
          }))
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh news every 30 minutes
    const interval = setInterval(fetchNews, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Latest News</h3>
      {loading ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>Loading...</p>
      ) : error ? (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ff6b6b" }}>{error}</p>
      ) : articles.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.85rem",
                color: "#0066cc",
                textDecoration: "none",
                paddingBottom: "6px",
                borderBottom: idx < articles.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
              title={article.title}
            >
              {article.title.substring(0, 50)}...
              <br />
              <span style={{ fontSize: "0.75rem", color: "#999" }}>{article.source} • {article.publishedAt}</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
