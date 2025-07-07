import React, { useState } from "react";
import { fetchMicroLesson } from "./api";

function MicroLesson() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetMicroLesson = async () => {
    setLoading(true);
    const data = await fetchMicroLesson(topic);
    setLesson(data.lesson);
    setLoading(false);
  };

  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px #0001" }}>
      <h2 style={{ marginTop: 0 }}>Micro-lesson</h2>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Enter micro-lesson topic"
        style={{
          marginRight: 8,
          padding: 8,
          borderRadius: 6,
          border: "1px solid #bbb",
          fontSize: 15,
          minWidth: 220
        }}
        title="Enter a topic (e.g., 'agile sprint planning') to get a custom micro-lesson."
      />
      <button
        onClick={handleGetMicroLesson}
        disabled={loading || !topic}
        style={{
          background: "#388e3c",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !topic ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px #0001"
        }}
        title="Generate a micro-lesson for the entered topic."
      >
        {loading ? "Loading..." : "Get Micro-lesson"}
      </button>
      {lesson && <pre style={{ marginTop: 16, background: "#eef3fa", borderRadius: 6, padding: 12 }}>{lesson}</pre>}
    </div>
  );
}

export default MicroLesson; 