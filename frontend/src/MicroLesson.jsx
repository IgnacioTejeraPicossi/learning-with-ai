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
    <div>
      <h2>Micro-lesson</h2>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Enter micro-lesson topic"
        style={{ marginRight: 8 }}
      />
      <button onClick={handleGetMicroLesson} disabled={loading || !topic}>
        {loading ? "Loading..." : "Get Micro-lesson"}
      </button>
      {lesson && <pre style={{ marginTop: 12 }}>{lesson}</pre>}
    </div>
  );
}

export default MicroLesson; 