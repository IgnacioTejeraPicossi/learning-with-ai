import React, { useState } from "react";
import { fetchConcepts } from "./api";
import Simulator from "./Simulator";
import './App.css';

function App() {
  const [concepts, setConcepts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetConcepts = async () => {
    setLoading(true);
    const data = await fetchConcepts();
    setConcepts(data.concepts);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>AI Workplace Learning Chat UI</h1>
      <button onClick={handleGetConcepts} disabled={loading}>
        {loading ? "Loading..." : "Get AI Concepts"}
      </button>
      {concepts && (
        <div style={{ marginTop: 20 }}>
          <h2>Concepts:</h2>
          <pre>{concepts}</pre>
        </div>
      )}
      <Simulator />
    </div>
  );
}

export default App;
