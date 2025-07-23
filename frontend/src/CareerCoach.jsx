import React, { useState } from "react";
import { askStream } from "./api";
import { useTheme } from "./ThemeContext";

function CareerCoach() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleAskCoach = async () => {
    setLoading(true);
    setResponse("");
    try {
      await askStream({ prompt: `You are an AI career coach. ${question}` }, (output) => setResponse(output));
    } catch (error) {
      console.error("Failed to get career advice:", error);
      setResponse("Error getting career advice.");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuestion("");
    setResponse("");
  };

  return (
    <div style={{ color: colors.text }}>
      <h2 style={{ color: colors.text }}>AI Career Coach</h2>
      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask your career coach anything..."
        style={{ 
          width: "100%",
          minHeight: 100,
          marginBottom: 16,
          padding: "12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          background: colors.cardBackground,
          color: colors.text,
          fontSize: 16,
          resize: "vertical"
        }}
      />
      <button
        onClick={handleAskCoach}
        disabled={loading || !question}
        style={{
          background: colors.buttonPrimary,
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !question ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        {loading ? "Asking..." : "Ask Coach"}
      </button>
      <button
        onClick={handleClear}
        disabled={loading && !question && !response}
        style={{
          background: colors.cardBackground,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading && !question && !response ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Clear
      </button>
      {response && (
        <pre style={{ 
          marginTop: 16, 
          background: colors.primaryLight, 
          borderRadius: 6, 
          padding: 12, 
          whiteSpace: "pre-wrap", 
          wordBreak: "break-word",
          color: colors.text
        }}>
          {response}
        </pre>
      )}
    </div>
  );
}

export default CareerCoach;
