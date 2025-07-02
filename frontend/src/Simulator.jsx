// Scenario Simulator component skeleton
import React, { useState } from "react";
import { fetchSimulationStep } from "./api";

function Simulator() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start the simulation
  React.useEffect(() => {
    if (history.length === 0) {
      // Initial call to backend to get the first scenario step
      setLoading(true);
      fetchSimulationStep([], "").then(res => {
        setCurrent(res.next_step); // Parse as needed
        setLoading(false);
      });
    }
  }, [history]);

  const handleChoice = (choiceText) => {
    setLoading(true);
    const newHistory = [...history, { speaker: "Customer", text: current.customerText, user_choice: choiceText }];
    fetchSimulationStep(newHistory, choiceText).then(res => {
      setCurrent(res.next_step); // Parse as needed
      setHistory(newHistory);
      setLoading(false);
    });
  };

  if (loading || !current) return <div>Loading simulation...</div>;

  // Parse current to extract customerText, choices, feedback, etc.
  // This depends on how your backend formats the response.

  return (
    <div>
      {/* Render the current scenario step, choices, and feedback */}
    </div>
  );
}

export default Simulator; 