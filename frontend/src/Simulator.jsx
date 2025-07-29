// Scenario Simulator component skeleton
import React, { useState } from "react";
import { askStream } from "./api";
import StreamingProgress from "./StreamingProgress";
import StreamingText from "./StreamingText";
import { useStreaming, STATUS_MESSAGES } from "./hooks/useStreaming";
import { useTheme } from "./ThemeContext";

function Simulator() {
  const [scenarioType, setScenarioType] = useState("");
  const { colors } = useTheme();
  
  // Use streaming hook for simulation
  const simulationStreaming = useStreaming('Ready to create simulation');

  const scenarioTypes = [
    { key: 'customer-service', label: 'Customer Service', icon: '👥', description: 'Handle difficult customers and complaints' },
    { key: 'team-leadership', label: 'Team Leadership', icon: '👑', description: 'Lead team meetings and manage conflicts' },
    { key: 'sales-negotiation', label: 'Sales & Negotiation', icon: '💼', description: 'Close deals and negotiate contracts' },
    { key: 'project-management', label: 'Project Management', icon: '📋', description: 'Manage deadlines and team coordination' },
    { key: 'conflict-resolution', label: 'Conflict Resolution', icon: '🤝', description: 'Resolve workplace conflicts and disputes' },
    { key: 'presentation', label: 'Presentation Skills', icon: '🎤', description: 'Deliver effective presentations and pitches' }
  ];

  const handleStartSimulation = async (type) => {
    setScenarioType(type.key);
    
    simulationStreaming.startStreaming(
      `Create an interactive scenario-based training simulation for: ${type.label}
      
      Include:
      1. A realistic workplace scenario
      2. Multiple choice responses for the user
      3. Consequences for each choice
      4. Learning points and feedback
      5. Progressive difficulty levels
      
      Make it engaging and educational.`,
      {
        statusMessages: STATUS_MESSAGES.SIMULATION,
        onComplete: () => {
          // Could save simulation progress
          console.log('Simulation created');
        }
      }
    );
  };

  const handleClear = () => {
    setScenarioType("");
    simulationStreaming.clearStreaming();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', color: colors.text }}>
      <h2 style={{ marginBottom: 16, color: colors.text }}>🎮 Scenario Simulator</h2>
      
      <p style={{ marginBottom: 20, color: colors.textSecondary }}>
        Practice real-world workplace scenarios through interactive simulations. Choose a scenario type to begin.
      </p>

      {/* Scenario Type Selection */}
      {!scenarioType && !simulationStreaming.content && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {scenarioTypes.map((type) => (
              <div
                key={type.key}
                onClick={() => handleStartSimulation(type)}
                style={{
                  padding: 20,
                  background: colors.cardBackground,
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = colors.primary}
                onMouseLeave={(e) => e.target.style.borderColor = colors.border}
              >
                <div style={{ fontSize: '2.5em', marginBottom: 12 }}>
                  {type.icon}
                </div>
                <h3 style={{ marginBottom: 8, color: colors.text }}>
                  {type.label}
                </h3>
                <p style={{ 
                  color: colors.textSecondary, 
                  fontSize: '0.9em',
                  lineHeight: 1.4,
                  marginBottom: 12
                }}>
                  {type.description}
                </p>
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: colors.primary,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Start Simulation
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulation Session */}
      {scenarioType && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            padding: 12,
            background: colors.primaryLight,
            borderRadius: 8
          }}>
            <span style={{ fontSize: '1.5em' }}>
              {scenarioTypes.find(t => t.key === scenarioType)?.icon}
            </span>
            <div>
              <h3 style={{ margin: 0, color: colors.text }}>
                {scenarioTypes.find(t => t.key === scenarioType)?.label} Simulation
              </h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: colors.textSecondary }}>
                Interactive Training Scenario
              </p>
            </div>
          </div>

          {/* Simulation Progress */}
          {simulationStreaming.loading && (
            <StreamingProgress 
              loading={simulationStreaming.loading}
              status={simulationStreaming.status}
              progress={simulationStreaming.progress}
              color="success"
            />
          )}

          {/* Simulation Content */}
          <StreamingText 
            content={simulationStreaming.content}
            loading={simulationStreaming.loading}
            placeholder="Creating your interactive simulation..."
            style={{ minHeight: '300px' }}
          />

          {/* Action Buttons */}
          {simulationStreaming.isComplete && (
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
                🎮 Start Simulation
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
                📋 Save Progress
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                🔄 New Scenario
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {simulationStreaming.error && (
        <div style={{ 
          padding: 16, 
          background: '#ffebee', 
          color: '#c62828',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <strong>Error:</strong> {simulationStreaming.error}
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

export default Simulator; 