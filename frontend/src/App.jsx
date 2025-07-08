// React app skeleton for AI Workplace Learning
import React from "react";
import Concepts from "./Concepts";
import MicroLesson from "./MicroLesson";
import Recommendation from "./Recommendation";
import Simulator from "./Simulator";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f6fa", minHeight: "100vh", padding: 0 }}>
      <header style={{ background: "#2236a8", color: "#fff", padding: "2rem 0", textAlign: "center" }}>
        <h1>AI Workplace Learning Chat UI</h1>
      </header>
      <div style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
        <Dashboard />
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
      </div>
    </div>
  );
}

export default App; 