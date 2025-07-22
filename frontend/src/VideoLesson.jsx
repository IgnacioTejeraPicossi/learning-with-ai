import React, { useState } from 'react';
import { generateVideoQuiz, generateVideoSummary } from './api';

const EXAMPLE_VIDEO = "https://www.youtube.com/embed/1hHMwLxN6EM";
const EXAMPLE_SUMMARY = "This video explains the basics of Agile methodology, including its iterative approach, team collaboration, and adaptability to change. Key points: Agile is not waterfall, it values individuals and interactions, and it uses sprints to deliver value incrementally.";

function VideoLesson() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const res = await generateVideoQuiz(summary);
      setQuiz(res.quiz || []);
    } catch (err) {
      alert("Quiz generation failed.");
    }
    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await generateVideoSummary(transcript);
      setSummary(res.summary || '');
    } catch (err) {
      alert("Summary generation failed.");
    }
    setSummaryLoading(false);
  };

  const handleAnswer = (questionIdx, selected) => {
    setUserAnswers({
      ...userAnswers,
      [questionIdx]: selected
    });
  };

  const handlePasteExample = () => {
    setVideoUrl(EXAMPLE_VIDEO);
    setSummary(EXAMPLE_SUMMARY);
    setQuiz([]);
    setUserAnswers({});
  };

  // Calculate score
  const correctCount = quiz.reduce((acc, q, idx) => userAnswers[idx] === q.answer ? acc + 1 : acc, 0);
  const score = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;
  const showBadge = score >= 80 && quiz.length > 0;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>🎥 Video-Based Learning</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={handlePasteExample} style={{ marginRight: 8 }}>Paste Example</button>
        <span title="Paste a YouTube embed URL (e.g. https://www.youtube.com/embed/...) or direct MP4 link.">ℹ️ Video URL</span>
      </div>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/embed/..."
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
      /><br/>

      {videoUrl && (
        <div style={{ marginBottom: 20 }}>
          <iframe
            width="100%"
            height="360"
            src={videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
            style={{ borderRadius: 8 }}
          ></iframe>
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>🎤 Transcript (optional)</h3>
      <textarea
        rows={4}
        style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        value={transcript}
        onChange={e => setTranscript(e.target.value)}
        placeholder="Paste transcript or captions here..."
      ></textarea>
      <button onClick={handleGenerateSummary} disabled={summaryLoading || !transcript} style={{ marginBottom: 16 }}>
        {summaryLoading ? "Generating Summary..." : "Auto-generate Summary"}
      </button>

      <h3 style={{ marginTop: 24 }}>🧠 Video Summary <span title="Paste or auto-generate a summary for quiz generation.">ℹ️</span></h3>
      <textarea
        rows={5}
        style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Paste summary or main points from video..."
      ></textarea><br/>

      <button onClick={handleGenerateQuiz} disabled={loading || !summary} style={{ marginTop: 8, marginBottom: 16 }}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      <hr style={{ margin: '24px 0' }}/>

      {quiz.length > 0 && (
        <div>
          <h3>📝 Quiz</h3>
          {quiz.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '2rem', background: '#f9f9f9', borderRadius: 8, padding: 16 }}>
              <strong>Q{idx + 1}: {q.question}</strong>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {q.options.map((opt, optIdx) => (
                  <li key={optIdx} style={{ marginBottom: 4 }}>
                    <label>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={userAnswers[idx] === opt}
                        onChange={() => handleAnswer(idx, opt)}
                        style={{ marginRight: 6 }}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
              {userAnswers[idx] && (
                <div style={{ color: userAnswers[idx] === q.answer ? 'green' : 'red', marginTop: 6 }}>
                  {userAnswers[idx] === q.answer ? '✅ Correct!' : '❌ Incorrect.'} <br/>
                  <span style={{ fontWeight: 500 }}>Correct: {q.answer}</span>  <br/>
                  <span style={{ color: '#555' }}>🧾 {q.explanation}</span>
                </div>
              )}
            </div>
          ))}
          <div style={{ fontWeight: 600, fontSize: 18, marginTop: 16 }}>
            Score: {score}%
            {showBadge && <span style={{ marginLeft: 12, color: '#1976d2', fontSize: 22 }}>🏅 Video Learning Badge!</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLesson; 