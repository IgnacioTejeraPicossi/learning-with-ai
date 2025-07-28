import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from './ThemeContext';

const LearningTrendsChart = ({ data }) => {
  const { colors } = useTheme();
  return (
    <div style={{ background: colors.cardBackground, borderRadius: 12, boxShadow: colors.shadow, padding: 24, marginBottom: 24, color: colors.text }}>
      <h3 style={{ marginTop: 0, marginBottom: 16, color: colors.text }}>Lessons Completed Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
          <XAxis dataKey="week" stroke={colors.text} tick={{ fill: colors.text }} />
          <YAxis allowDecimals={false} stroke={colors.text} tick={{ fill: colors.text }} />
          <Tooltip contentStyle={{ background: colors.cardBackground, color: colors.text, border: `1px solid ${colors.border}` }} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="microLessons" 
            name="Micro-lessons"
            stroke={colors.primary} 
            strokeWidth={3} 
            dot={{ r: 5, fill: colors.primary }} 
          />
          <Line 
            type="monotone" 
            dataKey="videoLessons" 
            name="Video Lessons"
            stroke="#28a745" 
            strokeWidth={3} 
            dot={{ r: 5, fill: "#28a745" }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LearningTrendsChart; 