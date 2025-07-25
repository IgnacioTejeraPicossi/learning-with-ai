import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { fetchLessons } from "./api";
import ProgressCard from "./ProgressCard";
import LearningTrendsChart from "./LearningTrendsChart";
import TopicBreakdownChart from "./TopicBreakdownChart";
import { useTheme } from "./ThemeContext";

const PROGRESS_KEY_PREFIX = "ai_learning_progress_";

function getProgressKey(userId) {
  return `${PROGRESS_KEY_PREFIX}${userId}`;
}

function getInitialProgress(userId) {
  if (!userId) return getDefaultProgress();
  
  const stored = localStorage.getItem(getProgressKey(userId));
  if (stored) return JSON.parse(stored);
  return getDefaultProgress();
}

function getDefaultProgress() {
  return {
    lessonsCompleted: 0,
    simulationsCompleted: 0,
    simulationScore: 0,
    lastActivity: null
  };
}

// Utility function for formatting dates - will be used for:
// - Lesson history timestamps
// - Activity timeline display  
// - Team member join dates
// - Career coach session timestamps
// - Skills forecast creation dates
// eslint-disable-next-line no-unused-vars
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function getRecommendation(progress) {
  if (progress.lessonsCompleted === 0) return "Try your first micro-lesson!";
  if (progress.simulationsCompleted === 0) return "Try your first scenario simulation!";
  if (progress.simulationScore < progress.simulationsCompleted) return "Aim for more 'good' responses in simulations!";
  return "Great job! Keep learning or try a new scenario.";
}

// Helper to get ISO week string (YYYY-Www)
function getISOWeek(dateStr) {
  const date = new Date(dateStr);
  const year = date.getUTCFullYear();
  // Get week number
  const firstJan = new Date(Date.UTC(year, 0, 1));
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + firstJan.getUTCDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function Dashboard({ user, onSectionSelect }) {
  const [progress, setProgress] = useState(getDefaultProgress());
  const [loading, setLoading] = useState(true);
  const [lessonTrends, setLessonTrends] = useState([]);
  const [topicBreakdown, setTopicBreakdown] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    if (!user) {
      setProgress(getDefaultProgress());
      setLessonTrends([]);
      setTopicBreakdown([]);
      setLoading(false);
      return;
    }

    // Load user-specific progress
    const userProgress = getInitialProgress(user.uid);
    setProgress(userProgress);

    // Fetch actual lessons count from backend
    const fetchUserData = async () => {
      try {
        const lessonsData = await fetchLessons();
        const lessons = lessonsData.lessons || lessonsData || [];
        const actualLessonsCount = lessons.length;
        
        // Update progress with real data
        const updatedProgress = {
          ...userProgress,
          lessonsCompleted: actualLessonsCount,
          lastActivity: userProgress.lastActivity || (lessons[0]?.created_at || new Date().toISOString())
        };
        setProgress(updatedProgress);
        localStorage.setItem(getProgressKey(user.uid), JSON.stringify(updatedProgress));

        // Group lessons by week for line chart
        const weekMap = {};
        lessons.forEach(lesson => {
          if (lesson.created_at) {
            const week = getISOWeek(lesson.created_at);
            weekMap[week] = (weekMap[week] || 0) + 1;
          }
        });
        // Convert to array sorted by week
        const sortedWeeks = Object.keys(weekMap).sort();
        const trends = sortedWeeks.map(week => ({ week, lessons: weekMap[week] }));
        setLessonTrends(trends);

        // Group lessons by topic for pie chart
        const topicMap = {};
        lessons.forEach(lesson => {
          if (lesson.topic) {
            topicMap[lesson.topic] = (topicMap[lesson.topic] || 0) + 1;
          }
        });
        // Convert to array for pie chart
        const breakdown = Object.keys(topicMap).map(topic => ({
          name: topic,
          value: topicMap[topic]
        }));
        setTopicBreakdown(breakdown);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setProgress(userProgress);
        setLessonTrends([]);
        setTopicBreakdown([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        background: colors.primaryLight,
        borderRadius: 10,
        padding: 24,
        marginBottom: 32,
        boxShadow: colors.shadow,
        color: colors.text
      }}>
        <h2 style={{ marginTop: 0, color: colors.text }}>Your Progress</h2>
        <div>Loading your progress...</div>
      </div>
    );
  }

  const phaseLinks = [
    { phase: '1', label: 'Unknown Intent Logger', section: 'idea-log', main: 'Logs and classifies user ideas', feasibility: 'High', status: 'Live', color: '🟢' },
    { phase: '2', label: 'Clarifying Q&A', section: null, main: 'Ask follow-ups before discard', feasibility: 'High', status: 'Live', color: '🟡' },
    { phase: '3', label: 'Evolution Panel', section: 'feature-roadmap', main: 'Suggest future features, upvotes, notifications', feasibility: 'High', status: 'Live', color: '🟠' },
    { phase: '4', label: 'Cursor-Driven Scaffolds', section: 'feature-roadmap', main: 'AI codegen, scaffold history, admin approval', feasibility: 'High', status: 'Live', color: '🔵' },
    { phase: '5', label: 'Real-Time Code Integration', section: null, main: 'Update system instantly', feasibility: 'Low (R&D)', status: 'Planned', color: '🔴' },
  ];

  return (
    <div>
      <div style={{
        background: colors.primaryLight,
        borderRadius: 10,
        padding: 24,
        marginBottom: 32,
        boxShadow: colors.shadow,
        color: colors.text
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20, color: colors.text }}>Your Progress</h2>
        
        <div style={{ 
          display: "flex", 
          gap: 16, 
          flexWrap: "wrap", 
          marginBottom: 20 
        }}>
          <ProgressCard
            title="Lessons Completed"
            value={progress.lessonsCompleted}
            total={10}
            icon="📚"
            color="#4CAF50"
            backgroundColor="#e8f5e8"
          />
          
          <ProgressCard
            title="Simulations Completed"
            value={progress.simulationsCompleted}
            total={5}
            icon="▶️"
            color="#2196F3"
            backgroundColor="#e3f2fd"
          />
          
          <ProgressCard
            title="Simulation Score"
            value={progress.simulationScore}
            total={progress.simulationsCompleted || 1}
            icon="🎯"
            color="#FF9800"
            backgroundColor="#fff3e0"
            showProgress={progress.simulationsCompleted > 0}
          />
          
          <ProgressCard
            title="Learning Streak"
            value={progress.lastActivity ? 1 : 0}
            total={1}
            icon="🔥"
            color="#F44336"
            backgroundColor="#ffebee"
            showProgress={false}
          />
        </div>
        
        <div style={{ 
          fontWeight: 500, 
          color: colors.primary,
          background: colors.cardBackground,
          padding: "12px 16px",
          borderRadius: 8,
          border: `1px solid ${colors.border}`
        }}>
          💡 <strong>Recommended next step:</strong> {getRecommendation(progress)}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <LearningTrendsChart data={lessonTrends} />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <TopicBreakdownChart data={topicBreakdown} />
        </div>
      </div>

      <div style={{ marginTop: 32, background: colors.cardBackground, borderRadius: 12, boxShadow: colors.shadow, padding: 24 }}>
        <h3 style={{ marginTop: 0, color: colors.text }}>Summary Table</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr style={{ background: colors.primaryLight }}>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Phase</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Title</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Main Feature</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Feasibility</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {phaseLinks.map((p, idx) => (
              <tr key={p.phase} style={{ background: idx % 2 === 0 ? colors.cardBackground : '#fff' }}>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}><span style={{ fontSize: 22 }}>{p.color}</span></td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  {p.section ? (
                    <button
                      onClick={() => onSectionSelect && onSectionSelect(p.section)}
                      style={{ background: 'none', border: 'none', color: colors.primary, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {p.label}
                    </button>
                  ) : (
                    <span style={{ color: colors.textSecondary }}>{p.label}</span>
                  )}
                </td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{p.main}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  <span style={{ color: p.feasibility === 'High' ? '#2ecc40' : p.feasibility.includes('Medium') ? '#f4b400' : '#e74c3c', fontWeight: 600 }}>{p.feasibility}</span>
                </td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  {p.status === 'Live' && <span style={{ color: '#2ecc40', fontWeight: 600 }}>Live</span>}
                  {p.status === 'Beta' && <span style={{ color: '#f4b400', fontWeight: 600 }}>Beta</span>}
                  {p.status === 'Planned' && <span style={{ color: '#888', fontWeight: 600 }}>Planned</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Phase 5 Preview Section */}
        <div style={{ marginTop: 32, background: colors.cardBackground, borderRadius: 12, boxShadow: colors.shadow, padding: 24 }}>
          <h3 style={{ marginTop: 0, color: colors.text }}>
            🔮 Phase 5 Preview: Real-Time Dynamic Feature Activation
          </h3>
          <p style={{ color: colors.textSecondary, marginBottom: 20 }}>
            The future of adaptive, self-evolving applications. Watch as user ideas become live features in real-time.
          </p>
          
          {/* Technical Architecture */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: colors.text, marginBottom: 12 }}>🏗️ Technical Architecture</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🧠 Cursor AI + Scaffolding</strong><br/>
                Generate backend/frontend/test/docs code
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🐛 Bugbot Integration</strong><br/>
                Catch runtime and build-time errors in AI code
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🔁 Hot Reloading</strong><br/>
                Inject new code without full restart
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🧪 Sandbox Execution</strong><br/>
                Secure VMs/containers for testing generated code
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🧯 Rollback Safety</strong><br/>
                Git snapshots or state backups before patching
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
                <strong>🔗 Real-Time PR Automation</strong><br/>
                Auto-create branches, PRs, and notify admins
              </div>
            </div>
          </div>
          
          {/* Mock Demo */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: colors.text, marginBottom: 12 }}>🎬 Live Demo Preview</h4>
            <div style={{ background: '#2d3748', color: '#e2e8f0', padding: 16, borderRadius: 8, fontFamily: 'monospace', fontSize: 14 }}>
              <div style={{ color: '#68d391' }}>$ User Request: "Add a dark mode toggle"</div>
              <div style={{ color: '#fbb6ce' }}>→ AI Classification: UI Enhancement (High Confidence)</div>
              <div style={{ color: '#90cdf4' }}>→ Cursor AI: Generating DarkModeToggle.jsx...</div>
              <div style={{ color: '#f6ad55' }}>→ Bugbot: Code review passed ✓</div>
              <div style={{ color: '#68d391' }}>→ Hot Reload: Injecting component...</div>
              <div style={{ color: '#68d391' }}>✅ Feature activated in 2.3 seconds!</div>
            </div>
          </div>
          
          {/* Business Impact */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: colors.text, marginBottom: 12 }}>📊 Business Impact</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>⏱️</div>
                <strong>Speed</strong><br/>
                <small>Hours, not weeks</small>
              </div>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🎯</div>
                <strong>Personalization</strong><br/>
                <small>User-driven evolution</small>
              </div>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🔄</div>
                <strong>Agility</strong><br/>
                <small>Dynamic adaptation</small>
              </div>
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🚀</div>
                <strong>Competitive Edge</strong><br/>
                <small>AI-powered innovation</small>
              </div>
            </div>
          </div>
          
          {/* Implementation Roadmap */}
          <div>
            <h4 style={{ color: colors.text, marginBottom: 12 }}>🛠️ Implementation Roadmap</h4>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h5 style={{ color: colors.primary, marginBottom: 8 }}>Short-Term (Preview)</h5>
                <ul style={{ color: colors.textSecondary, fontSize: 14, paddingLeft: 20 }}>
                  <li>Phase 5 Preview panel in UI</li>
                  <li>Live scaffold testing (dev-only)</li>
                  <li>🧪 Experimental feature tags</li>
                </ul>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h5 style={{ color: colors.primary, marginBottom: 8 }}>Medium-Term</h5>
                <ul style={{ color: colors.textSecondary, fontSize: 14, paddingLeft: 20 }}>
                  <li>Git snapshot rollback</li>
                  <li>Sandbox module trials</li>
                  <li>Enhanced security</li>
                </ul>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h5 style={{ color: colors.primary, marginBottom: 8 }}>Long-Term</h5>
                <ul style={{ color: colors.textSecondary, fontSize: 14, paddingLeft: 20 }}>
                  <li>Full PR generation</li>
                  <li>Auto-validation pipelines</li>
                  <li>Production deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function updateProgress(updates) {
  const user = auth.currentUser;
  if (!user) return;

  const current = getInitialProgress(user.uid);
  const merged = { ...current, ...updates };
  merged.lastActivity = new Date().toISOString();
  
  localStorage.setItem(getProgressKey(user.uid), JSON.stringify(merged));
  // Trigger storage event for other tabs/components
  window.dispatchEvent(new Event("storage"));
}

export default Dashboard; 