import { auth } from './firebase';

export async function fetchWithAuth(url, options = {}) {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(url, options);
}

const API_BASE = "http://127.0.0.1:8000";

export async function fetchConcepts() {
  const res = await fetchWithAuth(`${API_BASE}/concepts`);
  return res.json();
}

export async function fetchMicroLesson(topic) {
  const res = await fetchWithAuth("http://localhost:8000/micro-lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  return res.json();
}

export async function fetchSimulation() {
  const res = await fetchWithAuth(`${API_BASE}/simulation`);
  return res.json();
}

export async function fetchRecommendation(skill_gap) {
  const res = await fetchWithAuth(`${API_BASE}/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill_gap }),
  });
  return res.json();
}

export async function fetchSimulationStep(history, user_input) {
  const res = await fetchWithAuth("http://127.0.0.1:8000/simulation-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, user_input }),
  });
  return res.json();
}

export async function postCareerCoach(body) {
  const res = await fetchWithAuth("http://127.0.0.1:8000/career-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function postSkillsForecast(input) {
  const res = await fetchWithAuth("http://127.0.0.1:8000/skills-forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function fetchLessons() {
  const res = await fetchWithAuth(`${API_BASE}/lessons`);
  return res.json();
}

export async function deleteLesson(id) {
  const res = await fetchWithAuth(`${API_BASE}/lessons/${id}`, {
    method: "DELETE"
  });
  return res;
}

export async function updateLesson(id, data) {
  const res = await fetchWithAuth(`${API_BASE}/lessons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function webSearch(query) {
  const res = await fetch("http://localhost:8080/web-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
}
