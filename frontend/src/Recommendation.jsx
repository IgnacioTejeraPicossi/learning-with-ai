import React, { useState } from "react";
import { fetchRecommendation } from "./api";

function Recommendation() {
  const [skillGap, setSkillGap] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendation = async () => {
    setLoading(true);
    const data = await fetchRecommendation(skillGap);
    setRecommendation(data.recommendation);
    setLoading(false);
  };

  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
      <h2 style={{ marginTop: 0 }}>Recommendation</h2>
      <input
        value={skillGap}
        onChange={e => setSkillGap(e.target.value)}
        placeholder="Enter skill gap for recommendation"
        style={{
          marginRight: 8,
          padding: 8,
          borderRadius: 6,
          border: "1px solid #bbb",
          fontSize: 15,
          minWidth: 220
        }}
        title="Enter a skill gap (e.g., 'team leadership') to get tailored recommendations."
      />
      <button
        onClick={handleGetRecommendation}
        disabled={loading || !skillGap}
        style={{
          background: "#d32f2f",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !skillGap ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
        title="Generate learning module recommendations for the entered skill gap."
      >
        {loading ? "Loading..." : "Get Recommendation"}
      </button>
      {recommendation && <pre style={{ marginTop: 16, background: "#eef3fa", borderRadius: 6, padding: 12 }}>{recommendation}</pre>}
    </div>
  );
}

export default Recommendation; 