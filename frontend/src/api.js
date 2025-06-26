const API_BASE = "http://127.0.0.1:8000";

export async function fetchConcepts() {
  const res = await fetch(`${API_BASE}/concepts`);
  return res.json();
}

export async function fetchMicroLesson(topic) {
  const res = await fetch("http://127.0.0.1:8000/micro-lesson", {
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

export async function fetchRecommendation() {
  const res = await fetch(`${API_BASE}/recommendation`);
  return res.json();
}
