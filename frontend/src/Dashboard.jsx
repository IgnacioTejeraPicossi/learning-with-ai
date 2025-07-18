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

function Dashboard({ user }) {
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

  return (
    <>
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
    </>
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