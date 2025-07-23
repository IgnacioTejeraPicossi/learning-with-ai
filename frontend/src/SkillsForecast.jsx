import React, { useState } from "react";
import { askStream } from "./api";
import { useTheme } from "./ThemeContext";

function SkillsForecast() {
  const [input, setInput] = useState("");
  const [forecast, setForecast] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleGetForecast = async () => {
    setLoading(true);
    setForecast("");
    try {
      await askStream({ prompt: `Given my current skills and career goals: ${input}, predict the next best skills to develop and provide a personalized forecast.` }, (output) => setForecast(output));
    } catch (error) {
      console.error("Failed to get skills forecast:", error);
      setForecast("Error getting skills forecast.");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setInput("");
    setForecast("");
  };

  return (
    <div style={{ color: colors.text }}>
      <h2 style={{ color: colors.text }}>Skills Forecast</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Describe your current skills and career goals..."
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
        onClick={handleGetForecast}
        disabled={loading || !input}
        title="Generate AI-powered skills forecast based on your current skills and career goals. Get personalized recommendations for skills to develop next and career advancement strategies."
        style={{
          background: colors.buttonPrimary,
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !input ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        {loading ? "Forecasting..." : "Get Forecast"}
      </button>
      <button
        onClick={handleClear}
        disabled={loading && !input && !forecast}
        title="Clear the current skills input and forecast results. Start fresh with new skills assessment or career goals."
        style={{
          background: colors.cardBackground,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading && !input && !forecast ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Clear
      </button>
      {forecast && (
        <pre style={{ 
          marginTop: 16, 
          background: colors.primaryLight, 
          borderRadius: 6, 
          padding: 12, 
          whiteSpace: "pre-wrap", 
          wordBreak: "break-word",
          color: colors.text
        }}>
          {forecast}
        </pre>
      )}
    </div>
  );
}

export default SkillsForecast;
