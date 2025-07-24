import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

function IdeaLog() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/admin/unknown-intents");
        const data = await res.json();
        setIdeas(data.ideas || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch idea log.");
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div style={{ color: colors.text, padding: 24 }}>
      <h2 style={{ color: colors.text }}>Idea Log (Unknown Requests)</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: colors.primaryLight }}>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>User Input</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Intent</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Module Match</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>New Feature</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Confidence</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Follow-up Question</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea, idx) => (
              <tr key={idea._id || idx} style={{ background: idx % 2 === 0 ? colors.cardBackground : "#fff" }}>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.user_input}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.intent}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.module_match}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.new_feature}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.confidence}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.follow_up_question}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.created_at ? new Date(idea.created_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IdeaLog; 