import React, { useState } from "react";
import { webSearch } from "./api";

function WebSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await webSearch(query);
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      {error && <div style={{ color: "red", marginTop: 8 }}>Error: {error}</div>}
      {result && <pre style={{ marginTop: 16, background: "#eef3fa", borderRadius: 6, padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result}</pre>}
    </div>
  );
}

export default WebSearch;
