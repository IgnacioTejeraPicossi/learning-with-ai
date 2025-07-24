import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

function FeatureRoadmap() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/admin/unknown-intents");
        const data = await res.json();
        setFeatures(data.ideas || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch feature roadmap.");
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  return (
    <div style={{ color: colors.text, padding: 24 }}>
      <h2 style={{ color: colors.text }}>Feature Roadmap</h2>
      <p style={{ color: colors.textSecondary, marginBottom: 24 }}>
        This panel shows user-submitted ideas and potential future features. Status is currently set to "Idea" for all entries.
      </p>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: colors.primaryLight }}>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Feature Name</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Status</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Summary</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {features.map((idea, idx) => (
              <tr key={idea._id || idx} style={{ background: idx % 2 === 0 ? colors.cardBackground : "#fff" }}>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.new_feature || "(No feature name)"}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>Idea</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.intent || idea.user_input}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.created_at ? new Date(idea.created_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FeatureRoadmap; 