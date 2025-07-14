import React, { useState } from 'react';
import { postCareerCoach } from './api';

export default function CareerCoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const startCoach = async () => {
    setLoading(true);
    const resp = await postCareerCoach({ history: [] });
    setMessages([{ role: 'assistant', content: resp.response }]);
    setLoading(false);
  };

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
    <sl-card style={{ margin: "32px 0", padding: "24px", maxWidth: 600 }}>
      <h2 style={{ marginTop: 0 }}>AI Career Coach</h2>
      {messages.length === 0 ? (
        <sl-button variant="primary" onClick={startCoach} style={{ marginRight: 8 }} loading={loading ? true : undefined}>
          {loading ? "Coaching..." : "Start Coaching"}
        </sl-button>
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your answer..."
              style={{ width: 300 }}
              disabled={loading}
            />
            <sl-button variant="primary" onClick={sendMessage} disabled={loading || !input.trim()} style={{ marginRight: 8 }}>
              Send
            </sl-button>
            <sl-button variant="default" onClick={handleClear} disabled={loading}>
              End Session
            </sl-button>
          </div>
        </>
      )}
    </sl-card>
  );
}
