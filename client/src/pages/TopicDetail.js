import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoWatched, setVideoWatched] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      setTopic(response.data);
      setVideoWatched(response.data.isVideoWatched);
      
      // Initialize answers
      const initialAnswers = {};
      response.data.questions.forEach((_, index) => {
        initialAnswers[index] = null;
      });
      setAnswers(initialAnswers);
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
      } catch (error) {
        console.error('Error marking video as watched:', error);
      }
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const allAnswered = Object.keys(answers).every(key => answers[key] !== null);
    
    if (!allAnswered) {
      alert('Please answer all questions before submitting!');
      return;
    }

    setSubmitting(true);

    try {
      const answerArray = Object.keys(answers).map(key => answers[key]);
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: answerArray
      });

      setResult(response.data);

      // Refresh user data if passed
      if (response.data.passed) {
        const userResponse = await api.get('/auth/me');
        updateUser(userResponse.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className="loading neon-text">LOADING TOPIC...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '14px', color: 'var(--neon-red)' }}>
            TOPIC NOT FOUND
          </div>
        </div>
      </div>
    );
  }

  if (topic.isCompleted) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <div className="scanlines"></div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="retro-card pixel-corners"
          style={{ textAlign: 'center', padding: '60px' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
          <h1 className="neon-text" style={{ 
            fontSize: '24px', 
            marginBottom: '20px',
            color: 'var(--neon-yellow)'
          }}>
            ALREADY COMPLETED!
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--neon-cyan)', marginBottom: '30px' }}>
            You've already mastered this topic!
          </p>
          <button
            onClick={() => navigate('/topics')}
            className="retro-btn"
          >
            BACK TO TOPICS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <button
        onClick={() => navigate('/topics')}
        className="retro-btn secondary"
        style={{ marginBottom: '20px' }}
      >
        ← BACK TO TOPICS
      </button>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="retro-card pixel-corners"
      >
        <h1 className="neon-text" style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          color: 'var(--neon-yellow)'
        }}>
          {topic.title}
        </h1>

        <p style={{ 
          fontSize: '12px', 
          color: 'var(--neon-cyan)',
          marginBottom: '30px',
          lineHeight: '1.8'
        }}>
          {topic.description}
        </p>

        {/* Video Section */}
        {!showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{
              background: 'var(--darker-bg)',
              border: '3px solid var(--neon-green)',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '14px',
                color: 'var(--neon-pink)',
                marginBottom: '20px'
              }}>
                📺 TRAINING VIDEO
              </h3>

              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                background: 'var(--dark-bg)',
                border: '2px solid var(--neon-cyan)'
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
                />
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: videoWatched 
                  ? 'rgba(0, 255, 0, 0.1)' 
                  : 'rgba(255, 255, 0, 0.1)',
                border: `2px solid ${videoWatched ? 'var(--neon-green)' : 'var(--neon-yellow)'}`,
                textAlign: 'center',
                fontSize: '10px',
                color: videoWatched ? 'var(--neon-green)' : 'var(--neon-yellow)'
              }}>
                {videoWatched 
                  ? '✓ VIDEO WATCHED - QUIZ UNLOCKED!' 
                  : '⚠️ WATCH THE FULL VIDEO TO UNLOCK THE QUIZ'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleVideoEnd}
                className="retro-btn secondary"
                disabled={videoWatched}
              >
                {videoWatched ? '✓ VIDEO WATCHED' : 'MARK AS WATCHED'}
              </button>

              <button
                onClick={() => setShowQuiz(true)}
                className="retro-btn"
                disabled={!videoWatched}
              >
                🎯 START QUIZ
              </button>
            </div>
          </motion.div>
        )}

        {/* Quiz Section */}
        {showQuiz && !result && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div style={{
              background: 'var(--darker-bg)',
              border: '3px solid var(--neon-cyan)',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '14px',
                color: 'var(--neon-pink)',
                marginBottom: '20px'
              }}>
                🎯 QUIZ - {topic.questions.length} QUESTIONS
              </h3>

              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 0, 0.1)',
                border: '2px solid var(--neon-yellow)',
                marginBottom: '30px',
                fontSize: '10px',
                color: 'var(--neon-yellow)'
              }}>
                ⚠️ PASSING SCORE: {topic.passingScore}% | XP REWARD: {topic.xpReward}
              </div>

              {topic.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    marginBottom: '30px',
                    padding: '20px',
                    border: '2px solid var(--neon-green)',
                    background: 'rgba(0, 255, 0, 0.05)'
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--neon-cyan)',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    <strong>Q{qIndex + 1}.</strong> {question.question}
                  </div>

                  <div style={{ display: 'grid', gap: '10px' }}>
                    {question.options.map((option, oIndex) => (
                      <motion.div
                        key={oIndex}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        style={{
                          padding: '15px',
                          border: `2px solid ${
                            answers[qIndex] === oIndex 
                              ? 'var(--neon-cyan)' 
                              : 'var(--neon-green)'
                          }`,
                          background: answers[qIndex] === oIndex 
                            ? 'rgba(0, 255, 255, 0.2)' 
                            : 'transparent',
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: answers[qIndex] === oIndex 
                            ? 'var(--neon-cyan)' 
                            : 'var(--neon-green)',
                          transition: 'all 0.3s',
                          boxShadow: answers[qIndex] === oIndex 
                            ? '0 0 20px rgba(0, 255, 255, 0.5)' 
                            : 'none'
                        }}
                      >
                        {answers[qIndex] === oIndex && '✓ '}{option}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowQuiz(false)}
                className="retro-btn secondary"
                disabled={submitting}
              >
                ← BACK TO VIDEO
              </button>

              <button
                onClick={handleSubmitQuiz}
                className="retro-btn"
                disabled={submitting}
              >
                {submitting ? 'SUBMITTING...' : '🚀 SUBMIT QUIZ'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px'
              }}
            >
              <div className="retro-card pixel-corners" style={{
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                  {result.passed ? '🎉' : '😞'}
                </div>

                <h2 className="neon-text" style={{
                  fontSize: '28px',
                  marginBottom: '20px',
                  color: result.passed ? 'var(--neon-green)' : 'var(--neon-red)'
                }}>
                  {result.passed ? 'CONGRATULATIONS!' : 'TRY AGAIN'}
                </h2>

                <div style={{
                  fontSize: '48px',
                  color: result.passed ? 'var(--neon-cyan)' : 'var(--neon-yellow)',
                  marginBottom: '20px'
                }}>
                  {result.score}%
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--neon-green)',
                  marginBottom: '30px'
                }}>
                  {result.correctAnswers} / {result.totalQuestions} CORRECT
                </div>

                {result.passed && (
                  <div style={{
                    padding: '20px',
                    border: '2px solid var(--neon-yellow)',
                    background: 'rgba(255, 255, 0, 0.1)',
                    marginBottom: '30px'
                  }}>
                    <div style={{ fontSize: '10px', color: 'var(--neon-yellow)' }}>
                      ⭐ XP EARNED: +{result.xpEarned}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--neon-cyan)', marginTop: '10px' }}>
                      🆙 NEW LEVEL: {result.newLevel}
                    </div>
                    {result.badgeEarned && (
                      <div style={{ fontSize: '10px', color: 'var(--neon-pink)', marginTop: '10px' }}>
                        🏆 BADGE EARNED: {result.badgeEarned}
                      </div>
                    )}
                    {result.allBadgesCollected && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: 'var(--neon-green)', 
                        marginTop: '10px',
                        fontWeight: 'bold'
                      }}>
                        🎊 ALL BADGES COLLECTED! 🎊
                      </div>
                    )}
                  </div>
                )}

                {!result.passed && (
                  <div style={{
                    padding: '20px',
                    border: '2px solid var(--neon-red)',
                    background: 'rgba(255, 0, 0, 0.1)',
                    marginBottom: '30px',
                    fontSize: '10px',
                    color: 'var(--neon-red)'
                  }}>
                    REQUIRED SCORE: {result.requiredScore}%
                    <br />
                    WATCH THE VIDEO AGAIN AND RETAKE THE QUIZ
                  </div>
                )}

                <button
                  onClick={() => {
                    if (result.passed) {
                      navigate('/topics');
                    } else {
                      setResult(null);
                      setShowQuiz(false);
                      window.location.reload();
                    }
                  }}
                  className="retro-btn"
                  style={{ width: '100%' }}
                >
                  {result.passed ? '🎮 CONTINUE' : '🔄 TRY AGAIN'}
                </button>

                {result.allBadgesCollected && result.congratsLink && (
                    <a
                        href={result.congratsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', marginTop: '20px' }}
                    >
                        <button className="retro-btn secondary" style={{ width: '100%' }}>
                        🎁 CLAIM YOUR REWARD
                        </button>
                    </a>
                    )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TopicDetail;