import React, { useState } from "react";
import { Button, Box, Paper, Typography, CircularProgress, Tooltip } from "@mui/material";
import { fetchConcepts, fetchMicroLesson, fetchSimulation, fetchRecommendation } from "./api";
import Simulator from "./Simulator";
import './App.css';
import logo from './logo.svg'; // If you have a logo

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [resultTitle, setResultTitle] = useState("");
  const [microLessonTopic, setMicroLessonTopic] = useState("");
  const [recommendationSkillGap, setRecommendationSkillGap] = useState("");

  const handleFetch = async (type) => {
    setLoading(true);
    setActive(type);
    let data;
    let title = "";
    if (type === "concepts") {
      data = await fetchConcepts();
      title = "AI Concepts";
    }
    if (type === "micro-lesson") {
      data = await fetchMicroLesson(microLessonTopic || "agile sprint planning");
      title = "Micro-Lesson";
    }
    if (type === "simulation") {
      data = await fetchSimulation();
      title = "Simulation";
    }
    if (type === "recommendation") {
      data = await fetchRecommendation(recommendationSkillGap || "team leadership");
      title = "Recommendation";
    }
    setResult(data[type.replace("-", "_")] || JSON.stringify(data, null, 2));
    setResultTitle(title);
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f9fa" }}>
      <Box component="header" sx={{ background: "#1a237e", color: "#fff", py: 3, mb: 4, textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 10 }} />
        <Typography variant="h4" fontWeight={700} letterSpacing={1} sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
          AI Workplace Learning Chat UI
        </Typography>
      </Box>
      <Paper elevation={3} sx={{
        maxWidth: 700,
        mx: "auto",
        borderRadius: 3,
        p: { xs: 2, sm: 4 },
        width: "95%",
        minWidth: 0
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 3,
        }}>
          <Tooltip title="Get 3 innovative AI-powered workplace learning concepts.">
            <span>
              <Button variant="contained" color="primary" onClick={() => handleFetch("concepts")} disabled={loading}
                sx={{ transition: "background 0.2s, box-shadow 0.2s, color 0.2s", boxShadow: 1, '&:hover': { filter: 'brightness(1.1)', boxShadow: 3 }, mb: 1 }}>
                {loading && active === "concepts" ? "Loading..." : "GET AI CONCEPTS"}
              </Button>
            </span>
          </Tooltip>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Tooltip title="Enter a topic (e.g., 'agile sprint planning') and get a custom micro-lesson.">
              <input
                type="text"
                placeholder="Enter micro-lesson topic"
                value={microLessonTopic}
                onChange={e => setMicroLessonTopic(e.target.value)}
                style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc", minWidth: 180 }}
              />
            </Tooltip>
            <Tooltip title="Clear the micro-lesson topic and result.">
              <span>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setMicroLessonTopic("");
                    setResult("");
                    setResultTitle("");
                  }}
                  disabled={loading}
                  sx={{ transition: "background 0.2s, box-shadow 0.2s, color 0.2s", boxShadow: 1, '&:hover': { filter: 'brightness(1.1)', boxShadow: 3 } }}
                >
                  CLEAR
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Generate a micro-lesson for the entered topic.">
              <span>
                <Button variant="contained" color="success" onClick={() => handleFetch("micro-lesson")} disabled={loading}
                  sx={{ transition: "background 0.2s, box-shadow 0.2s, color 0.2s", boxShadow: 1, '&:hover': { filter: 'brightness(1.1)', boxShadow: 3 } }}>
                  {loading && active === "micro-lesson" ? "Loading..." : "GET MICRO-LESSON"}
                </Button>
              </span>
            </Tooltip>
          </Box>
          <Tooltip title="Set the scenario type or initial customer issue.">
            <span>
              <Button variant="contained" color="warning" onClick={() => handleFetch("simulation")} disabled={loading}
                sx={{ transition: "background 0.2s, box-shadow 0.2s, color 0.2s", boxShadow: 1, '&:hover': { filter: 'brightness(1.1)', boxShadow: 3 }, mb: 1 }}>
                {loading && active === "simulation" ? "Loading..." : "GET SIMULATION"}
              </Button>
            </span>
          </Tooltip>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Tooltip title="Enter a skill gap (e.g., 'team leadership') to get tailored recommendations.">
              <input
                type="text"
                placeholder="Enter skill gap for recommendation"
                value={recommendationSkillGap}
                onChange={e => setRecommendationSkillGap(e.target.value)}
                style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc", minWidth: 180 }}
              />
            </Tooltip>
            <Tooltip title="Generate learning module recommendations for the entered skill gap.">
              <span>
                <Button variant="contained" color="error" onClick={() => handleFetch("recommendation")} disabled={loading}
                  sx={{ transition: "background 0.2s, box-shadow 0.2s, color 0.2s", boxShadow: 1, '&:hover': { filter: 'brightness(1.1)', boxShadow: 3 } }}>
                  {loading && active === "recommendation" ? "Loading..." : "GET RECOMMENDATION"}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {result && !loading && (
          <div style={{
            background: "#f5f5f5",
            borderRadius: 8,
            padding: 20,
            marginBottom: 24,
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, monospace",
            boxShadow: "0 1px 6px #0001"
          }}>
            <h3 style={{ marginTop: 0, color: "#1a237e" }}>{resultTitle}</h3>
            {result}
          </div>
        )}
        <Simulator />
      </Paper>
    </Box>
  );
}

export default App;
