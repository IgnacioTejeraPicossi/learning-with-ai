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
    <div>
      <h2>Recommendation</h2>
      <input
        value={skillGap}
        onChange={e => setSkillGap(e.target.value)}
        placeholder="Enter skill gap for recommendation"
        style={{ marginRight: 8 }}
      />
      <button onClick={handleGetRecommendation} disabled={loading || !skillGap}>
        {loading ? "Loading..." : "Get Recommendation"}
      </button>
      {recommendation && <pre style={{ marginTop: 12 }}>{recommendation}</pre>}
    </div>
  );
}

export default Recommendation; 