import React, { useState } from 'react';
import { postSkillsForecast } from './api';

export default function SkillsForecast() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Optionally, make these controlled inputs for user customization
  const [history, setHistory] = useState("Agile Planning, Communication Basics");
  const [keywords, setKeywords] = useState("negotiation, hybrid work, stakeholder");

  const handleForecast = async () => {
    setLoading(true);
    const input = { history, keywords };
    const resp = await postSkillsForecast(input);
    setResult(resp.forecast);
    setLoading(false);
  };

  return (
    <div>
      <h3>Skills Forecasting</h3>
      <div>
        <label>
          Learning history:
          <input
            value={history}
            onChange={e => setHistory(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
          />
        </label>
      </div>
      <div>
        <label>
          Transcript keywords:
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
          />
        </label>
      </div>
      <button onClick={handleForecast} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Forecasting..." : "Get Forecast"}
      </button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{result}</pre>
    </div>
  );
}
