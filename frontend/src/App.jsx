// React app skeleton for AI Workplace Learning
import React, { useEffect, useState } from 'react';
import Concepts from "./Concepts";
import MicroLesson from "./MicroLesson";
import Recommendation from "./Recommendation";
import Simulator from "./Simulator";
import Dashboard from "./Dashboard";
import WebSearch from "./WebSearch";
import LessonList from "./LessonList";
import CareerCoach from "./CareerCoach";
import SkillsForecast from "./SkillsForecast";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './Auth';
import Sidebar from './Sidebar';
import { ThemeProvider, useTheme } from './ThemeContext';

const sectionComponents = {
  dashboard: Dashboard,
  "ai-concepts": Concepts,
  "micro-lessons": MicroLesson,
  recommendation: Recommendation,
  simulations: Simulator,
  "web-search": WebSearch,
  coach: CareerCoach,
  "skills-forecast": SkillsForecast,
  "saved-lessons": LessonList,
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const { isDark, toggleTheme, colors } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const SectionComponent = sectionComponents[section] || Dashboard;

  return (
    <div style={{ 
      fontFamily: "sans-serif", 
      background: colors.background, 
      minHeight: "100vh", 
      padding: 0, 
      display: "flex",
      color: colors.text
    }}>
      <Sidebar selected={section} onSelect={setSection} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <header style={{ 
          background: colors.primary, 
          color: "#fff", 
          padding: "1rem 2rem", 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ margin: 0 }}>AI Workplace Learning Chat UI</h1>
          <button
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
              transition: "all 0.2s"
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </header>
        <div style={{ 
          maxWidth: 900, 
          margin: "2rem auto", 
          background: colors.cardBackground, 
          borderRadius: 12, 
          boxShadow: colors.shadow, 
          padding: 32 
        }}>
          <Auth user={user} setUser={setUser} />
          {/* Render the selected section only */}
          {section === "dashboard" && <Dashboard user={user} />}
          {section === "ai-concepts" && <Concepts />}
          {section === "micro-lessons" && <MicroLesson />}
          {section === "recommendation" && <Recommendation />}
          {section === "simulations" && <Simulator />}
          {section === "web-search" && <WebSearch />}
          {section === "coach" && <CareerCoach />}
          {section === "skills-forecast" && <SkillsForecast />}
          {section === "saved-lessons" && <LessonList user={user} />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 