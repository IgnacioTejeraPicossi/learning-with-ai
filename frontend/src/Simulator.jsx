// Scenario Simulator component skeleton
import React, { useState } from "react";
import { askStream } from "./api";
import { useTheme } from "./ThemeContext";

function Simulator() {
  const [scenarioType, setScenarioType] = useState("");
  const [simulation, setSimulation] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleStartSimulation = async () => {
    setLoading(true);
    setSimulation("");
    try {
      await askStream({ prompt: `Create a scenario-based training simulation for: ${scenarioType}` }, (output) => setSimulation(output));
    } catch (error) {
      console.error("Failed to start simulation:", error);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setScenarioType("");
    setSimulation("");
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
        title="Launch an interactive scenario simulation. Practice workplace situations, customer interactions, and decision-making skills in a safe environment. Enter a scenario type to begin."
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
        title="Clear the current simulation and reset all inputs. Start fresh with a new scenario or different parameters."
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