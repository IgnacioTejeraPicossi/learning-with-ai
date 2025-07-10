import React, { useEffect, useState } from "react";

function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/lessons")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch lessons");
        return res.json();
      })
      .then(data => {
        setLessons(data.lessons);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading saved lessons...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{marginTop: '2rem'}}>
      <h2>Saved Micro-lessons</h2>
      {lessons.length === 0 ? (
        <div>No lessons saved yet.</div>
      ) : (
        <ul style={{listStyle: 'none', padding: 0}}>
          {lessons.map(lesson => (
            <li key={lesson._id} style={{marginBottom: '1.5rem', background: '#f6fafd', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px #eee'}}>
              <div><strong>Topic:</strong> {lesson.topic}</div>
              <pre style={{whiteSpace: "pre-wrap", background: '#eef6fa', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem'}}>{lesson.lesson}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LessonList; 