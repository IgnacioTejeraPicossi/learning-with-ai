import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from './ThemeContext';

// Color palette for different topics
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

const TopicBreakdownChart = ({ data }) => {
  const { colors } = useTheme();
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div style={{ background: colors.cardBackground, borderRadius: 12, boxShadow: colors.shadow, padding: 24, marginBottom: 24, color: colors.text }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: colors.text }}>Lessons by Topic</h3>
        <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '40px 20px' }}>
          No lessons completed yet. Start learning to see your topic breakdown!
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: colors.cardBackground, borderRadius: 12, boxShadow: colors.shadow, padding: 24, marginBottom: 24, color: colors.text }}>
      <h3 style={{ marginTop: 0, marginBottom: 16, color: colors.text }}>Lessons by Topic</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill={colors.primary}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: colors.cardBackground, color: colors.text, border: `1px solid ${colors.border}` }} />
          <Legend wrapperStyle={{ color: colors.text }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicBreakdownChart; 