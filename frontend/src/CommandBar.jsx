import React, { useState } from 'react';
import { postRoute, askStream } from './api';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function CommandBar({ onRoute }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamedOutput, setStreamedOutput] = useState('');
  // const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleSubmit = async (value) => {
    const prompt = value || input; // || transcript;
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setStreamedOutput('');
    try {
      const res = await postRoute(prompt);
      if (!res.module) throw new Error('Routing failed');
      onRoute(res.module, prompt);
      setInput('');
      // Optionally, stream LLM output for the routed module here
      // Example: stream a generic LLM response for demo
      await askStream({ prompt }, (output) => setStreamedOutput(output));
      // resetTranscript && resetTranscript();
    } catch (err) {
      setError("Sorry, I couldn't understand your request. Try rephrasing.");
    } finally {
      setLoading(false);
    }
  };

  // const handleVoiceStart = () => {
  //   resetTranscript();
  //   SpeechRecognition.startListening({ continuous: false });
  // };

  // const handleVoiceStop = () => {
  //   SpeechRecognition.stopListening();
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Ask AI anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          disabled={loading}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          style={{ padding: '0 18px', borderRadius: 6, fontSize: 16, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? '...' : 'Go'}
        </button>
        {/*
        <button
          onClick={listening ? handleVoiceStop : handleVoiceStart}
          disabled={loading}
          style={{ padding: '0 12px', borderRadius: 6, fontSize: 18, background: listening ? '#28a745' : '#eee', color: listening ? '#fff' : '#333', border: 'none', cursor: 'pointer' }}
          title={listening ? 'Stop Listening' : 'Speak'}
        >
          {listening ? '🎤...' : '🎤'}
        </button>
        */}
      </div>
      {/*
      {transcript && !listening && (
        <div style={{ color: '#333', fontSize: 14, marginTop: 4 }}>
          <span>Voice input: "{transcript}"</span>
          <button onClick={() => handleSubmit(transcript)} style={{ marginLeft: 8, fontSize: 13, padding: '2px 8px', borderRadius: 4, border: '1px solid #007bff', background: '#fff', color: '#007bff', cursor: 'pointer' }}>Submit</button>
        </div>
      )}
      */}
      {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
      {streamedOutput && (
        <div style={{ marginTop: 16, background: '#f4f4f4', borderRadius: 8, padding: 16, fontFamily: 'monospace', whiteSpace: 'pre-wrap', minHeight: 40 }}>
          {streamedOutput}
        </div>
      )}
    </div>
  );
}

export default CommandBar; 