import React, { useState } from "react";
import { fetchRecommendation } from "./api";
import ModalDialog from "./ModalDialog";

function Recommendation({ query }) {
  const [skillGap, setSkillGap] = useState(query || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const handleGetRecommendation = async () => {
    setLoading(true);
    setModalOpen(true);
    setShowSim(false);
    try {
      const result = await fetchRecommendation(skillGap);
      setAiOutput(result.recommendation || JSON.stringify(result, null, 2));
    } catch (err) {
      setAiOutput("Error fetching recommendation.");
    }
    setLoading(false);
  };

  const handleTrySimulation = () => {
    setShowSim(true);
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
        title="Get a personalized AI-powered learning recommendation for your skill gap."
      >
        Get Recommendation
      </button>
      <ModalDialog
        isOpen={modalOpen}
        onRequestClose={() => { setModalOpen(false); setShowSim(false); }}
        title="Recommendation"
      >
        {loading ? (
          <div style={{ width: '100%', margin: '24px 0' }}>
            <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: '#d32f2f', animation: 'progressBar 1.2s linear infinite alternate' }} />
            </div>
            <style>{`@keyframes progressBar { 0%{width:10%} 100%{width:90%} }`}</style>
          </div>
        ) : showSim ? (
          <div>
            <h3>Try a Simulation</h3>
            <p>Would you like to launch a scenario-based simulation to practice this skill?</p>
            <button onClick={() => window.location.reload()} style={{ background: '#1976d2', color: '#fff', border: 0, borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, marginTop: 8 }}>Go to Simulator</button>
          </div>
        ) : (
          <>
            <pre style={{ whiteSpace: "pre-wrap" }}>{aiOutput}</pre>
            {aiOutput && (
              <button onClick={handleTrySimulation} style={{ background: '#1976d2', color: '#fff', border: 0, borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, marginTop: 16 }}>Try Simulation</button>
            )}
          </>
        )}
      </ModalDialog>
    </div>
  );
}

export default Recommendation; 