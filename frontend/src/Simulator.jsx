// Scenario Simulator component skeleton
import React, { useState, useEffect } from "react";
import { fetchSimulationStep } from "./api";

function Simulator() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start the simulation on first render
  useEffect(() => {
    if (history.length === 0 && !current) {
      setLoading(true);
      fetchSimulationStep([], "").then(res => {
        setCurrent(res);
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleChoice = (choice) => {
    setLoading(true);
    const newHistory = [
      ...history,
      { speaker: "Customer", text: current.customerText, user_choice: choice.text }
    ];
    fetchSimulationStep(newHistory, choice.text).then(res => {
      setCurrent(res);
      setHistory(newHistory);
      setLoading(false);
    });
  };

  if (loading || !current) return <div>Loading simulation...</div>;
  if (!current.choices || current.choices.length === 0) return <div>Simulation complete!</div>;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <b>Customer:</b> {current.customerText}
      </div>
      {current.choices.map((choice, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <button
            onClick={() => handleChoice(choice)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #3949ab",
              background: "#fff",
              color: "#3949ab",
              cursor: "pointer"
            }}
          >
            {choice.text}
          </button>
        </div>
      ))}
      {/* Show feedback after a choice is made, if you want to extend */}
    </div>
  );
}

export default Simulator; 