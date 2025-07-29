import React, { useState } from "react";
import { askStream } from "./api";
import StreamingProgress from "./StreamingProgress";
import StreamingText from "./StreamingText";
import { useStreaming, STATUS_MESSAGES } from "./hooks/useStreaming";
import { useTheme } from "./ThemeContext";

function SkillsForecast() {
  const [input, setInput] = useState("");
  const { colors } = useTheme();
  
  // Use streaming hook for skills forecasting
  const forecastStreaming = useStreaming('Ready to analyze your skills');

  const handleGetForecast = async () => {
    if (!input.trim()) {
      alert('Please provide information about your current skills and career goals.');
      return;
    }

    forecastStreaming.startStreaming(
      `Given my current skills and career goals: ${input}, 
      predict the next best skills to develop and provide a personalized forecast.
      
      Include:
      1. Analysis of current skill gaps
      2. Emerging industry trends
      3. Recommended skill development path
      4. Timeline for skill acquisition
      5. Resources and learning methods
      
      Make it actionable and specific.`,
      {
        statusMessages: STATUS_MESSAGES.SKILLS_FORECAST,
        onComplete: () => {
          // Could save forecast to user profile
          console.log('Skills forecast completed');
        }
      }
    );
  };

  const handleClear = () => {
    setInput("");
    forecastStreaming.clearStreaming();
  };

  const sampleInputs = [
    "I'm a junior developer with 2 years of experience in JavaScript and React. I want to advance to a senior role.",
    "I'm a project manager looking to transition into product management. I have experience with Agile methodologies.",
    "I'm a marketing specialist wanting to learn data analysis and digital marketing automation."
  ];

  const handleSampleInput = (sample) => {
    setInput(sample);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', color: colors.text }}>
      <h2 style={{ marginBottom: 16, color: colors.text }}>🔮 Skills Forecasting</h2>
      
      <p style={{ marginBottom: 20, color: colors.textSecondary }}>
        Get AI-powered predictions about which skills you should develop next based on your current profile and career goals.
      </p>

      {/* Input Section */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: colors.text }}>
          Tell us about your current skills and career goals:
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your current role, skills, experience level, and career aspirations..."
          style={{ 
            width: '100%', 
            padding: 12, 
            borderRadius: 8, 
            border: `1px solid ${colors.border}`,
            background: colors.cardBackground,
            color: colors.text,
            resize: 'vertical',
            marginBottom: 12
          }}
        />
        
        {/* Sample Inputs */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8, fontSize: '0.9em', color: colors.textSecondary }}>
            💡 Try a sample input:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sampleInputs.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleInput(sample)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: '0.8em',
                  whiteSpace: 'nowrap'
                }}
              >
                Sample {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleGetForecast}
            disabled={forecastStreaming.loading || !input.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              background: colors.primary,
              color: '#fff',
              cursor: forecastStreaming.loading ? 'not-allowed' : 'pointer',
              opacity: forecastStreaming.loading ? 0.6 : 1
            }}
          >
            {forecastStreaming.loading ? '⏳ Analyzing...' : '🔮 Get Forecast'}
          </button>
          
          <button
            onClick={handleClear}
            disabled={forecastStreaming.loading}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.cardBackground,
              color: colors.text,
              cursor: forecastStreaming.loading ? 'not-allowed' : 'pointer'
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Forecasting Progress */}
      {forecastStreaming.loading && (
        <StreamingProgress 
          loading={forecastStreaming.loading}
          status={forecastStreaming.status}
          progress={forecastStreaming.progress}
          color="info"
        />
      )}

      {/* Forecast Results */}
      {forecastStreaming.content && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, color: colors.text }}>
            📊 Your Skills Forecast
          </h3>
          
          <StreamingText 
            content={forecastStreaming.content}
            loading={forecastStreaming.loading}
            placeholder="Analyzing your skills and generating forecast..."
            style={{ minHeight: '300px' }}
          />

          {/* Action Buttons */}
          {forecastStreaming.isComplete && (
            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <button
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: colors.primary,
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                📋 Save Forecast
              </button>
              <button
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                📚 Find Learning Resources
              </button>
              <button
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                📅 Schedule Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {forecastStreaming.error && (
        <div style={{ 
          padding: 16, 
          background: '#ffebee', 
          color: '#c62828',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <strong>Error:</strong> {forecastStreaming.error}
          <button
            onClick={handleClear}
            style={{
              marginLeft: 12,
              padding: '4px 8px',
              borderRadius: 4,
              border: 'none',
              background: '#c62828',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SkillsForecast;
