// Scenario Simulator component skeleton
import React, { useState } from "react";
import { fetchSimulation } from "./api";
import { useTheme } from "./ThemeContext";

function Simulator() {
  const [scenarioType, setScenarioType] = useState("");
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleStartSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchSimulation();
      setSimulation(data.simulation);
    } catch (error) {
      console.error("Failed to start simulation:", error);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setScenarioType("");
    setSimulation(null);
  };

  return (
    <div style={{ color: colors.text }}>
      <h2 style={{ color: colors.text }}>Start a Scenario Simulation</h2>
      <input
        type="text"
        value={scenarioType}
        onChange={e => setScenarioType(e.target.value)}
        placeholder="Enter scenario type or customer interaction"
        style={{ 
          marginRight: 8,
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          background: colors.cardBackground,
          color: colors.text,
          fontSize: 16
        }}
      />
      <button
        onClick={handleStartSimulation}
        disabled={loading || !scenarioType}
        style={{
          background: colors.buttonPrimary,
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !scenarioType ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        {loading ? "Loading..." : "Start Simulation"}
      </button>
      <button
        onClick={handleClear}
        disabled={loading && !scenarioType && !simulation}
        style={{
          background: colors.cardBackground,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading && !scenarioType && !simulation ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Clear
      </button>
      {simulation && (
        <pre style={{ 
          marginTop: 16, 
          background: colors.primaryLight, 
          borderRadius: 6, 
          padding: 12, 
          whiteSpace: "pre-wrap", 
          wordBreak: "break-word",
          color: colors.text
        }}>
          {simulation}
        </pre>
      )}
    </div>
  );
}

export default Simulator; 