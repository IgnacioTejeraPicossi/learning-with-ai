// Scenario Simulator component skeleton
import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { fetchSimulationStep } from "./api";

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
      <div style={{ marginTop: 24 }}>
        <Tooltip title="Enter a scenario type (e.g., 'late delivery') and start the simulation. You will make choices, see feedback, and watch the conversation history grow. Restart anytime to try a new scenario or approach.">
          <b style={{ cursor: 'help' }}>Start a Scenario Simulation</b>
        </Tooltip>
        <div style={{ margin: "12px 0" }}>
          <Tooltip title="Type the scenario type or customer issue you want to simulate (e.g., 'late delivery', 'product defect', etc.)">
            <input
              type="text"
              placeholder="Enter scenario type or customer issue (e.g., 'late delivery')"
              value={scenarioType}
              onChange={e => setScenarioType(e.target.value)}
              style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc", minWidth: 220 }}
            />
          </Tooltip>
        </div>
        <Tooltip title="Click to start the simulation with your chosen scenario. You will interact with the AI, make choices, and receive feedback.">
          <span>
            <button onClick={startSimulation} disabled={loading || !scenarioType.trim()} style={{ padding: "8px 18px", borderRadius: 6, background: "#3949ab", color: "#fff", border: 0, cursor: "pointer" }}>
              {loading ? "Loading..." : "Start Simulation"}
            </button>
          </span>
        </Tooltip>
      </div>
    );
  }

  if (loading || !current) return <div>Loading simulation...</div>;
  if (!current.choices || current.choices.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <b>Simulation complete!</b>
        <button onClick={handleRestart} style={{ marginLeft: 16, padding: "6px 16px", borderRadius: 6, background: "#1a237e", color: "#fff", border: 0 }}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <b>Scenario Simulator</b>
      {/* Conversation History */}
      {history.length > 0 && (
        <div style={{ margin: "16px 0", background: "#f0f4ff", borderRadius: 8, padding: 12 }}>
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
              cursor: showFeedback ? "not-allowed" : "pointer"
            }}
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
        <button onClick={handleNext} style={{ marginTop: 8, padding: "6px 16px", borderRadius: 6, background: "#1a237e", color: "#fff", border: 0 }}>
          Next
        </button>
      )}
      <button onClick={handleRestart} style={{ marginLeft: 16, padding: "6px 16px", borderRadius: 6, background: "#c62828", color: "#fff", border: 0 }}>
        Restart
      </button>
    </div>
  );
}

export default Simulator; 