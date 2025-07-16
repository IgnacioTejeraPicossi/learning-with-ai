import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LearningTrendsChart = ({ data }) => (
  <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginBottom: 24 }}>
    <h3 style={{ marginTop: 0, marginBottom: 16 }}>Lessons Completed Over Time</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="lessons" stroke="#2236a8" strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LearningTrendsChart; 