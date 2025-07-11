const API_BASE = "http://127.0.0.1:8000";

export async function fetchConcepts() {
  const res = await fetch(`${API_BASE}/concepts`);
  return res.json();
}

export async function fetchMicroLesson(topic) {
  const res = await fetch(`${API_BASE}/micro-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  return res.json();
}

export async function fetchSimulation() {
  const res = await fetch(`${API_BASE}/simulation`);
  return res.json();
}

export async function fetchRecommendation(skill_gap) {
  const res = await fetch(`${API_BASE}/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill_gap }),
  });
  return res.json();
}

export async function fetchSimulationStep(history, user_input) {
  const res = await fetch("http://127.0.0.1:8000/simulation-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, user_input }),
  });
  return res.json();
}

export async function postCareerCoach(body) {
  const res = await fetch("http://127.0.0.1:8000/career-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function postSkillsForecast(input) {
  const res = await fetch("http://127.0.0.1:8000/skills-forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}
