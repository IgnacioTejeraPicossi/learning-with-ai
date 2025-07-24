import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

// Simulate admin check (replace with real auth in production)
const isAdmin = true;

function FeatureRoadmap() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState("");
  const [upvoting, setUpvoting] = useState("");
  const [statusUpdating, setStatusUpdating] = useState("");
  const { colors } = useTheme();

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

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleUpvote = async (id) => {
    setUpvoting(id);
    await fetch(`http://localhost:8000/admin/unknown-intents/${id}/upvote`, { method: "POST" });
    await fetchFeatures();
    setUpvoting("");
  };

  const handleSubscribe = async (id) => {
    setSubscribing(id);
    const email = prompt("Enter your email to be notified about this feature:");
    if (email) {
      await fetch(`http://localhost:8000/admin/unknown-intents/${id}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      alert("Subscribed!");
    }
    setSubscribing("");
  };

  const handleStatusChange = async (id, status) => {
    setStatusUpdating(id);
    await fetch(`http://localhost:8000/admin/unknown-intents/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await fetchFeatures();
    setStatusUpdating("");
  };

  const statusOptions = ["Idea", "Planned", "In Review", "Coming Soon", "Implemented"];

  return (
    <div style={{ color: colors.text, padding: 24 }}>
      <h2 style={{ color: colors.text }}>Feature Roadmap</h2>
      <p style={{ color: colors.textSecondary, marginBottom: 24 }}>
        This panel shows user-submitted ideas and potential future features. Upvote, subscribe for notifications, or (admin) update status.
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
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Upvotes</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Notifications</th>
              <th style={{ padding: 8, border: `1px solid ${colors.border}` }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {features.map((idea, idx) => (
              <tr key={idea._id || idx} style={{ background: idx % 2 === 0 ? colors.cardBackground : "#fff" }}>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.new_feature || "(No feature name)"}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  {isAdmin ? (
                    <select
                      value={idea.status || "Idea"}
                      onChange={e => handleStatusChange(idea._id, e.target.value)}
                      disabled={statusUpdating === idea._id}
                      style={{ padding: 4, borderRadius: 4 }}
                    >
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    idea.status || "Idea"
                  )}
                </td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>{idea.classification?.intent || idea.user_input}</td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  <button
                    onClick={() => handleUpvote(idea._id)}
                    disabled={upvoting === idea._id}
                    style={{ background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontWeight: 600 }}
                    title="Upvote this feature"
                  >
                    👍 {idea.upvotes || 0}
                  </button>
                </td>
                <td style={{ padding: 8, border: `1px solid ${colors.border}` }}>
                  <button
                    onClick={() => handleSubscribe(idea._id)}
                    disabled={subscribing === idea._id}
                    style={{ background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontWeight: 600 }}
                    title="Get notified about this feature"
                  >
                    🔔 Notify Me
                  </button>
                </td>
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