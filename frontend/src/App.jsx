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
import VideoLesson from "./VideoLesson";

function AppContent() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();
  const [activeModule, setActiveModule] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [isAIFullScreen, setIsAIFullScreen] = useState(false);

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
    setIsAIFullScreen(false); // Exit full-screen mode when a module is selected
  };

  const handleAIFullScreen = () => {
    setIsAIFullScreen(true);
    setActiveModule(null);
  };

  const handleBackToApp = () => {
    setIsAIFullScreen(false);
    setActiveModule(null);
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
      {!isAIFullScreen && <Sidebar selected={section} onSelect={(key) => { setSection(key); setActiveModule(null); }} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <header style={{ 
          background: colors.primary, 
          color: "#fff", 
          padding: "1rem 2rem", 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ margin: 0 }}>{isAIFullScreen ? "🤖 Ask AI About Workplace Learning" : "Workplace Learning With AI"}</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search Button */}
            {!isAIFullScreen && (
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
            )}
            {/* Ask AI Button */}
            <button
              onClick={handleAIFullScreen}
              style={{
                background: isAIFullScreen ? "rgba(255,255,255,0.2)" : "transparent",
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
              title="Ask AI About Workplace Learning"
            >
              🤖
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
        {isAIFullScreen ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 80px)",
            padding: "2rem"
          }}>
            <div style={{
              maxWidth: 600,
              width: "100%",
              textAlign: "center"
            }}>
              <h2 style={{ marginBottom: "2rem", fontSize: "2rem", color: colors.text }}>
                🤖 Ask AI About Workplace Learning
              </h2>
              <p style={{ marginBottom: "2rem", fontSize: "1rem", color: colors.text, opacity: 0.8 }}>
                Interface-less UX / Zero-UI mode
              </p>
              <CommandBar onRoute={handleRoute} inputPlaceholder="Ask AI about workplace learning..." />
              <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                <div style={{ padding: "0.5rem 1rem", background: colors.primaryLight, borderRadius: "20px", fontSize: "0.9rem", color: colors.primary }}>
                  💡 "Show me a video lesson on Agile"
                </div>
                <div style={{ padding: "0.5rem 1rem", background: colors.primaryLight, borderRadius: "20px", fontSize: "0.9rem", color: colors.primary }}>
                  💡 "Give me a micro-lesson on leadership"
                </div>
                <div style={{ padding: "0.5rem 1rem", background: colors.primaryLight, borderRadius: "20px", fontSize: "0.9rem", color: colors.primary }}>
                  💡 "What should I learn next?"
                </div>
              </div>
              <button
                onClick={handleBackToApp}
                style={{
                  marginTop: "2rem",
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: `1px solid ${colors.primary}`,
                  color: colors.primary,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                ← Back to App
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            maxWidth: 900, 
            margin: "2rem auto", 
            background: colors.cardBackground, 
            borderRadius: 12, 
            boxShadow: colors.shadow, 
            padding: 32 
          }}>
            <Auth user={user} setUser={setUser} />
            {/* Render the routed module if set, otherwise fall back to section navigation */}
            {activeModule === 'concepts' && <Concepts query={userQuery} />}
            {activeModule === 'microlesson' && <MicroLesson query={userQuery} />}
            {activeModule === 'simulation' && <Simulator query={userQuery} />}
            {activeModule === 'recommendation' && <Recommendation query={userQuery} />}
            {activeModule === 'coach' && <CareerCoach query={userQuery} />}
            {activeModule === 'forecast' && <SkillsForecast query={userQuery} />}
            {activeModule === 'certification' && <Certifications query={userQuery} />}
            {activeModule === 'videolesson' && <VideoLesson query={userQuery} />}
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
            {!activeModule && section === "video-lessons" && <VideoLesson />}
          </div>
        )}
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