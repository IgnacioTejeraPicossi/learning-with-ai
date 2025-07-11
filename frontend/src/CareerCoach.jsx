import React, { useState } from 'react';
import { postCareerCoach } from './api';

export default function CareerCoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Start the conversation
  const startCoach = async () => {
    setLoading(true);
    const resp = await postCareerCoach({ history: [] });
    setMessages([{ role: 'assistant', content: resp.response }]);
    setLoading(false);
  };

  // Continue the conversation
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const resp = await postCareerCoach({ history: newMessages });
    setMessages([...newMessages, { role: 'assistant', content: resp.response }]);
    setLoading(false);
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div>
      <h3>AI Career Coach</h3>
      {messages.length === 0 ? (
        <button onClick={startCoach} disabled={loading}>
          {loading ? "Coaching..." : "Start Coaching"}
        </button>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ margin: '8px 0', fontWeight: msg.role === 'assistant' ? 'bold' : 'normal' }}>
                {msg.role === 'assistant' ? 'Coach: ' : 'You: '}
                <span style={{ fontWeight: 'normal', whiteSpace: 'pre-wrap' }}>{msg.content}</span>
              </div>
            ))}
          </div>
          <div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your answer..."
              style={{ width: 300, marginRight: 8 }}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
            <button onClick={handleClear} disabled={loading} style={{ marginLeft: 8 }}>
              End Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}
