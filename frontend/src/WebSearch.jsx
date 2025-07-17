import React, { useState } from "react";
import { webSearch } from "./api";
import { useTheme } from "./ThemeContext";

function WebSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await webSearch(query);
      setResults(data.results || JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to search:", error);
      setResults("Error performing web search.");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
  };

  return (
    <div style={{ color: colors.text }}>
      <h2 style={{ color: colors.text }}>Web Search (AI + Internet)</h2>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ask anything..."
        style={{ 
          marginRight: 8,
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          background: colors.cardBackground,
          color: colors.text,
          fontSize: 16,
          minWidth: 300
        }}
      />
      <button
        onClick={handleSearch}
        disabled={loading || !query}
        style={{
          background: colors.buttonPrimary,
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !query ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>
      <button
        onClick={handleClear}
        disabled={loading && !query && !results}
        style={{
          background: colors.cardBackground,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading && !query && !results ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Clear
      </button>
      {results && (
        <pre style={{ 
          marginTop: 16, 
          background: colors.primaryLight, 
          borderRadius: 6, 
          padding: 12, 
          whiteSpace: "pre-wrap", 
          wordBreak: "break-word",
          color: colors.text
        }}>
          {results}
        </pre>
      )}
    </div>
  );
}

export default WebSearch;
