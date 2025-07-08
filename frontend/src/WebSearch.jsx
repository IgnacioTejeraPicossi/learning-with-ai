import React, { useState } from "react";

function WebSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/web-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001", marginBottom: 32 }}>
      <h2 style={{ marginTop: 0 }}>Web Search (AI + Internet)</h2>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ask anything..."
        style={{ marginRight: 8, padding: 8, borderRadius: 6, border: "1px solid #bbb", fontSize: 15, minWidth: 220 }}
      />
      <button
        onClick={handleSearch}
        disabled={loading || !query}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !query ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
        title="Ask a question and get a live web-powered answer."
      >
        {loading ? "Searching..." : "Search"}
      </button>
      {result && <pre style={{ marginTop: 16, background: "#eef3fa", borderRadius: 6, padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result}</pre>}
    </div>
  );
}

export default WebSearch;
