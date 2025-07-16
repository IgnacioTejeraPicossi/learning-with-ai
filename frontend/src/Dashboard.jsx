import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { fetchLessons } from "./api";
import ProgressCard from "./ProgressCard";

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

function Dashboard({ user }) {
  const [progress, setProgress] = useState(getDefaultProgress());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(getDefaultProgress());
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
        const actualLessonsCount = lessonsData.lessons?.length || 0;
        
        // Update progress with real data
        const updatedProgress = {
          ...userProgress,
          lessonsCompleted: actualLessonsCount,
          lastActivity: userProgress.lastActivity || new Date().toISOString()
        };
        
        setProgress(updatedProgress);
        // Save updated progress
        localStorage.setItem(getProgressKey(user.uid), JSON.stringify(updatedProgress));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setProgress(userProgress);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        background: "#e3f2fd",
        borderRadius: 10,
        padding: 24,
        marginBottom: 32,
        boxShadow: "0 1px 4px #eee"
      }}>
        <h2 style={{ marginTop: 0 }}>Your Progress</h2>
        <div>Loading your progress...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: "#e3f2fd",
        borderRadius: 10,
        padding: 24,
        marginBottom: 32,
        boxShadow: "0 1px 4px #eee"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Your Progress</h2>
        
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
          color: "#1976d2",
          background: "white",
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid #e0e0e0"
        }}>
          💡 <strong>Recommended next step:</strong> {getRecommendation(progress)}
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