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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f6fa", minHeight: "100vh", padding: 0 }}>
      <header style={{ background: "#2236a8", color: "#fff", padding: "2rem 0", textAlign: "center" }}>
        <h1>AI Workplace Learning Chat UI</h1>
      </header>
      <div style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
        <Auth user={user} setUser={setUser} />
        <Dashboard user={user} />
        <section style={{ marginBottom: 32 }}>
          <Concepts />
        </section>
        <section style={{ marginBottom: 32 }}>
          <MicroLesson />
        </section>
        <section style={{ marginBottom: 32 }}>
          <Recommendation />
        </section>
        <section>
          <Simulator />
        </section>
        <section style={{ marginBottom: 32 }}>
          <WebSearch />
        </section>
        <LessonList user={user} />
        <CareerCoach />
        <SkillsForecast />
      </div>
    </div>
  );
}

export default App; 