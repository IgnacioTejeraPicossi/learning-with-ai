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
import TeamDynamics from "./TeamDynamics";
import Certifications from "./Certifications";
import GlobalSearch from "./GlobalSearch";
import RunTest from "./RunTest";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './Auth';
import Sidebar from './Sidebar';
import { ThemeProvider, useTheme } from './ThemeContext';
import CommandBar from "./CommandBar";

function AppContent() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();
  const [activeModule, setActiveModule] = useState(null);
  const [userQuery, setUserQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchNavigate = (sectionId) => {
    setSection(sectionId);
  };

  const handleRoute = (module, query) => {
    setUserQuery(query);
    setActiveModule(module);
  };

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
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
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
                fontSize: 16,
                transition: "all 0.2s",
                marginRight: 8
              }}
              title="Search all sections (Ctrl+K)"
            >
              🔍
            </button>
            {/* Theme Toggle */}
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
          </div>
        </header>
        <div style={{ 
          maxWidth: 900, 
          margin: "2rem auto", 
          background: colors.cardBackground, 
          borderRadius: 12, 
          boxShadow: colors.shadow, 
          padding: 32 
        }}>
          <CommandBar onRoute={handleRoute} />
          <Auth user={user} setUser={setUser} />
          {/* Render the routed module if set, otherwise fall back to section navigation */}
          {activeModule === 'concepts' && <Concepts query={userQuery} />}
          {activeModule === 'microlesson' && <MicroLesson query={userQuery} />}
          {activeModule === 'simulation' && <Simulator query={userQuery} />}
          {activeModule === 'recommendation' && <Recommendation query={userQuery} />}
          {activeModule === 'coach' && <CareerCoach query={userQuery} />}
          {activeModule === 'forecast' && <SkillsForecast query={userQuery} />}
          {activeModule === 'certification' && <Certifications query={userQuery} />}
          {!activeModule && section === "dashboard" && <Dashboard user={user} />}
          {!activeModule && section === "ai-concepts" && <Concepts />}
          {!activeModule && section === "micro-lessons" && <MicroLesson />}
          {!activeModule && section === "recommendation" && <Recommendation />}
          {!activeModule && section === "simulations" && <Simulator />}
          {!activeModule && section === "web-search" && <WebSearch />}
          {!activeModule && section === "team-dynamics" && <TeamDynamics />}
          {!activeModule && section === "certifications" && <Certifications />}
          {!activeModule && section === "coach" && <CareerCoach />}
          {!activeModule && section === "skills-forecast" && <SkillsForecast />}
          {!activeModule && section === "saved-lessons" && <LessonList user={user} />}
          {!activeModule && section === "run-test" && <RunTest />}
        </div>
      </div>
      
      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />
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