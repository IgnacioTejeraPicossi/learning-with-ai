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

function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const SectionComponent = sectionComponents[section] || Dashboard;

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f6fa", minHeight: "100vh", padding: 0, display: "flex" }}>
      <Sidebar selected={section} onSelect={setSection} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <header style={{ background: "#2236a8", color: "#fff", padding: "2rem 0", textAlign: "center" }}>
          <h1>AI Workplace Learning Chat UI</h1>
        </header>
        <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
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

export default App; 