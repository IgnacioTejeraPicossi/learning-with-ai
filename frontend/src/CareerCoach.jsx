import React, { useState } from 'react';
import { postCareerCoach } from './api';

export default function CareerCoach() {
  const [coachText, setCoachText] = useState("");
  const [loading, setLoading] = useState(false);

  const runCoach = async () => {
    setLoading(true);
    const resp = await postCareerCoach();
    setCoachText(resp.response);
    setLoading(false);
  };

  return (
    <div>
      <h3>AI Career Coach</h3>
      <button onClick={runCoach} disabled={loading}>
        {loading ? "Coaching..." : "Start Coaching"}
      </button>
      <pre style={{whiteSpace: "pre-wrap"}}>{coachText}</pre>
    </div>
  );
}
