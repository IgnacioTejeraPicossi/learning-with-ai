import React, { useState } from "react";
import { fetchConcepts } from "./api";

function Concepts() {
  const [concepts, setConcepts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetConcepts = async () => {
    setLoading(true);
    const data = await fetchConcepts();
    setConcepts(data.concepts);
    setLoading(false);
  };

  const handleClear = () => {
    setConcepts(null);
  };

  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
      <h2 style={{ marginTop: 0 }}>AI Concepts</h2>
      <button
        onClick={handleGetConcepts}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
        title="Get 3 innovative AI-powered workplace learning concepts."
      >
        Get AI Concepts
      </button>
      <button
        onClick={handleClear}
        disabled={loading || !concepts}
        style={{
          background: "#fff",
          color: "#333",
          border: "1px solid #bbb",
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !concepts ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
        title="Clear the AI concepts result."
      >
        Clear
      </button>
      {concepts && <pre style={{ marginTop: 16, background: "#eef3fa", borderRadius: 6, padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{concepts}</pre>}
    </div>
  );
}

export default Concepts; 