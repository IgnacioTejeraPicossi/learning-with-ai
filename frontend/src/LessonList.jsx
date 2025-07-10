import React, { useEffect, useState } from "react";

function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [editContent, setEditContent] = useState({});

  useEffect(() => {
    fetchLessons();
  }, []);

  function fetchLessons() {
    setLoading(true);
    fetch("http://localhost:8000/lessons")
      .then(res => res.json())
      .then(data => {
        setLessons(data.lessons);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this lesson?")) return;
    fetch(`http://localhost:8000/lessons/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        fetchLessons();
      })
      .catch(err => alert(err.message));
  }

  function handleEdit(id, topic, lesson) {
    setEditing({ ...editing, [id]: true });
    setEditContent({ ...editContent, [id]: { topic, lesson } });
  }

  function handleEditChange(id, field, value) {
    setEditContent({
      ...editContent,
      [id]: { ...editContent[id], [field]: value }
    });
  }

  function handleEditSave(id) {
    const { topic, lesson } = editContent[id];
    fetch(`http://localhost:8000/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, lesson })
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        setEditing({ ...editing, [id]: false });
        fetchLessons();
      })
      .catch(err => alert(err.message));
  }

  function handleExpandToggle(id) {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.topic.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div>Loading saved lessons...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Saved Micro-lessons</h2>
      <input
        type="text"
        placeholder="Filter by topic..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: 16, padding: 4, width: "60%" }}
      />
      {filteredLessons.length === 0 ? (
        <div>No lessons found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredLessons.map(lesson => (
            <li
              key={lesson._id}
              style={{
                marginBottom: "1.5rem",
                background: "#f6fafd",
                borderRadius: "8px",
                padding: "1rem",
                boxShadow: "0 1px 4px #eee"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong>Topic:</strong>
                {editing[lesson._id] ? (
                  <input
                    value={editContent[lesson._id]?.topic || ""}
                    onChange={e =>
                      handleEditChange(lesson._id, "topic", e.target.value)
                    }
                    style={{ flex: 1 }}
                  />
                ) : (
                  <span>{lesson.topic}</span>
                )}
                <button onClick={() => handleExpandToggle(lesson._id)}>
                  {expanded[lesson._id] ? "Compress" : "Expand"}
                </button>
                <button onClick={() => handleDelete(lesson._id)}>Delete</button>
                {editing[lesson._id] ? (
                  <>
                    <button
                      onClick={() => handleEditSave(lesson._id)}
                      style={{ color: "green" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditing({ ...editing, [lesson._id]: false })
                      }
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      handleEdit(
                        lesson._id,
                        lesson.topic,
                        lesson.lesson
                      )
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
              {expanded[lesson._id] && (
                <div>
                  {editing[lesson._id] ? (
                    <textarea
                      value={editContent[lesson._id]?.lesson || ""}
                      onChange={e =>
                        handleEditChange(lesson._id, "lesson", e.target.value)
                      }
                      rows={8}
                      style={{
                        width: "100%",
                        marginTop: 8,
                        fontFamily: "monospace"
                      }}
                    />
                  ) : (
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        background: "#eef6fa",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        marginTop: "0.5rem"
                      }}
                    >
                      {lesson.lesson}
                    </pre>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LessonList; 