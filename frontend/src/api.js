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

// Generic API call function
export async function apiCall(endpoint, method = "GET", data = null) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetchWithAuth(url, options);
  return response.json();
}

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

export async function fetchCareerSessions() {
  const res = await fetchWithAuth(`${API_BASE}/user/career-sessions`);
  return res.json();
}

export async function fetchSkillsForecasts() {
  const res = await fetchWithAuth(`${API_BASE}/user/skills-forecasts`);
  return res.json();
}

// Team Management API Functions
export async function createTeam(teamData) {
  return apiCall("/teams", "POST", teamData);
}

export async function getTeams() {
  return apiCall("/teams", "GET");
}

export async function getTeam(teamId) {
  return apiCall(`/teams/${teamId}`, "GET");
}

export async function updateTeam(teamId, teamData) {
  return apiCall(`/teams/${teamId}`, "PUT", teamData);
}

export async function deleteTeam(teamId) {
  return apiCall(`/teams/${teamId}`, "DELETE");
}

export async function addTeamMember(teamId, memberData) {
  return apiCall(`/teams/${teamId}/members`, "POST", memberData);
}

export async function updateTeamMember(teamId, memberId, memberData) {
  return apiCall(`/teams/${teamId}/members/${memberId}`, "PUT", memberData);
}

export async function removeTeamMember(teamId, memberId) {
  return apiCall(`/teams/${teamId}/members/${memberId}`, "DELETE");
}

export async function generateTeamAnalytics(teamId, metrics) {
  return apiCall(`/teams/${teamId}/analytics`, "POST", {
    team_id: teamId,
    metrics
  });
}

export async function getTeamAnalytics(teamId) {
  return apiCall(`/teams/${teamId}/analytics`, "GET");
}

// Certification API Functions
export async function saveUserProfile(profile) {
  return apiCall("/certifications/save-profile", "POST", profile);
}

export async function getUserProfile() {
  return apiCall("/certifications/user-profile", "GET");
}

export async function recommendCertifications(profile) {
  return apiCall("/certifications/recommend", "POST", profile);
}

export async function generateStudyPlan(studyPlan) {
  return apiCall("/certifications/study-plan", "POST", studyPlan);
}

export async function startCertificationSimulation(simulation) {
  return apiCall("/certifications/simulate", "POST", simulation);
}

export async function getUserCertifications() {
  return apiCall("/certifications/user-recommendations", "GET");
}
