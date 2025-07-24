# AI Workplace Learning Platform – Frontend

This is the React frontend for the AI Workplace Learning Platform. It provides a modern, interactive dashboard for workplace learning, powered by AI and integrated with Firebase Authentication and a FastAPI backend.

---

## ✨ Features

- **Modern Dashboard UI** with sidebar navigation
- **Progress Cards** for lessons, simulations, and learning streak
- **Interactive Charts**:
  - Lessons Completed Over Time (Line Chart)
  - Lessons by Topic Breakdown (Pie Chart)
- **Modal Dialogs** for AI outputs (AI Concepts, Micro-lesson, Recommendation)
- **Per-Query Confidence Bar**: Choose how strictly your query is matched to AI modules (High, Medium, Low) before each search
- **Consistent Theming** with color-coded buttons and cards
- **Responsive Design** for desktop and mobile
- **Firebase Authentication** integration
- **Secure API calls** with user tokens

---

## 📦 Dependencies

- [React](https://reactjs.org/)
- [Recharts](https://recharts.org/) – for charts
- [react-modal](https://reactcommunity.org/react-modal/) – for modal dialogs
- [Firebase](https://firebase.google.com/) – for authentication
- [Shoelace](https://shoelace.style/) – for icons (sidebar)

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🖥️ UI Overview

- **Sidebar Navigation:**
  - Quick access to Dashboard, AI Concepts, Micro-lessons, Recommendation, Simulations, Career Coach, Skills Forecast, and Saved Lessons
- **Dashboard:**
  - Welcome message and sign out
  - Progress cards for lessons, simulations, and streak
  - Recommended next step
  - **Charts:**
    - Lessons Completed Over Time (line chart)
    - Lessons by Topic (pie chart)
- **AI Features:**
  - Get AI Concepts, Micro-lessons, and Recommendations
  - Results shown in beautiful modal dialogs
  - **Confidence Bar:** Above the search field, select High (100%), Medium (50%), or Low (0%) confidence for each query. High only routes exact/very close matches, Medium allows some flexibility, Low routes to the closest available option. Tooltips explain each level.

---

## 🛠️ Customization & Extending

- **Add new charts:** Use Recharts and pass processed data as props
- **Add new sidebar sections:** Edit `Sidebar.jsx` and add new routes/components
- **Style buttons and cards:** Use inline styles or your favorite CSS-in-JS solution

---

## 🔒 Authentication & API

- Uses Firebase Authentication for login
- All API calls include the user’s Firebase ID token for secure backend access

---

## 📊 Data Handling

- **Lessons** are fetched from the backend and grouped by week and topic for charts
- **Progress** is tracked and displayed per user

---

## 🤝 Contributing

Pull requests and suggestions are welcome! Please open an issue or PR to discuss improvements.

---

## License

MIT
