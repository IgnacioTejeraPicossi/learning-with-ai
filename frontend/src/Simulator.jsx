// Scenario Simulator component skeleton
import React, { useState } from "react";

const scenario = [
  {
    speaker: "Customer",
    text: "I'm really upset. My service was not delivered on time!",
    choices: [
      { text: "I'm sorry for the delay. Let me check what happened.", feedback: "Good empathy and action!" },
      { text: "That's not my problem.", feedback: "This response is not professional." },
      { text: "Can you wait a bit longer?", feedback: "Try to show more understanding." }
    ]
  },
  {
    speaker: "Customer",
    text: "I need this resolved today. Can you guarantee that?",
    choices: [
      { text: "I'll do my best to resolve it today and keep you updated.", feedback: "Great commitment!" },
      { text: "No, I can't promise anything.", feedback: "Try to be more solution-oriented." }
    ]
  }
];

function Simulator() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const current = scenario[step];

  const handleChoice = (idx) => {
    setSelected(idx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setStep(step + 1);
    setSelected(null);
    setShowFeedback(false);
  };

  if (step >= scenario.length) {
    return <div><b>Simulation complete!</b></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <b>{current.speaker}:</b> {current.text}
      </div>
      {current.choices.map((choice, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <button
            onClick={() => handleChoice(idx)}
            disabled={showFeedback}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #3949ab",
              background: selected === idx ? "#3949ab" : "#fff",
              color: selected === idx ? "#fff" : "#3949ab",
              cursor: showFeedback ? "not-allowed" : "pointer"
            }}
          >
            {choice.text}
          </button>
        </div>
      ))}
      {showFeedback && (
        <div style={{ marginTop: 10, marginBottom: 10, color: "#00897b" }}>
          <b>Feedback:</b> {current.choices[selected].feedback}
        </div>
      )}
      {showFeedback && (
        <button onClick={handleNext} style={{ marginTop: 8, padding: "6px 16px", borderRadius: 6, background: "#1a237e", color: "#fff", border: 0 }}>
          Next
        </button>
      )}
    </div>
  );
}

export default Simulator; 