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
  const [showReview, setShowReview] = useState(false);
  const [materialsConfirmed, setMaterialsConfirmed] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      setTopic(response.data);
      if (response.data.isCompleted) {
        setMaterialsConfirmed(true);
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!materialsConfirmed && !topic.isCompleted) {
      alert('⚠️ Please confirm that you have reviewed the training materials.');
      return;
    }
    
    // If already completed, go straight to review
    if (topic.isCompleted) {
      setShowReview(true);
    } else {
      setQuizStarted(true);
      setSelectedAnswers({});
      setQuizResults(null);
      setShowReview(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length !== topic.questions.length) {
      alert('⚠️ Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: selectedAnswers
      });

      setQuizResults(response.data);
      
      // If passed, immediately show review
      if (response.data.passed) {
        setTimeout(() => {
          setShowReview(true);
        }, 3000); // Show results for 3 seconds, then auto-show review
      }
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
      {topic.isCompleted && !quizStarted && !showReview && (
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
            Click below to review the correct answers and explanations
          </div>
        </motion.div>
      )}

      {/* Training Materials Section */}
      {!quizStarted && !showReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            📋 TRAINING MATERIALS
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '15px', lineHeight: '1.6' }}>
              Please review the training materials below before taking the quiz. You will need this knowledge to pass.
            </p>

            {/* Document Link */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '10px',
                color: 'var(--text-medium)',
                fontWeight: 'bold'
              }}>
                📄 TRAINING DOCUMENT
              </label>
              <a
                href={topic.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'var(--bright-blue)',
                  borderColor: 'var(--primary-navy)'
                }}
              >
                📄 OPEN IN NEW TAB
              </a>
            </div>

            {/* Embedded Video */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '10px',
                color: 'var(--text-medium)',
                fontWeight: 'bold'
              }}>
                📺 TRAINING VIDEO
              </label>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                background: 'var(--bg-dark)',
                border: '3px solid var(--orange-accent)',
                marginBottom: '10px'
              }}>
                <iframe
                  src={topic.videoUrl.replace('/view', '/preview')}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                  frameBorder="0"
                  allow="autoplay"
                  allowFullScreen
                  title={topic.title}
                />
              </div>
              <div style={{
                fontSize: '8px',
                color: 'var(--text-light)',
                padding: '10px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid var(--bright-blue)'
              }}>
                💡 TIP: If video doesn't play, make sure the Google Drive link is set to "Anyone with the link can view"
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          {!topic.isCompleted && (
            <div style={{
              padding: '20px',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '2px solid var(--bright-blue)',
              marginTop: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'var(--text-dark)'
              }}>
                <input
                  type="checkbox"
                  checked={materialsConfirmed}
                  onChange={(e) => setMaterialsConfirmed(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span>
                  <strong>I confirm that I have reviewed the training document and watched the training video.</strong>
                  <br />
                  <span style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                    By checking this box, you acknowledge that you have completed the required training materials.
                  </span>
                </span>
              </label>
            </div>
          )}
        </motion.div>
      )}

      {/* Quiz Section */}
      {!showReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            📝 KNOWLEDGE CHECK QUIZ
          </h3>

          {!quizStarted && !quizResults ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                {topic.isCompleted ? '✅' : '🎯'}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                {topic.isCompleted ? 'YOU PASSED THIS TOPIC!' : 'READY TO TEST YOUR KNOWLEDGE?'}
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
                    100-150
                  </div>
                </div>
              </div>

              {!materialsConfirmed && !topic.isCompleted && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid var(--error-red)',
                  marginBottom: '20px',
                  fontSize: '10px',
                  color: 'var(--text-dark)'
                }}>
                  ⚠️ Please confirm that you have reviewed the training materials above
                </div>
              )}

              {topic.isCompleted && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid var(--success-green)',
                  marginBottom: '20px',
                  fontSize: '11px',
                  color: 'var(--text-dark)',
                  textAlign: 'center'
                }}>
                  ✅ You passed this topic! Click below to review the correct answers and explanations.
                </div>
              )}

              <button
                onClick={handleStartQuiz}
                className="retro-btn"
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '12px',
                  opacity: (materialsConfirmed || topic.isCompleted) ? 1 : 0.5,
                  cursor: (materialsConfirmed || topic.isCompleted) ? 'pointer' : 'not-allowed'
                }}
                disabled={!materialsConfirmed && !topic.isCompleted}
              >
                {topic.isCompleted ? '📖 VIEW ANSWERS & EXPLANATIONS' : materialsConfirmed ? '🎮 START QUIZ' : '🔒 CONFIRM MATERIALS FIRST'}
              </button>
            </div>
          ) : quizResults ? (
            // Results Screen
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ padding: '20px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                    {quizResults.passed && quizResults.xpEarned && (
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
                        marginBottom: '30px'
                      }}
                    >
                      <div style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '15px', fontWeight: 'bold' }}>
                        🏆 BADGE UNLOCKED!
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

                  {quizResults.passed && (
                    <div style={{
                      padding: '15px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '2px solid var(--success-green)',
                      marginBottom: '20px',
                      fontSize: '11px',
                      color: 'var(--text-dark)'
                    }}>
                      ✅ Loading review in 3 seconds...
                    </div>
                  )}

                  {!quizResults.passed && (
                    <div style={{
                      padding: '15px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '2px solid var(--error-red)',
                      marginBottom: '20px',
                      fontSize: '11px',
                      color: 'var(--text-dark)'
                    }}>
                      You need {quizResults.requiredScore}% to pass. Review the training materials and try again!
                    </div>
                  )}
                </div>

                {!quizResults.passed && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setQuizStarted(false);
                        setQuizResults(null);
                        setSelectedAnswers({});
                      }}
                      className="retro-btn"
                      style={{ padding: '15px 30px' }}
                    >
                      🔄 TRY AGAIN
                    </button>
                    <button
                      onClick={handleReturnHome}
                      className="retro-btn secondary"
                      style={{ padding: '15px 30px' }}
                    >
                      🏠 RETURN HOME
                    </button>
                  </div>
                )}
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
                ℹ️ Select the best answer for each question. You need {topic.passingScore}% to pass. Higher scores earn more XP!
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
                  ✓ SUBMIT QUIZ
                </button>
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setSelectedAnswers({});
                  }}
                  className="retro-btn secondary"
                  style={{ flex: 1, padding: '15px', fontSize: '12px' }}
                >
                  ✖ CANCEL
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Review Mode - Show Correct Answers with Explanations */}
      {showReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            📖 REVIEW: CORRECT ANSWERS & EXPLANATIONS
          </h3>

          <div style={{
            padding: '15px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid var(--success-green)',
            marginBottom: '30px',
            fontSize: '11px',
            color: 'var(--text-dark)',
            textAlign: 'center'
          }}>
            ✅ Review the correct answers and explanations below
          </div>

          {topic.questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: qIndex * 0.1 }}
              style={{
                marginBottom: '25px',
                padding: '20px',
                border: '3px solid var(--bright-blue)',
                background: 'white'
              }}
            >
              <div style={{
                fontSize: '11px',
                color: 'var(--text-medium)',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                Question {qIndex + 1} of {topic.questions.length}
              </div>

              <div style={{
                fontSize: '13px',
                color: 'var(--text-dark)',
                marginBottom: '20px',
                fontWeight: 'bold'
              }}>
                {question.question}
              </div>

              <div style={{ marginBottom: '15px' }}>
                {question.options.map((option, oIndex) => {
                  const isCorrectAnswer = question.correctAnswer === oIndex;

                  return (
                    <div
                      key={oIndex}
                      style={{
                        padding: '12px 15px',
                        marginBottom: '10px',
                        border: `2px solid ${isCorrectAnswer ? 'var(--success-green)' : 'var(--border-color)'}`,
                        background: isCorrectAnswer ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '11px',
                        color: 'var(--text-dark)'
                      }}
                    >
                      <span style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        background: isCorrectAnswer ? 'var(--success-green)' : 'transparent',
                        color: isCorrectAnswer ? 'white' : 'var(--text-medium)',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span style={{ flex: 1 }}>{option}</span>
                      {isCorrectAnswer && (
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 'bold',
                          color: 'var(--success-green)',
                          whiteSpace: 'nowrap'
                        }}>
                          ✓ CORRECT ANSWER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '2px solid var(--bright-blue)',
                  borderLeft: '5px solid var(--bright-blue)'
                }}>
                  <div style={{
                    fontSize: '9px',
                    color: 'var(--bright-blue)',
                    marginBottom: '8px',
                    fontWeight: 'bold'
                  }}>
                    💡 EXPLANATION
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--text-dark)',
                    lineHeight: '1.6'
                  }}>
                    {question.explanation}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'center' }}>
            <button
              onClick={handleReturnHome}
              className="retro-btn"
              style={{ padding: '15px 30px' }}
            >
              🏠 RETURN HOME
            </button>
          </div>
        </motion.div>
      )}

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