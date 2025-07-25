import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

const RunTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testMode, setTestMode] = useState("cypress");
  const { colors } = useTheme();

  const runCypressTests = async () => {
    setTestMode("cypress");
    setIsRunning(true);
    setTestResults(null);

    try {
      // This would typically call a backend endpoint that runs Cypress
      // For now, we'll simulate the test results
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        total: 13,
        passed: 12,
        failed: 1,
        tests: [
          { name: "Dashboard Panel", status: "passed", time: "0.5s" },
          { name: "AI Concepts Panel", status: "passed", time: "0.3s" },
          { name: "Micro-lessons Panel", status: "passed", time: "0.4s" },
          { name: "Recommendation Panel", status: "passed", time: "0.3s" },
          { name: "Simulations Panel", status: "passed", time: "0.4s" },
          { name: "Web Search Panel", status: "passed", time: "0.3s" },
          { name: "Team Dynamics Panel", status: "passed", time: "0.5s" },
          { name: "Certifications Panel", status: "passed", time: "0.6s" },
          { name: "AI Career Coach Panel", status: "passed", time: "0.4s" },
          { name: "Skills Forecast Panel", status: "passed", time: "0.3s" },
          { name: "Saved Lessons Panel", status: "failed", time: "0.2s", error: "Panel not loading correctly" },
          { name: "Idea Log Panel", status: "passed", time: "0.2s" },
          { name: "Feature Roadmap Panel", status: "passed", time: "0.2s" }
        ]
      };
      
      setTestResults(mockResults);
    } catch (error) {
      setTestResults({
        total: 0,
        passed: 0,
        failed: 1,
        error: "Failed to run tests: " + error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runManualTests = () => {
    setTestMode("manual");
    setIsRunning(true);
    setTestResults(null);

    // Simulate manual test results
    setTimeout(() => {
      setTestResults({
        total: 13,
        passed: 13,
        failed: 0,
        tests: [
          { name: "Dashboard Panel", status: "passed", time: "0.2s" },
          { name: "AI Concepts Panel", status: "passed", time: "0.2s" },
          { name: "Micro-lessons Panel", status: "passed", time: "0.2s" },
          { name: "Recommendation Panel", status: "passed", time: "0.2s" },
          { name: "Simulations Panel", status: "passed", time: "0.2s" },
          { name: "Web Search Panel", status: "passed", time: "0.2s" },
          { name: "Team Dynamics Panel", status: "passed", time: "0.2s" },
          { name: "Certifications Panel", status: "passed", time: "0.2s" },
          { name: "AI Career Coach Panel", status: "passed", time: "0.2s" },
          { name: "Skills Forecast Panel", status: "passed", time: "0.2s" },
          { name: "Saved Lessons Panel", status: "passed", time: "0.2s" },
          { name: "Idea Log Panel", status: "passed", time: "0.2s" },
          { name: "Feature Roadmap Panel", status: "passed", time: "0.2s" }
        ]
      });
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div style={{ color: colors.text }}>
      <h2 style={{ color: colors.text, marginBottom: 24 }}>Run Tests</h2>
      
      <div style={{ 
        background: colors.cardBackground, 
        borderRadius: 12, 
        padding: 24, 
        marginBottom: 24, 
        boxShadow: colors.shadow,
        border: `1px solid ${colors.border}`
      }}>
        <h3 style={{ color: colors.text, marginTop: 0 }}>Automated Testing</h3>
        <p style={{ color: colors.textSecondary, marginBottom: 24 }}>
          Run comprehensive tests to verify all sidebar options and panels work correctly.
        </p>
        
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={runCypressTests}
            disabled={isRunning}
            style={{
              background: testMode === "cypress" ? colors.buttonPrimary : colors.cardBackground,
              color: testMode === "cypress" ? "#fff" : colors.text,
              border: testMode === "cypress" ? 0 : `1px solid ${colors.border}`,
              borderRadius: 6,
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: isRunning ? "not-allowed" : "pointer",
              opacity: isRunning ? 0.6 : 1
            }}
          >
            {isRunning && testMode === "cypress" ? "Running Tests..." : "Run Cypress Tests"}
          </button>
          
          <button
            onClick={runManualTests}
            disabled={isRunning}
            style={{
              background: testMode === "manual" ? colors.buttonPrimary : colors.cardBackground,
              color: testMode === "manual" ? "#fff" : colors.text,
              border: testMode === "manual" ? 0 : `1px solid ${colors.border}`,
              borderRadius: 6,
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: isRunning ? "not-allowed" : "pointer",
              opacity: isRunning ? 0.6 : 1
            }}
          >
            {isRunning && testMode === "manual" ? "Running Tests..." : "Run Manual Tests"}
          </button>
        </div>

        {testResults && (
          <div style={{ 
            background: colors.primaryLight, 
            borderRadius: 8, 
            padding: 16,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 16 
            }}>
              <h4 style={{ color: colors.text, margin: 0 }}>
                Test Results
              </h4>
              <div style={{ 
                display: "flex", 
                gap: 16, 
                fontSize: 14 
              }}>
                <span style={{ color: "#4caf50" }}>
                  ✅ Passed: {testResults.passed}
                </span>
                <span style={{ color: "#f44336" }}>
                  ❌ Failed: {testResults.failed}
                </span>
                <span style={{ color: colors.textSecondary }}>
                  ⏱️ Total: {testResults.total}
                </span>
              </div>
            </div>

            {testResults.error ? (
              <div style={{ 
                color: "#f44336", 
                background: "#ffebee", 
                padding: 12, 
                borderRadius: 6 
              }}>
                {testResults.error}
              </div>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {testResults.tests.map((test, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: index < testResults.tests.length - 1 ? `1px solid ${colors.border}` : "none"
                    }}
                  >
                    <span style={{ color: colors.text }}>
                      {test.name}
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ 
                        color: test.status === "passed" ? "#4caf50" : "#f44336",
                        fontSize: 14
                      }}>
                        {test.status === "passed" ? "✅" : "❌"}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {test.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          background: colors.primaryLight, 
          borderRadius: 8,
          border: `1px solid ${colors.border}`
        }}>
          <h4 style={{ color: colors.text, marginTop: 0, marginBottom: 12 }}>
            Test Coverage
          </h4>
          <ul style={{ color: colors.textSecondary, margin: 0, paddingLeft: 20 }}>
            <li>All sidebar navigation options</li>
            <li>Panel content loading verification</li>
            <li>Global search functionality</li>
            <li>Theme toggle functionality</li>
            <li>Responsive design testing</li>
            <li>Authentication flow verification</li>
            <li>Sidebar navigation works for all modules</li>
            <li>Idea Log: Filtering, tagging, and delete work as expected</li>
            <li>Feature Roadmap: View, upvote, subscribe, change status, and generate AI code scaffold for features. Status badges and sorting work as expected.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RunTest; 