# AI Workplace Learning With AI

```mermaid
flowchart TD
  subgraph Frontend
    App[App.jsx]
    Concepts[Concepts.jsx]
    MicroLesson[MicroLesson.jsx]
    Recommendation[Recommendation.jsx]
    Simulator[Simulator.jsx]
    API[api.js]
  end
  subgraph Backend
    AppPy[app.py]
    LLM[llm.py]
    Prompts[prompts.py]
    VectorStore[vector_store.py]
  end
  OpenAI(OpenAI API)
  DB[(Database?)]

  %% User interaction
  User((User)) -->|Interacts with| App
  App --> Concepts
  App --> MicroLesson
  App --> Recommendation
  App --> Simulator
  App -->|Calls API functions| API
  Simulator -->|Scenario UI| App
  API -->|HTTP requests| AppPy

  %% Backend flow
  AppPy -->|Uses prompts| Prompts
  AppPy -->|Calls LLM| LLM
  AppPy -->|Vector search| VectorStore
  LLM -->|Sends prompt, gets response| OpenAI
  VectorStore -->|Future: Embeddings| DB

  %% Data flow
  OpenAI -- AI response --> LLM
  LLM -- AI result --> AppPy
  AppPy -- JSON response --> API
  API -- Data --> App
  App -- Shows result --> User

  %% Optional database connection
  VectorStore -.->|Planned| DB

  %% Styling
  classDef backend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px;
  classDef frontend fill:#fffde7,stroke:#fbc02d,stroke-width:2px;
  class Backend backend;
  class Frontend frontend;
```

This project is a full-stack demo for the Nordic Software AI Hackathon. It features an AI-powered backend (FastAPI + OpenAI) and a modern React frontend for interactive workplace learning, simulation, and recommendations.

---

## Features

### Backend (FastAPI)
- Modular API endpoints for:
  - AI Concepts generation
  - Micro-Lesson generation (with dynamic user input)
  - Scenario Simulation
  - AI Recommendation/Analysis
- Dynamic prompt handling with user input (e.g., custom micro-lesson topics)
- Mocked AI responses if OpenAI API key is missing or invalid
- CORS enabled for frontend-backend communication

### Frontend (React)
- Modular, professional UI with each feature in its own card:
  - **Concepts** (`Concepts.jsx`)
  - **Micro-lesson** (`MicroLesson.jsx`)
  - **Recommendation** (`Recommendation.jsx`)
  - **Scenario Simulator** (`Simulator.jsx`)
- Tooltips/hints on all main options and inputs for user guidance
- Responsive, modern design with color-coded buttons
- Displays API results in a styled, readable format
- Ready for further expansion (user input for other endpoints, authentication, etc.)

---

## Tech Stack
- **Backend:** Python, FastAPI, OpenAI API, python-dotenv
- **Frontend:** React, JavaScript
- **Dev Tools:** Docker (planned), Google Cloud Run (planned)

---

## Project Structure

```
/backend/
  app.py
  prompts.py
  llm.py
  vector_store.py
/frontend/
  src/
    App.jsx
    Concepts.jsx
    MicroLesson.jsx
    Recommendation.jsx
    Simulator.jsx
    api.js
  package.json
/deployment/
  Dockerfile
  cloudrun.yaml
README.md
```

---

## Setup Instructions

### 1. Backend
- Install dependencies:
  ```bash
  pip install fastapi uvicorn openai python-dotenv
  ```
- (Optional) Add your OpenAI API key to a `.env` file:
  ```
  OPENAI_API_KEY=sk-...
  ```
- Start the backend:
  ```bash
  uvicorn backend.app:app --reload
  ```

### 2. Frontend
- In the `frontend` folder, install dependencies:
  ```bash
  npm install
  ```
- Start the React app:
  ```bash
  npm start
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage
- Click any button to call the backend API and display the result.
- For "Micro-Lesson", enter a topic and click the button for a custom lesson.
- Hover over any button or input for a helpful tooltip/hint.
- If no valid OpenAI key is set, you will see a mocked response.

---

## Next Steps
- Make the Scenario Simulator interactive (done!)
- Add user input for other endpoints
- Add authentication/user profiles
- Deploy to the cloud (Vercel, Google Cloud Run, etc.)
- Connect to a real OpenAI key for live AI responses

---

**Built for the Nordic Software AI Hackathon 2025** 