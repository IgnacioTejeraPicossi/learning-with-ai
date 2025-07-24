import React, { useState } from 'react';
import { postRoute, askStream } from './api';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ModalDialog from './ModalDialog';

function CommandBar({ onRoute, inputPlaceholder }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamedOutput, setStreamedOutput] = useState('');
  const [unknownIntent, setUnknownIntent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const moduleMap = {
    concepts: 'ai-concepts',
    microlesson: 'micro-lessons',
    simulation: 'simulations',
    recommendation: 'recommendation',
    certification: 'certifications',
    coach: 'coach',
    forecast: 'skills-forecast',
    // Robust mapping for video lessons
    videolesson: 'video-lessons',
    videolessons: 'video-lessons',
    'video-lesson': 'video-lessons',
    'video-lessons': 'video-lessons',
    'video lesson': 'video-lessons',
    'video lessons': 'video-lessons',
    'Video Lessons': 'video-lessons',
    'Video Lesson': 'video-lessons',
    'VIDEO LESSONS': 'video-lessons',
    'VIDEO LESSON': 'video-lessons',
  };

  const handleSubmit = async (value) => {
    const prompt = value || input; // || transcript;
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setStreamedOutput('');
    try {
      const res = await postRoute(prompt);
      if (!res.module) {
        // Routing failed, classify unknown intent
        const classifyRes = await fetch('http://localhost:8000/classify-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: prompt })
        });
        const classifyData = await classifyRes.json();
        setUnknownIntent(classifyData);
        setModalOpen(true);
        setLoading(false);
        return;
      }
      // Normalize module name for robust mapping
      const normalizedModule = (res.module || '').toLowerCase().replace(/[-_ ]/g, '');
      let mappedModule = moduleMap[normalizedModule] || moduleMap[res.module] || res.module;
      console.log('Routing debug:', { backendModule: res.module, normalizedModule, mappedModule });
      onRoute(mappedModule, prompt);
      setInput('');
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
          placeholder={inputPlaceholder || "Ask AI anything..."}
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
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
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
      <ModalDialog
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="We Didn't Recognize Your Request"
      >
        {unknownIntent ? (
          <div>
            <p><b>AI Classification:</b> {unknownIntent.intent || 'Unknown'}</p>
            <p><b>Module Match:</b> {unknownIntent.module_match || 'None'}</p>
            <p><b>Suggested Feature:</b> {unknownIntent.new_feature || 'None'}</p>
            <p><b>Confidence:</b> {unknownIntent.confidence || 'Unknown'}</p>
            {unknownIntent.follow_up_question && (
              <p><b>Follow-up Question:</b> {unknownIntent.follow_up_question}</p>
            )}
            <button
              onClick={() => setModalOpen(false)}
              style={{ marginTop: 16, background: '#007bff', color: '#fff', border: 0, borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16 }}
            >
              Close
            </button>
          </div>
        ) : (
          <div>Classifying your request...</div>
        )}
      </ModalDialog>
    </div>
  );
}

export default CommandBar; 