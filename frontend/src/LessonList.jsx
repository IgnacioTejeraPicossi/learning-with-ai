import React, { useEffect, useState } from "react";
import { fetchLessons, deleteLesson, updateLesson } from "./api";

function LessonList({ user }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [editContent, setEditContent] = useState({});

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await fetchLessons();
      setLessons(data.lessons || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadLessons();
    }
  }, [user]);

  const handleExpandToggle = id => setExpanded({ ...expanded, [id]: !expanded[id] });
  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(id);
      await loadLessons();
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleEdit = (id, topic, lesson) => {
    setEditing({ ...editing, [id]: true });
    setEditContent({ ...editContent, [id]: { topic, lesson } });
  };
  
  const handleEditChange = (id, field, value) => {
    setEditContent({
      ...editContent,
      [id]: { ...editContent[id], [field]: value }
    });
  };
  
  const handleEditSave = async (id) => {
    const { topic, lesson } = editContent[id];
    try {
      await updateLesson(id, { topic, lesson });
      setEditing({ ...editing, [id]: false });
      await loadLessons();
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleClear = () => setFilter("");

  const filteredLessons = lessons.filter(lesson =>
    lesson.topic.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div>Loading saved lessons...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <sl-card style={{ margin: "32px 0", padding: "24px", maxWidth: 800 }}>
      <h2 style={{ marginTop: 0 }}>Saved Micro-lessons</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filter by topic..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <sl-button variant="default" onClick={handleClear}>Clear</sl-button>
      </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
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
                <sl-button size="small" variant="default" onClick={() => handleExpandToggle(lesson._id)}>
                  {expanded[lesson._id] ? "Compress" : "Expand"}
                </sl-button>
                <sl-button size="small" variant="danger" onClick={() => handleDelete(lesson._id)}>
                  Delete
                </sl-button>
                {editing[lesson._id] ? (
                  <>
                    <sl-button size="small" variant="primary" onClick={() => handleEditSave(lesson._id)}>
                      Save
                    </sl-button>
                    <sl-button size="small" variant="default" onClick={() => setEditing({ ...editing, [lesson._id]: false })}>
                      Cancel
                    </sl-button>
                  </>
                ) : (
                  <sl-button size="small" variant="primary" onClick={() => handleEdit(lesson._id, lesson.topic, lesson.lesson)}>
                    Edit
                  </sl-button>
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
    </sl-card>
  );
}

export default LessonList; 