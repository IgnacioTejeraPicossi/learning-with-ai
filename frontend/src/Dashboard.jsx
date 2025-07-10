import React, { useEffect, useState } from "react";
import LessonList from "./LessonList";

const PROGRESS_KEY = "ai_learning_progress";

function getInitialProgress() {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) return JSON.parse(stored);
  const initial = {
    lessonsCompleted: 0,
    simulationsCompleted: 0,
    simulationScore: 0,
    lastActivity: null
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
  return initial;
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

function Dashboard() {
  const [progress, setProgress] = useState(getInitialProgress());

  useEffect(() => {
    // Listen for progress updates from other components
    const onStorage = () => setProgress(getInitialProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      <div style={{
        background: "#e3f2fd",
        borderRadius: 10,
        padding: 24,
        marginBottom: 32,
        boxShadow: "0 1px 4px #eee"
      }}>
        <h2 style={{ marginTop: 0 }}>Your Progress</h2>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 12 }}>
          <div><b>Lessons completed:</b> {progress.lessonsCompleted}</div>
          <div><b>Simulations completed:</b> {progress.simulationsCompleted}</div>
          <div><b>Simulation score:</b> {progress.simulationScore}</div>
          <div><b>Last activity:</b> {formatDate(progress.lastActivity)}</div>
        </div>
        <div style={{ fontWeight: 500, color: "#1976d2" }}>
          Recommended next step: {getRecommendation(progress)}
        </div>
      </div>
      
    </>
  );
}

export function updateProgress(updates) {
  const current = getInitialProgress();
  const merged = { ...current, ...updates };
  merged.lastActivity = new Date().toISOString();
  localStorage.setItem("ai_learning_progress", JSON.stringify(merged));
  // Trigger storage event for other tabs/components
  window.dispatchEvent(new Event("storage"));
}

export default Dashboard; 