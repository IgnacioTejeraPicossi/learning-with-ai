import React, { useState } from 'react';
import { postSkillsForecast } from './api';

export default function SkillsForecast() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState("Agile Planning, Communication Basics");
  const [keywords, setKeywords] = useState("negotiation, hybrid work, stakeholder");

  const handleForecast = async () => {
    setLoading(true);
    const input = { history, keywords };
    const resp = await postSkillsForecast(input);
    setResult(resp.forecast);
    setLoading(false);
  };

  const handleClear = () => {
    setResult("");
  };

  return (
    <sl-card style={{ margin: "32px 0", padding: "24px", maxWidth: 600 }}>
      <h2 style={{ marginTop: 0 }}>Skills Forecasting</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Learning history:
          <input
            value={history}
            onChange={e => setHistory(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          Transcript keywords:
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <sl-button variant="primary" onClick={handleForecast} disabled={loading}>
          {loading ? "Forecasting..." : "Get Forecast"}
        </sl-button>
        <sl-button variant="default" onClick={handleClear} disabled={loading}>
          Clear
        </sl-button>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{result}</pre>
    </sl-card>
  );
}
