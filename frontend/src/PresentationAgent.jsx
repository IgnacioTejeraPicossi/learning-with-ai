import React, { useState, useEffect, useRef } from 'react';
import { askStream } from './api';
import StreamingProgress from './StreamingProgress';
import StreamingText from './StreamingText';
import { useStreaming, STATUS_MESSAGES } from './hooks/useStreaming';
import { useTheme } from './ThemeContext';

function PresentationAgent() {
  const [presentationMode, setPresentationMode] = useState(''); // 'demo', 'qa', 'script'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [qaQuestion, setQaQuestion] = useState('');
  const [presentationScript, setPresentationScript] = useState('');
  const { colors } = useTheme();
  
  // Use streaming hooks for different modes
  const scriptStreaming = useStreaming('Ready to generate presentation script');
  const qaStreaming = useStreaming('Ready to answer questions');
  const demoStreaming = useStreaming('Ready to demonstrate features');

  // Speech synthesis
  const speechRef = useRef(null);

  // Presentation slides structure
  const presentationSlides = [
    {
      id: 1,
      title: "Project Overview",
      content: "Reimagine Workplace Learning With AI",
      duration: 30, // seconds
      keyPoints: [
        "Traditional learning is expensive and generic",
        "LLMs can identify individual needs automatically",
        "Generate tailored content on the fly",
        "Build simulations for team-based learning"
      ]
    },
    {
      id: 2,
      title: "Core Features",
      content: "AI-Powered Learning Platform",
      duration: 45,
      keyPoints: [
        "AI Concepts Generation",
        "Micro-lessons with streaming",
        "Scenario Simulator",
        "AI Career Coach",
        "Skills Forecasting",
        "Team Dynamics Analyzer"
      ]
    },
    {
      id: 3,
      title: "Technical Architecture",
      content: "Modern Full-Stack Implementation",
      duration: 40,
      keyPoints: [
        "React frontend with streaming UI",
        "FastAPI backend with OpenAI integration",
        "MongoDB for user-specific data",
        "Firebase authentication",
        "Real-time streaming responses"
      ]
    },
    {
      id: 4,
      title: "Live Demo",
      content: "Interactive Feature Showcase",
      duration: 60,
      keyPoints: [
        "Show actual working features",
        "Demonstrate AI capabilities",
        "Handle live Q&A from judges",
        "Real-time interaction"
      ]
    }
  ];

  // Q&A knowledge base for common hackathon questions
  const qaKnowledgeBase = [
    {
      question: "What makes your solution unique?",
      answer: "Our solution is unique because it combines multiple AI-powered learning modalities in one platform: real-time streaming content generation, personalized career coaching, skills forecasting, and team dynamics analysis. Unlike traditional LMS platforms, we provide instant, contextual learning experiences that adapt to individual needs and workplace scenarios."
    },
    {
      question: "How does the AI Career Coach work?",
      answer: "The AI Career Coach uses advanced language models to provide personalized career guidance. It analyzes user input about their goals, current skills, and challenges, then generates actionable advice, improvement strategies, and recommended resources. The coach maintains conversation context and can handle multi-turn discussions about career development."
    },
    {
      question: "What's the technical architecture?",
      answer: "We built a modern full-stack application with React frontend for the UI, FastAPI backend for AI processing, OpenAI integration for content generation, MongoDB for user-specific data persistence, and Firebase for authentication. The system uses real-time streaming responses similar to ChatGPT for an engaging user experience."
    },
    {
      question: "How scalable is your solution?",
      answer: "Our architecture is highly scalable. The FastAPI backend can handle concurrent requests efficiently, MongoDB provides horizontal scaling for data storage, and the modular design allows easy addition of new features. We can deploy on cloud platforms like Google Cloud Run for automatic scaling based on demand."
    },
    {
      question: "What's the business value for employers?",
      answer: "For employers, our platform reduces training costs by 60-80% through AI-generated content, improves employee engagement with personalized learning paths, accelerates skill development with targeted micro-lessons, and provides data-driven insights into team learning needs and performance."
    },
    {
      question: "How do you ensure content quality?",
      answer: "We use advanced prompt engineering and content validation systems. The AI generates content based on proven learning methodologies, and we implement quality checks for accuracy, relevance, and educational value. Users can also provide feedback to continuously improve content quality."
    },
    {
      question: "What about data privacy and security?",
      answer: "We prioritize data security with Firebase authentication, encrypted data transmission, and user-specific data isolation. All personal learning data is stored securely in MongoDB with proper access controls. We comply with GDPR and other privacy regulations."
    },
    {
      question: "How do you measure learning effectiveness?",
      answer: "We track learning progress through multiple metrics: completion rates, engagement time, quiz performance, skill application in simulations, and career advancement outcomes. The AI analyzes these patterns to continuously improve content and recommendations."
    },
    {
      question: "What's your go-to-market strategy?",
      answer: "We're targeting mid-size companies (100-1000 employees) who struggle with traditional training costs and effectiveness. Our initial focus is on tech companies and consulting firms. We plan to offer freemium trials, then subscription-based pricing with enterprise features."
    },
    {
      question: "How do you compete with existing LMS platforms?",
      answer: "Unlike traditional LMS platforms that offer static, one-size-fits-all content, we provide dynamic, AI-generated learning experiences that adapt in real-time. Our platform is more engaging, cost-effective, and personalized than solutions like Coursera for Business or LinkedIn Learning."
    }
  ];

  // Generate presentation script
  const handleGenerateScript = async () => {
    setPresentationMode('script');
    
    scriptStreaming.startStreaming(
      `Create a compelling 4-minute presentation script for the "Reimagine Workplace Learning With AI" project for a hackathon in Stockholm.
      
      Project Overview:
      - Traditional learning is expensive, time-consuming, and generic
      - LLMs can flip the script by identifying individual needs
      - Generate tailored content on the fly
      - Build simulations for team-based learning
      
      Key Features to Highlight:
      1. AI Concepts Generation - Real-time streaming of educational concepts
      2. Micro-lessons - Bite-sized learning with AI-powered content
      3. Scenario Simulator - Interactive workplace simulations
      4. AI Career Coach - Personalized career guidance
      5. Skills Forecasting - AI-powered skill development predictions
      6. Team Dynamics Analyzer - Team collaboration insights
      7. Certifications - AI-powered certification recommendations
      8. Video Lessons - Interactive video learning with quizzes
      
      Technical Highlights:
      - React frontend with modern streaming UI
      - FastAPI backend with OpenAI integration
      - MongoDB for user-specific data persistence
      - Firebase authentication
      - Real-time streaming responses like ChatGPT
      
      Make it engaging, professional, and suitable for a 4-minute hackathon presentation.
      Include specific examples and benefits for employers and employees.`,
      {
        statusMessages: STATUS_MESSAGES.PRESENTATION,
        onComplete: () => {
          setPresentationScript(scriptStreaming.content);
          console.log('Presentation script generated');
        }
      }
    );
  };

  // Enhanced Q&A handling with knowledge base
  const handleAskQuestion = async () => {
    if (!qaQuestion.trim()) {
      alert('Please enter a question.');
      return;
    }

    setPresentationMode('qa');
    
    // Check if we have a pre-written answer
    const matchingQA = qaKnowledgeBase.find(qa => 
      qa.question.toLowerCase().includes(qaQuestion.toLowerCase()) ||
      qaQuestion.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    if (matchingQA) {
      // Use pre-written answer for better consistency
      qaStreaming.startStreaming(
        `Question: ${qaQuestion}

Answer: ${matchingQA.answer}

Additional context: This response is based on our comprehensive project knowledge and is designed to be clear, professional, and informative for hackathon judges and audience members.`,
        {
          statusMessages: STATUS_MESSAGES.QA,
          onComplete: () => {
            console.log('Q&A response generated from knowledge base');
          }
        }
      );
    } else {
      // Generate custom answer for unique questions
      qaStreaming.startStreaming(
        `You are presenting the "Reimagine Workplace Learning With AI" project at a hackathon in Stockholm.
        
        Project Context:
        - AI-powered workplace learning platform
        - Features: AI Concepts, Micro-lessons, Scenario Simulator, Career Coach, Skills Forecasting, Team Dynamics, Certifications, Video Lessons
        - Tech: React, FastAPI, OpenAI, MongoDB, Firebase
        - Goal: Make workplace learning personalized, efficient, and engaging
        
        Answer this question from the audience/judges: "${qaQuestion}"
        
        Provide a clear, technical, and engaging response that showcases the project's capabilities.
        If the question is about implementation details, explain the technical approach.
        If it's about business value, focus on benefits for employers and employees.
        Keep responses concise but comprehensive.`,
        {
          statusMessages: STATUS_MESSAGES.QA,
          onComplete: () => {
            console.log('Custom Q&A response generated');
          }
        }
      );
    }
  };

  // Start demo mode
  const handleStartDemo = async () => {
    setPresentationMode('demo');
    setIsPresenting(true);
    setCurrentSlide(0);
    
    demoStreaming.startStreaming(
      `You are demonstrating the "Reimagine Workplace Learning With AI" platform live at a hackathon.
      
      Current slide: ${presentationSlides[currentSlide].title}
      Content: ${presentationSlides[currentSlide].content}
      Key points: ${presentationSlides[currentSlide].keyPoints.join(', ')}
      
      Provide a live demonstration script for this slide. Make it engaging and interactive.
      Include specific examples of how the features work and their benefits.
      Keep it concise for the ${presentationSlides[currentSlide].duration}-second time slot.`,
      {
        statusMessages: STATUS_MESSAGES.DEMO,
        onComplete: () => {
          console.log('Demo script generated');
        }
      }
    );
  };

  // Speech synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-advance slides in demo mode
  useEffect(() => {
    if (isPresenting && presentationMode === 'demo') {
      const timer = setTimeout(() => {
        if (currentSlide < presentationSlides.length - 1) {
          setCurrentSlide(currentSlide + 1);
          // Generate next slide content
          demoStreaming.startStreaming(
            `You are demonstrating the "Reimagine Workplace Learning With AI" platform live at a hackathon.
            
            Current slide: ${presentationSlides[currentSlide + 1].title}
            Content: ${presentationSlides[currentSlide + 1].content}
            Key points: ${presentationSlides[currentSlide + 1].keyPoints.join(', ')}
            
            Provide a live demonstration script for this slide. Make it engaging and interactive.
            Include specific examples of how the features work and their benefits.
            Keep it concise for the ${presentationSlides[currentSlide + 1].duration}-second time slot.`,
            {
              statusMessages: STATUS_MESSAGES.DEMO,
              onComplete: () => {
                console.log('Next slide demo script generated');
              }
            }
          );
        } else {
          setIsPresenting(false);
        }
      }, presentationSlides[currentSlide].duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentSlide, isPresenting, presentationMode]);

  const handleClear = () => {
    setPresentationMode('');
    setCurrentSlide(0);
    setIsPresenting(false);
    setQaQuestion('');
    setPresentationScript('');
    stopSpeaking();
    scriptStreaming.clearStreaming();
    qaStreaming.clearStreaming();
    demoStreaming.clearStreaming();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', color: colors.text }}>
      <h2 style={{ marginBottom: 16, color: colors.text }}>🎤 AI Presentation Agent</h2>
      
      <p style={{ marginBottom: 20, color: colors.textSecondary }}>
        AI-powered presentation agent for your hackathon demo. Generate scripts, handle Q&A, and deliver live presentations.
      </p>

      {/* Mode Selection */}
      {!presentationMode && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, color: colors.text }}>Select Presentation Mode:</h3>
          
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {/* Generate Script */}
            <div
              style={{
                padding: 20,
                background: colors.cardBackground,
                borderRadius: 12,
                border: `2px solid ${colors.border}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={handleGenerateScript}
              onMouseEnter={(e) => e.target.style.borderColor = colors.primary}
              onMouseLeave={(e) => e.target.style.borderColor = colors.border}
            >
              <div style={{ fontSize: '2.5em', marginBottom: 12 }}>📝</div>
              <h3 style={{ marginBottom: 8, color: colors.text }}>Generate Script</h3>
              <p style={{ 
                color: colors.textSecondary, 
                fontSize: '0.9em',
                lineHeight: 1.4
              }}>
                Create a 4-minute presentation script for the hackathon
              </p>
            </div>

            {/* Q&A Mode */}
            <div
              style={{
                padding: 20,
                background: colors.cardBackground,
                borderRadius: 12,
                border: `2px solid ${colors.border}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setPresentationMode('qa')}
              onMouseEnter={(e) => e.target.style.borderColor = colors.primary}
              onMouseLeave={(e) => e.target.style.borderColor = colors.border}
            >
              <div style={{ fontSize: '2.5em', marginBottom: 12 }}>❓</div>
              <h3 style={{ marginBottom: 8, color: colors.text }}>Q&A Mode</h3>
              <p style={{ 
                color: colors.textSecondary, 
                fontSize: '0.9em',
                lineHeight: 1.4
              }}>
                Handle questions from judges and audience
              </p>
            </div>

            {/* Live Demo */}
            <div
              style={{
                padding: 20,
                background: colors.cardBackground,
                borderRadius: 12,
                border: `2px solid ${colors.border}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={handleStartDemo}
              onMouseEnter={(e) => e.target.style.borderColor = colors.primary}
              onMouseLeave={(e) => e.target.style.borderColor = colors.border}
            >
              <div style={{ fontSize: '2.5em', marginBottom: 12 }}>🎬</div>
              <h3 style={{ marginBottom: 8, color: colors.text }}>Live Demo</h3>
              <p style={{ 
                color: colors.textSecondary, 
                fontSize: '0.9em',
                lineHeight: 1.4
              }}>
                Start 4-minute automated presentation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Script Generation Mode */}
      {presentationMode === 'script' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            padding: 12,
            background: colors.primaryLight,
            borderRadius: 8
          }}>
            <span style={{ fontSize: '1.5em' }}>📝</span>
            <div>
              <h3 style={{ margin: 0, color: colors.text }}>Generating Presentation Script</h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: colors.textSecondary }}>
                4-Minute Hackathon Presentation
              </p>
            </div>
          </div>

          {/* Script Generation Progress */}
          {scriptStreaming.loading && (
            <StreamingProgress 
              loading={scriptStreaming.loading}
              status={scriptStreaming.status}
              progress={scriptStreaming.progress}
              color="info"
            />
          )}

          {/* Generated Script */}
          <StreamingText 
            content={scriptStreaming.content}
            loading={scriptStreaming.loading}
            placeholder="Generating your presentation script..."
            style={{ minHeight: '400px' }}
          />

          {/* Script Actions */}
          {scriptStreaming.isComplete && (
            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => speakText(scriptStreaming.content)}
                disabled={isSpeaking}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: isSpeaking ? colors.border : colors.primary,
                  color: '#fff',
                  cursor: isSpeaking ? 'not-allowed' : 'pointer'
                }}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Script'}
              </button>
              <button
                onClick={stopSpeaking}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                🔇 Stop Speaking
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                🔄 New Script
              </button>
            </div>
          )}
        </div>
      )}

      {/* Q&A Mode */}
      {presentationMode === 'qa' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            padding: 12,
            background: colors.primaryLight,
            borderRadius: 8
          }}>
            <span style={{ fontSize: '1.5em' }}>❓</span>
            <div>
              <h3 style={{ margin: 0, color: colors.text }}>Q&A Mode</h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: colors.textSecondary }}>
                Answer questions from judges and audience
              </p>
            </div>
          </div>

          {/* Question Input */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={qaQuestion}
              onChange={(e) => setQaQuestion(e.target.value)}
              placeholder="Enter a question from the audience..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.cardBackground,
                color: colors.text,
                fontSize: '1em'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAskQuestion();
                }
              }}
            />
          </div>

          {/* Quick Test Questions */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ 
              marginBottom: 8, 
              fontSize: '0.9em', 
              color: colors.textSecondary 
            }}>
              💡 Quick test questions:
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              flexWrap: 'wrap' 
            }}>
              {qaKnowledgeBase.slice(0, 4).map((qa, index) => (
                <button
                  key={index}
                  onClick={() => setQaQuestion(qa.question)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBackground,
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '0.8em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {qa.question.split(' ').slice(0, 3).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAskQuestion}
            disabled={qaStreaming.loading || !qaQuestion.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              background: (qaStreaming.loading || !qaQuestion.trim()) ? colors.border : colors.primary,
              color: '#fff',
              cursor: (qaStreaming.loading || !qaQuestion.trim()) ? 'not-allowed' : 'pointer',
              marginBottom: 16
            }}
          >
            {qaStreaming.loading ? '⏳ Generating Answer...' : '❓ Answer Question'}
          </button>

          {/* Q&A Response */}
          {qaStreaming.content && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 8, color: colors.text }}>Question: {qaQuestion}</h4>
              <StreamingText 
                content={qaStreaming.content}
                loading={qaStreaming.loading}
                placeholder="Generating answer..."
                style={{ minHeight: '200px' }}
              />
            </div>
          )}

          {/* Q&A Actions */}
          {qaStreaming.isComplete && (
            <div style={{ 
              display: 'flex', 
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => speakText(qaStreaming.content)}
                disabled={isSpeaking}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: isSpeaking ? colors.border : colors.primary,
                  color: '#fff',
                  cursor: isSpeaking ? 'not-allowed' : 'pointer'
                }}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Answer'}
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBackground,
                  color: colors.text,
                  cursor: 'pointer'
                }}
              >
                🔄 New Question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live Demo Mode */}
      {presentationMode === 'demo' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            padding: 12,
            background: colors.primaryLight,
            borderRadius: 8
          }}>
            <span style={{ fontSize: '1.5em' }}>🎬</span>
            <div>
              <h3 style={{ margin: 0, color: colors.text }}>
                Live Demo - Slide {currentSlide + 1} of {presentationSlides.length}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: colors.textSecondary }}>
                {presentationSlides[currentSlide].title}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: colors.border, 
            borderRadius: 4,
            marginBottom: 16,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentSlide + 1) / presentationSlides.length) * 100}%`,
              height: '100%',
              background: colors.primary,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Timer Display */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 16,
            padding: '8px 16px',
            background: colors.cardBackground,
            borderRadius: 8,
            border: `1px solid ${colors.border}`
          }}>
            <span style={{ 
              fontSize: '1.2em', 
              fontWeight: 'bold', 
              color: colors.primary 
            }}>
              ⏱️ {presentationSlides[currentSlide].duration}s
            </span>
            <span style={{ 
              marginLeft: 12, 
              color: colors.textSecondary 
            }}>
              Total: {presentationSlides.reduce((sum, slide) => sum + slide.duration, 0)}s
            </span>
          </div>

          {/* Current Slide Info */}
          <div style={{ 
            padding: 20, 
            background: colors.cardBackground,
            borderRadius: 12,
            border: `2px solid ${colors.border}`,
            marginBottom: 16,
            boxShadow: colors.shadow
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              marginBottom: 16 
            }}>
              <div style={{ 
                fontSize: '2em', 
                background: colors.primary,
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {currentSlide + 1}
              </div>
              <div>
                <h4 style={{ margin: 0, color: colors.text, fontSize: '1.3em' }}>
                  {presentationSlides[currentSlide].title}
                </h4>
                <p style={{ margin: '4px 0 0 0', color: colors.textSecondary }}>
                  {presentationSlides[currentSlide].content}
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: colors.background,
              padding: 16,
              borderRadius: 8,
              border: `1px solid ${colors.border}`
            }}>
              <strong style={{ color: colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Key Points:
              </strong>
              <ul style={{ 
                margin: 0, 
                paddingLeft: 20, 
                color: colors.text,
                lineHeight: 1.6
              }}>
                {presentationSlides[currentSlide].keyPoints.map((point, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Demo Content */}
          <StreamingText 
            content={demoStreaming.content}
            loading={demoStreaming.loading}
            placeholder="Generating demo script..."
            style={{ minHeight: '300px' }}
          />

          {/* Demo Controls */}
          <div style={{ 
            marginTop: 16, 
            display: 'flex', 
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => speakText(demoStreaming.content)}
              disabled={isSpeaking || demoStreaming.loading}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                border: 'none',
                background: (isSpeaking || demoStreaming.loading) ? colors.border : colors.primary,
                color: '#fff',
                cursor: (isSpeaking || demoStreaming.loading) ? 'not-allowed' : 'pointer',
                fontSize: '1em'
              }}
            >
              {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Demo'}
            </button>
            <button
              onClick={stopSpeaking}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.cardBackground,
                color: colors.text,
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              🔇 Stop Speaking
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.cardBackground,
                color: colors.text,
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              🔄 End Demo
            </button>
          </div>

          {/* Presentation Status */}
          {isPresenting && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: 16,
              padding: '12px',
              background: colors.primaryLight,
              borderRadius: 8,
              border: `1px solid ${colors.primary}`
            }}>
              <span style={{ color: colors.primary, fontWeight: 'bold' }}>
                🎬 Live Presentation in Progress
              </span>
              <div style={{ 
                fontSize: '0.9em', 
                color: colors.textSecondary, 
                marginTop: 4 
              }}>
                Slide {currentSlide + 1} of {presentationSlides.length} • Auto-advancing
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {(scriptStreaming.error || qaStreaming.error || demoStreaming.error) && (
        <div style={{ 
          padding: 16, 
          background: '#ffebee', 
          color: '#c62828',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <strong>Error:</strong> {scriptStreaming.error || qaStreaming.error || demoStreaming.error}
          <button
            onClick={handleClear}
            style={{
              marginLeft: 12,
              padding: '4px 8px',
              borderRadius: 4,
              border: 'none',
              background: '#c62828',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default PresentationAgent; 