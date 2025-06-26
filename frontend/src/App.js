import React, { useState } from "react";
import { fetchConcepts } from "./api";
import Simulator from "./Simulator";
import './App.css';
// import logo from './logo.svg'; // Uncomment if you want the logo

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
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
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
