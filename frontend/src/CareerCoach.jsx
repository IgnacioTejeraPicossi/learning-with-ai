import React, { useState } from 'react';
import { askStream } from './api';
import StreamingProgress from './StreamingProgress';
import StreamingText from './StreamingText';
import { useStreaming, STATUS_MESSAGES } from './hooks/useStreaming';
import { useTheme } from './ThemeContext';

export default function CareerCoach() {
  const [growthArea, setGrowthArea] = useState('');
  const { colors } = useTheme();
  
  // Use streaming hook for career coaching
  const coachingStreaming = useStreaming('Ready to start coaching session');

  const growthAreas = [
    { key: 'leadership', label: 'Leadership', icon: '👑', description: 'Team management, decision-making, strategic thinking' },
    { key: 'communication', label: 'Communication', icon: '💬', description: 'Public speaking, writing, active listening' },
    { key: 'conflict', label: 'Conflict Management', icon: '🤝', description: 'Negotiation, mediation, problem-solving' }
  ];

  const handleStartCoaching = async (area) => {
    setGrowthArea(area.key);
    
    coachingStreaming.startStreaming(
      `You are an AI career coach. The user wants to focus on ${area.label.toLowerCase()} development. 
      Provide personalized coaching advice including:
      1. Assessment of current skills
      2. Specific improvement strategies
      3. Actionable next steps
      4. Recommended resources
      5. Progress tracking suggestions
      
      Make it conversational and encouraging.`,
      {
        statusMessages: STATUS_MESSAGES.CAREER_COACH,
        onComplete: () => {
          // Could save coaching session to user profile
          console.log('Coaching session completed');
        }
      }
    );
  };

  const handleClear = () => {
    setGrowthArea('');
    coachingStreaming.clearStreaming();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', color: colors.text }}>
      <h2 style={{ marginBottom: 16, color: colors.text }}>🎯 AI Career Coach</h2>
      
      {!growthArea && !coachingStreaming.content && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ marginBottom: 16, color: colors.textSecondary }}>
            Choose a growth area to receive personalized career coaching advice:
          </p>
          
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {growthAreas.map((area) => (
              <div
                key={area.key}
                onClick={() => handleStartCoaching(area)}
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
                  {area.icon}
                </div>
                <h3 style={{ marginBottom: 8, color: colors.text }}>
                  {area.label}
                </h3>
                <p style={{ 
                  color: colors.textSecondary, 
                  fontSize: '0.9em',
                  lineHeight: 1.4
                }}>
                  {area.description}
                </p>
                <button
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: colors.primary,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Start Coaching
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching Session */}
      {growthArea && (
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
              {growthAreas.find(a => a.key === growthArea)?.icon}
            </span>
            <div>
              <h3 style={{ margin: 0, color: colors.text }}>
                {growthAreas.find(a => a.key === growthArea)?.label} Development
              </h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: colors.textSecondary }}>
                AI Career Coaching Session
              </p>
            </div>
          </div>

          {/* Coaching Progress */}
          {coachingStreaming.loading && (
            <StreamingProgress 
              loading={coachingStreaming.loading}
              status={coachingStreaming.status}
              progress={coachingStreaming.progress}
              color="info"
            />
          )}

          {/* Coaching Content */}
          <StreamingText 
            content={coachingStreaming.content}
            loading={coachingStreaming.loading}
            placeholder="Starting your personalized coaching session..."
            style={{ minHeight: '200px' }}
          />

          {/* Action Buttons */}
          {coachingStreaming.isComplete && (
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
                📋 Save Session
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
                📅 Schedule Follow-up
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
                🔄 New Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {coachingStreaming.error && (
        <div style={{ 
          padding: 16, 
          background: '#ffebee', 
          color: '#c62828',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <strong>Error:</strong> {coachingStreaming.error}
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
