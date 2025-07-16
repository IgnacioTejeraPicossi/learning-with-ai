import React, { useState } from "react";

// Simple icon component using Unicode symbols
const Icon = ({ name, size = 20 }) => {
  const icons = {
    house: "🏠",
    lightbulb: "💡", 
    book: "📚",
    star: "⭐",
    "play-circle": "▶️",
    "user-check": "👤",
    "bar-chart": "📊",
    archive: "📦",
    layers: "📋",
    globe: "🌐",
    "chevron-left": "◀️",
    "chevron-right": "▶️"
  };

  return (
    <span style={{ fontSize: size, display: "inline-block", width: size, textAlign: "center" }}>
      {icons[name] || "📄"}
    </span>
  );
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "house" },
  { key: "ai-concepts", label: "AI Concepts", icon: "lightbulb" },
  { key: "micro-lessons", label: "Micro-lessons", icon: "book" },
  { key: "recommendation", label: "Recommendation", icon: "star" },
  { key: "simulations", label: "Simulations", icon: "play-circle" },
  { key: "web-search", label: "Web Search", icon: "globe" },
  { key: "coach", label: "AI Career Coach", icon: "user-check" },
  { key: "skills-forecast", label: "Skills Forecast", icon: "bar-chart" },
  { key: "saved-lessons", label: "Saved Lessons", icon: "archive" },
];

function Sidebar({ selected, onSelect }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside style={{
      width: isCollapsed ? 60 : 220,
      background: "#f8fafc",
      borderRight: "1px solid #e5e7eb",
      minHeight: "100vh",
      padding: "24px 0 0 0",
      boxShadow: "2px 0 8px #0001",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      transition: "width 0.3s ease",
      position: "relative"
    }}>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: 16,
          right: isCollapsed ? 8 : -12,
          background: "#2236a8",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "all 0.2s"
        }}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Icon name={isCollapsed ? "chevron-right" : "chevron-left"} size={12} />
      </button>

      <div style={{ 
        fontWeight: 700, 
        fontSize: isCollapsed ? 16 : 22, 
        textAlign: "center", 
        marginBottom: 32, 
        color: "#2236a8",
        padding: "0 8px",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>
        {!isCollapsed && <Icon name="layers" size={20} style={{ marginRight: 8 }} />}
        {!isCollapsed && "AI Learning"}
        {isCollapsed && <Icon name="layers" size={20} />}
      </div>
      
      <nav>
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isCollapsed ? 0 : 12,
              width: "100%",
              background: selected === item.key ? "#e0e7ff" : "transparent",
              color: selected === item.key ? "#2236a8" : "#2e2e2e",
              border: "none",
              borderRadius: 8,
              padding: isCollapsed ? "12px 0" : "12px 24px",
              fontWeight: 500,
              fontSize: isCollapsed ? 14 : 16,
              cursor: "pointer",
              marginBottom: 4,
              transition: "background 0.2s",
              justifyContent: isCollapsed ? "center" : "flex-start"
            }}
            title={isCollapsed ? item.label : ""}
          >
            <Icon name={item.icon} size={isCollapsed ? 18 : 20} />
            {!isCollapsed && item.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
    </aside>
  );
}

export default Sidebar; 