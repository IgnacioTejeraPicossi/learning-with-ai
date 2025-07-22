import React, { useState } from 'react';
import { generateVideoQuiz } from './api';

function VideoLesson() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleAnswer = (questionIdx, selected) => {
    setUserAnswers({
      ...userAnswers,
      [questionIdx]: selected
    });
  };

  return (
    <div>
      <h2>🎥 Video-Based Learning</h2>

      <label>Video URL (YouTube embed or MP4):</label><br/>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/embed/..."
        style={{ width: '100%' }}
      /><br/><br/>

      {videoUrl && (
        <iframe
          width="640"
          height="360"
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video"
        ></iframe>
      )}

      <h3>🧠 Video Summary (for quiz generation)</h3>
      <textarea
        rows={6}
        style={{ width: '100%' }}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Paste summary or main points from video..."
      ></textarea><br/>

      <button onClick={handleGenerateQuiz} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      <hr/>

      {quiz.length > 0 && (
        <div>
          <h3>📝 Quiz</h3>
          {quiz.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <strong>Q{idx + 1}: {q.question}</strong>
              <ul>
                {q.options.map((opt, optIdx) => (
                  <li key={optIdx}>
                    <label>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={userAnswers[idx] === opt}
                        onChange={() => handleAnswer(idx, opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
              {userAnswers[idx] && (
                <div style={{ color: userAnswers[idx] === q.answer ? 'green' : 'red' }}>
                  ✅ Correct: {q.answer}  <br/>
                  🧾 {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoLesson; 