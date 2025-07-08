// Scenario Simulator component skeleton
import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { fetchSimulationStep } from "./api";
import { updateProgress } from "./Dashboard";

function Simulator() {
  const [history, setHistory] = useState([]); // [{customerText, userChoice, feedback}]
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [scenarioType, setScenarioType] = useState("");
  const [started, setStarted] = useState(false);

  // Start the simulation with scenario type
  const startSimulation = () => {
    setLoading(true);
    fetchSimulationStep([], scenarioType || "late delivery").then(res => {
      setCurrent(res);
      setHistory([]);
      setShowFeedback(false);
      setSelectedChoice(null);
      setStarted(true);
      setLoading(false);
    });
  };

  // Handle user choice
  const handleChoice = (choice, idx) => {
    setSelectedChoice(idx);
    setShowFeedback(true);
  };

  // Go to next step after feedback
  const handleNext = () => {
    setLoading(true);
    const lastTurn = {
      customerText: current.customerText,
      userChoice: current.choices[selectedChoice].text,
      feedback: current.choices[selectedChoice].feedback
    };
    const newHistory = [...history, lastTurn];
    fetchSimulationStep(newHistory, current.choices[selectedChoice].text).then(res => {
      setCurrent(res);
      setHistory(newHistory);
      setShowFeedback(false);
      setSelectedChoice(null);
      setLoading(false);
      // If simulation is complete (no more choices), update progress
      if (!res.choices || res.choices.length === 0) {
        const progress = JSON.parse(localStorage.getItem("ai_learning_progress"));
        // Count "good" feedback (case-insensitive, includes several positive words)
        const isGood = /(good|excellent|well done|great|correct)/i.test(lastTurn.feedback || "");
        updateProgress({
          simulationsCompleted: (progress.simulationsCompleted || 0) + 1,
          simulationScore: (progress.simulationScore || 0) + (isGood ? 1 : 0)
        });
      }
    });
  };

  // Restart simulation
  const handleRestart = () => {
    setHistory([]);
    setCurrent(null);
    setShowFeedback(false);
    setSelectedChoice(null);
    setScenarioType("");
    setStarted(false);
  };

  // Initial scenario type input
  if (!started) {
    return (
      <div style={{ marginTop: 24, background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
        <b style={{ cursor: 'help', fontSize: 20 }}>Start a Scenario Simulation</b>
        <div style={{ margin: "12px 0" }}>
          <input
            type="text"
            placeholder="Enter scenario type or customer issue (e.g., 'late delivery')"
            value={scenarioType}
            onChange={e => setScenarioType(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb", minWidth: 220, fontSize: 15 }}
            title="Type the scenario type or customer issue you want to simulate (e.g., 'late delivery', 'product defect', etc.)"
          />
        </div>
        <span>
          <button
            onClick={startSimulation}
            disabled={loading || !scenarioType.trim()}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              background: "#3949ab",
              color: "#fff",
              border: 0,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading || !scenarioType.trim() ? "not-allowed" : "pointer",
              boxShadow: "0 1px 4px #0001"
            }}
            title="Click to start the simulation with your chosen scenario. You will interact with the AI, make choices, and receive feedback."
          >
            {loading ? "Loading..." : "Start Simulation"}
          </button>
        </span>
      </div>
    );
  }

  if (loading || !current) return <div style={{ marginTop: 24 }}>Loading simulation...</div>;
  if (!current.choices || current.choices.length === 0) {
    // Simulation complete: update progress if not already done (handled in handleNext)
    return (
      <div style={{ marginTop: 24, background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
        <b style={{ fontSize: 20 }}>Simulation complete!</b>
        <button
          onClick={handleRestart}
          style={{ marginLeft: 16, padding: "6px 16px", borderRadius: 6, background: "#1a237e", color: "#fff", border: 0, fontWeight: 600, fontSize: 16 }}
          title="Restart the simulation to try a new scenario or approach."
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24, background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
      <b style={{ fontSize: 20 }}>Scenario Simulator</b>
      {/* Conversation History */}
      {history.length > 0 && (
        <div style={{ margin: "16px 0", background: "#eef3fa", borderRadius: 8, padding: 12 }}>
          <b>Conversation History:</b>
          {history.map((turn, idx) => (
            <div key={idx} style={{ marginTop: 8 }}>
              <span style={{ color: "#3949ab" }}>Customer:</span> {turn.customerText}<br />
              <span style={{ color: "#00897b" }}>You:</span> {turn.userChoice}<br />
              <span style={{ color: "#c62828" }}>Feedback:</span> {turn.feedback}
            </div>
          ))}
        </div>
      )}
      {/* Current Step */}
      <div style={{ marginBottom: 12 }}>
        <b>Customer:</b> {current.customerText}
      </div>
      {current.choices.map((choice, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <button
            onClick={() => handleChoice(choice, idx)}
            disabled={showFeedback}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #3949ab",
              background: selectedChoice === idx ? "#3949ab" : "#fff",
              color: selectedChoice === idx ? "#fff" : "#3949ab",
              fontWeight: 600,
              fontSize: 16,
              cursor: showFeedback ? "not-allowed" : "pointer",
              boxShadow: selectedChoice === idx ? "0 1px 4px #3949ab33" : "0 1px 4px #0001"
            }}
            title="Click to select this response. You will see feedback after making a choice."
          >
            {choice.text}
          </button>
        </div>
      ))}
      {/* Feedback */}
      {showFeedback && (
        <div style={{ marginTop: 10, marginBottom: 10, color: "#00897b" }}>
          <b>Feedback:</b> {current.choices[selectedChoice].feedback}
        </div>
      )}
      {/* Next and Restart */}
      {showFeedback && (
        <button
          onClick={handleNext}
          style={{ marginTop: 8, padding: "6px 16px", borderRadius: 6, background: "#1a237e", color: "#fff", border: 0, fontWeight: 600, fontSize: 16 }}
        >
          Next
        </button>
      )}
      <button
        onClick={handleRestart}
        style={{ marginLeft: 16, padding: "6px 16px", borderRadius: 6, background: "#c62828", color: "#fff", border: 0, fontWeight: 600, fontSize: 16 }}
        title="Restart the simulation to try a new scenario or approach."
      >
        Restart
      </button>
    </div>
  );
}

export default Simulator; 