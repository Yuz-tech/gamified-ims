import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      setTopic(response.data);
      setVideoWatched(response.data.isVideoWatched);
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = async () => {
    if (!videoWatched) {
      try {
        await api.post(`/topics/${topicId}/watch-video`);
        setVideoWatched(true);
        alert('Video completed! You can now take the quiz.');
      } catch (error) {
        console.error('Error marking video as watched:', error);
      }
    }
  };

  const handleStartQuiz = () => {
    if (!videoWatched) {
      alert('Please watch the video first before taking the quiz.');
      return;
    }
    setQuizStarted(true);
    setSelectedAnswers({});
    setQuizResults(null);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length !== topic.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: selectedAnswers
      });

      setQuizResults(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting quiz');
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING TOPIC...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error-red)' }}>Topic not found</h2>
        <button onClick={() => navigate('/topics')} className="retro-btn" style={{ marginTop: '20px' }}>
          ← BACK TO TOPICS
        </button>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: '30px' }}
      >
        <button onClick={() => navigate('/topics')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
          ← BACK TO TOPICS
        </button>

        <h1 className="neon-text" style={{ fontSize: '28px', marginBottom: '15px', color: 'var(--primary-navy)' }}>
          {topic.title}
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
          {topic.description}
        </p>
      </motion.div>

      {/* Completion Status */}
      {topic.isCompleted && !quizStarted && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '3px solid var(--success-green)',
            marginBottom: '30px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '14px', color: 'var(--success-green)', marginBottom: '10px', fontWeight: 'bold' }}>
            YOU HAVE COMPLETED THIS TOPIC
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
            You can review the content and quiz below
          </div>
        </motion.div>
      )}

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          TRAINING VIDEO
        </h3>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          background: 'var(--bg-dark)',
          border: '3px solid var(--bright-blue)',
          marginBottom: '15px'
        }}>
          <iframe
            src={topic.videoUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={topic.title}
            onLoad={() => {
              // Simulate video end for testing (remove in production)
              // In production, you'd track actual video completion
            }}
          />
        </div>

        {!videoWatched && (
          <div style={{
            padding: '15px',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '2px solid var(--orange-accent)',
            fontSize: '10px',
            color: 'var(--text-dark)',
            marginBottom: '10px'
          }}>
            You must watch the entire video before taking the quiz
          </div>
        )}

        <button
          onClick={handleVideoEnd}
          className="retro-btn"
          style={{ width: '100%' }}
          disabled={videoWatched}
        >
          {videoWatched ? 'VIDEO COMPLETED' : 'MARK VIDEO AS WATCHED'}
        </button>
      </motion.div>

      {/* Quiz Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          KNOWLEDGE CHECK QUIZ
        </h3>

        {!quizStarted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              {topic.isCompleted ? '📖' : '🎯'}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              {topic.isCompleted ? 'REVIEW THE QUIZ' : 'READY TO TEST YOUR KNOWLEDGE?'}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                padding: '15px',
                border: '2px solid var(--bright-blue)',
                background: 'rgba(59, 130, 246, 0.05)'
              }}>
                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>QUESTIONS</div>
                <div style={{ fontSize: '18px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                  {topic.questions.length}
                </div>
              </div>
              <div style={{
                padding: '15px',
                border: '2px solid var(--orange-accent)',
                background: 'rgba(249, 115, 22, 0.05)'
              }}>
                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>PASSING SCORE</div>
                <div style={{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
                  {topic.passingScore}%
                </div>
              </div>
              <div style={{
                padding: '15px',
                border: '2px solid var(--success-green)',
                background: 'rgba(16, 185, 129, 0.05)'
              }}>
                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>XP REWARD</div>
                <div style={{ fontSize: '18px', color: 'var(--success-green)', marginTop: '5px' }}>
                  {topic.xpReward}
                </div>
              </div>
            </div>
            <button
              onClick={handleStartQuiz}
              className="retro-btn"
              style={{ padding: '15px 30px', fontSize: '12px' }}
              disabled={!videoWatched}
            >
              {videoWatched ? (topic.isCompleted ? 'REVIEW QUIZ' : '🎮 START QUIZ') : '🔒 WATCH VIDEO FIRST'}
            </button>
          </div>
        ) : quizResults ? (
          // Results Screen
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px' }}
            >
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                {quizResults.passed ? '🎉' : '😔'}
              </div>
              <div style={{
                fontSize: '24px',
                color: quizResults.passed ? 'var(--success-green)' : 'var(--error-red)',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {quizResults.passed ? 'CONGRATULATIONS!' : 'NOT QUITE THERE'}
              </div>
              <div style={{ fontSize: '48px', color: 'var(--bright-blue)', marginBottom: '30px' }}>
                {quizResults.score}%
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <div style={{
                  padding: '15px',
                  border: '2px solid var(--bright-blue)',
                  background: 'rgba(59, 130, 246, 0.05)'
                }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>CORRECT ANSWERS</div>
                  <div style={{ fontSize: '18px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                    {quizResults.correctAnswers} / {quizResults.totalQuestions}
                  </div>
                </div>
                {quizResults.passed && (
                  <>
                    <div style={{
                      padding: '15px',
                      border: '2px solid var(--success-green)',
                      background: 'rgba(16, 185, 129, 0.05)'
                    }}>
                      <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>XP EARNED</div>
                      <div style={{ fontSize: '18px', color: 'var(--success-green)', marginTop: '5px' }}>
                        +{quizResults.xpEarned}
                      </div>
                    </div>
                    <div style={{
                      padding: '15px',
                      border: '2px solid var(--orange-accent)',
                      background: 'rgba(249, 115, 22, 0.05)'
                    }}>
                      <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>NEW LEVEL</div>
                      <div style={{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
                        {quizResults.newLevel}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {quizResults.passed && quizResults.badgeEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  style={{
                    padding: '20px',
                    border: '3px solid var(--orange-accent)',
                    background: 'rgba(249, 115, 22, 0.1)',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '15px', fontWeight: 'bold' }}>
                    BADGE UNLOCKED!
                  </div>
                  {quizResults.badgeImage && (
                    <img
                      src={quizResults.badgeImage.startsWith('/uploads/') 
                        ? `http://localhost:5000${quizResults.badgeImage}` 
                        : quizResults.badgeImage}
                      alt={quizResults.badgeEarned}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        imageRendering: 'pixelated',
                        marginBottom: '10px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<div style="font-size: 64px;">🏆</div>';
                      }}
                    />
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--primary-navy)' }}>
                    {quizResults.badgeEarned}
                  </div>
                </motion.div>
              )}

              {!quizResults.passed && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid var(--error-red)',
                  marginBottom: '20px',
                  fontSize: '10px',
                  color: 'var(--text-dark)'
                }}>
                  You need {quizResults.requiredScore}% to pass. Review the video and try again!
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!quizResults.passed && (
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizResults(null);
                      setSelectedAnswers({});
                    }}
                    className="retro-btn"
                  >
                    TRY AGAIN
                  </button>
                )}
                <button onClick={handleReturnHome} className="retro-btn secondary">
                  RETURN HOME
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          // Quiz Questions
          <div>
            <div style={{
              padding: '15px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid var(--bright-blue)',
              marginBottom: '30px',
              fontSize: '10px',
              color: 'var(--text-dark)'
            }}>
              You need {topic.passingScore}% to pass.
            </div>

            {topic.questions.map((question, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: qIndex * 0.1 }}
                style={{
                  marginBottom: '30px',
                  padding: '20px',
                  border: '3px solid var(--border-color)',
                  background: 'var(--bg-light)'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  color: 'var(--primary-navy)',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}>
                  Question {qIndex + 1} of {topic.questions.length}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-dark)',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {question.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      style={{
                        padding: '15px',
                        border: `3px solid ${
                          selectedAnswers[qIndex] === oIndex 
                            ? 'var(--bright-blue)' 
                            : 'var(--border-color)'
                        }`,
                        background: selectedAnswers[qIndex] === oIndex 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontSize: '11px',
                        color: 'var(--text-dark)',
                        textAlign: 'left',
                        boxShadow: selectedAnswers[qIndex] === oIndex 
                          ? '3px 3px 0 var(--primary-navy)' 
                          : 'none'
                      }}
                      className="quiz-option"
                    >
                      <span style={{
                        display: 'inline-block',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: `2px solid ${selectedAnswers[qIndex] === oIndex ? 'var(--bright-blue)' : 'var(--border-color)'}`,
                        marginRight: '10px',
                        textAlign: 'center',
                        lineHeight: '21px',
                        background: selectedAnswers[qIndex] === oIndex ? 'var(--bright-blue)' : 'transparent',
                        color: selectedAnswers[qIndex] === oIndex ? 'white' : 'var(--text-medium)'
                      }}>
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button
                onClick={handleSubmitQuiz}
                className="retro-btn"
                style={{ flex: 1, padding: '15px', fontSize: '12px' }}
                disabled={Object.keys(selectedAnswers).length !== topic.questions.length}
              >
                SUBMIT QUIZ
              </button>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setSelectedAnswers({});
                }}
                className="retro-btn secondary"
                style={{ flex: 1, padding: '15px', fontSize: '12px' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .quiz-option:hover {
          transform: translateX(5px);
          border-color: var(--bright-blue) !important;
        }
      `}</style>
    </div>
  );
};

export default TopicDetail;