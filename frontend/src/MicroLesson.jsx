import React, { useState } from "react";
import { fetchMicroLesson } from "./api";
import ModalDialog from "./ModalDialog";

function MicroLesson() {
  const [topic, setTopic] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetMicroLesson = async () => {
    setLoading(true);
    setModalOpen(true);
    try {
      const result = await fetchMicroLesson(topic);
      setAiOutput(result.lesson || JSON.stringify(result, null, 2));
    } catch (err) {
      setAiOutput("Error fetching micro-lesson.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Micro-lesson</h2>
      <input
        type="text"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Enter micro-lesson topic"
        style={{ marginRight: 8 }}
      />
      <button
        onClick={handleGetMicroLesson}
        disabled={!topic}
        style={{
          background: "#388e3c",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: 16,
          cursor: !topic ? "not-allowed" : "pointer",
          marginRight: 8,
          boxShadow: "0 1px 4px #0001"
        }}
      >
        Get Micro-lesson
      </button>
      <ModalDialog
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="Micro-lesson"
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>{aiOutput}</pre>
        )}
      </ModalDialog>
    </div>
  );
}

export default MicroLesson; 