import React, { useState } from "react";
import { fetchRecommendation } from "./api";
import ModalDialog from "./ModalDialog";

function Recommendation() {
  const [skillGap, setSkillGap] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetRecommendation = async () => {
    setLoading(true);
    setModalOpen(true);
    try {
      const result = await fetchRecommendation(skillGap);
      setAiOutput(result.recommendation || JSON.stringify(result, null, 2));
    } catch (err) {
      setAiOutput("Error fetching recommendation.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Recommendation</h2>
      <input
        type="text"
        value={skillGap}
        onChange={e => setSkillGap(e.target.value)}
        placeholder="Enter skill gap for recommendation"
        style={{ marginRight: 8 }}
      />
      <button
        onClick={handleGetRecommendation}
        disabled={!skillGap}
        style={{
          background: "#d32f2f",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: !skillGap ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Get Recommendation
      </button>
      <ModalDialog
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="Recommendation"
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>{aiOutput}</pre>
        )}
      </ModalDialog>
    </div>
  );
}

export default Recommendation; 