import React, { useState } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import { fetchConcepts, fetchMicroLesson, fetchSimulation, fetchRecommendation } from "./api";
import Simulator from "./Simulator";
import './App.css';
import logo from './logo.svg'; // If you have a logo

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");

  const handleFetch = async (type) => {
    setLoading(true);
    setActive(type);
    let data;
    if (type === "concepts") data = await fetchConcepts();
    if (type === "micro-lesson") data = await fetchMicroLesson();
    if (type === "simulation") data = await fetchSimulation();
    if (type === "recommendation") data = await fetchRecommendation();
    setResult(data[type.replace("-", "_")] || JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f9fa" }}>
      <Box component="header" sx={{ background: "#1a237e", color: "#fff", py: 3, mb: 4, textAlign: "center" }}>
        {/* Uncomment if you have a logo */}
        <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 10 }} />
        <Typography variant="h4" fontWeight={700} letterSpacing={1}>
          AI Workplace Learning Chat UI
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", borderRadius: 3, p: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Button variant="contained" color="primary" onClick={() => handleFetch("concepts")} disabled={loading}>
            {loading && active === "concepts" ? "Loading..." : "Get AI Concepts"}
          </Button>
          <Button variant="contained" color="success" onClick={() => handleFetch("micro-lesson")} disabled={loading}>
            {loading && active === "micro-lesson" ? "Loading..." : "Get Micro-Lesson"}
          </Button>
          <Button variant="contained" color="warning" onClick={() => handleFetch("simulation")} disabled={loading}>
            {loading && active === "simulation" ? "Loading..." : "Get Simulation"}
          </Button>
          <Button variant="contained" color="error" onClick={() => handleFetch("recommendation")} disabled={loading}>
            {loading && active === "recommendation" ? "Loading..." : "Get Recommendation"}
          </Button>
        </Box>
        {result && (
          <Box sx={{ background: "#f5f5f5", borderRadius: 2, p: 2, mb: 3, fontFamily: "Consolas, monospace", whiteSpace: "pre-wrap" }}>
            {result}
          </Box>
        )}
        <Simulator />
      </Paper>
    </Box>
  );
}

export default App;
