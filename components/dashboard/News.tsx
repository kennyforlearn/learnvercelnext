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
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("us");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ country });
        if (query.trim()) {
          params.set("q", query.trim());
        }

        const response = await fetch(`/api/news?${params.toString()}`);

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
  }, [query, country]);

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
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search keywords"
          style={{
            flex: "1 1 180px",
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#111",
          }}
        />
        <select
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#111",
            minWidth: "140px",
          }}
        >
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
          <option value="in">India</option>
          <option value="jp">Japan</option>
        </select>
      </div>
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
      ) : (
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#999" }}>No articles found.</p>
      )}
    </div>
  );
}
