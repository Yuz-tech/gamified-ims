import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStage, setQuizStage] = useState(null); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [mandatoryResult, setMandatoryResult] = useState(null);
  const [bonusResults, setBonusResults] = useState(null);
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
      alert('Please confirm that you have reviewed the training materials.');
      return;
    }
    
    if (topic.isCompleted) {
      setQuizStage('review');
    } else {
      setQuizStage('mandatory');
      setSelectedAnswers({});
      setMandatoryResult(null);
      setBonusResults(null);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmitMandatory = async () => {
    if (selectedAnswers[0] === undefined) {
      alert('Please select an answer before submitting.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: selectedAnswers,
        stage: 'mandatory'
      });

      setMandatoryResult(response.data);

      if (response.data.passed && response.data.correctAnswer) {
        setTimeout(() => {
          setQuizStage('decision');
        }, 2000);
      } else {
        setTimeout(() => {
          setQuizStage(null);
          setSelectedAnswers({});
        }, 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting quiz');
    }
  };

  const handleContinueToBonus = () => {
    setQuizStage('bonus');
    const newAnswers = { 0: selectedAnswers[0] };
    setSelectedAnswers(newAnswers);
  };

  const handleFinishEarly = () => {
    navigate('/');
  };

  const handleSubmitBonus = async () => {
    if (!selectedAnswers[1] || !selectedAnswers[2] || !selectedAnswers[3] || !selectedAnswers[4]) {
      alert('Please answer all bonus questions before submitting.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: selectedAnswers,
        stage: 'bonus'
      });

      setBonusResults(response.data);

      await fetchTopic();

      setTimeout(() => {
        setQuizStage('review');
      }, 3000);
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
      {topic.isCompleted && !quizStage && (
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

      {/* Materials Section */}
      {!quizStage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            TRAINING MATERIALS
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '15px', lineHeight: '1.6' }}>
              Please review the training materials below before taking the quiz.
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
                IMS Manual Reference
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
                Open in new tab
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
                IMS Policy Video
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
                TIP: If video doesn't play, make sure the Google Drive link is set to "Anyone with the link can view"
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
                    <br />
                    ...and not lie to yourself.
                  </span>
                </span>
              </label>
            </div>
          )}
        </motion.div>
      )}

      {/* Quiz Section */}
      {!quizStage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            KNOWLEDGE CHECK
          </h3>

          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              {topic.isCompleted ? '✅' : '🎯'}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              {topic.isCompleted ? 'YOU PASSED THIS TOPIC!' : 'READY TO TEST YOUR KNOWLEDGE?'}
            </div>

            {/* XP Info */}
            <div style={{
              padding: '20px',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '2px solid var(--bright-blue)',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--primary-navy)', marginBottom: '15px', fontWeight: 'bold' }}>
                XP Reward System
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dark)', lineHeight: '1.8' }}>
                <strong>Step 1:</strong> Answer the mandatory question → Earn <strong style={{ color: 'var(--orange-accent)' }}>100 XP</strong> + Badge<br />
                <strong>Step 2:</strong> Choose to continue or finish<br />
                <strong>Step 3:</strong> Answer 4 bonus questions → Earn <strong style={{ color: 'var(--success-green)' }}>50 XP each</strong> (200 XP total)<br />
                <br />
                <strong>Total Possible:</strong> <span style={{ color: 'var(--bright-blue)', fontSize: '12px' }}>100-300 XP</span>
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
                Please confirm that you have reviewed the training materials above
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
                You passed! Click below to review all questions and explanations.
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
              {topic.isCompleted ? 'REVIEW ANSWERS' : materialsConfirmed ? 'START QUIZ' : 'CONFIRM MATERIALS FIRST'}
            </button>
          </div>
        </motion.div>
      )}

      {/* MANDATORY QUESTION */}
      {quizStage === 'mandatory' && !mandatoryResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            MANDATORY QUESTION (100 XP)
          </h3>

          <div style={{
            padding: '15px',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '2px solid var(--orange-accent)',
            marginBottom: '30px',
            fontSize: '10px',
            color: 'var(--text-dark)'
          }}>
            Answer this question correctly to pass and earn 100 XP + Badge!
          </div>

          <div style={{
            marginBottom: '30px',
            padding: '20px',
            border: '3px solid var(--orange-accent)',
            background: 'rgba(249, 115, 22, 0.05)'
          }}>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-dark)',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              {topic.questions[0].question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topic.questions[0].options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleAnswerSelect(0, oIndex)}
                  style={{
                    padding: '15px',
                    border: `3px solid ${
                      selectedAnswers[0] === oIndex 
                        ? 'var(--orange-accent)' 
                        : 'var(--border-color)'
                    }`,
                    background: selectedAnswers[0] === oIndex 
                      ? 'rgba(249, 115, 22, 0.1)' 
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '11px',
                    color: 'var(--text-dark)',
                    textAlign: 'left',
                    boxShadow: selectedAnswers[0] === oIndex 
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
                    border: `2px solid ${selectedAnswers[0] === oIndex ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                    marginRight: '10px',
                    textAlign: 'center',
                    lineHeight: '21px',
                    background: selectedAnswers[0] === oIndex ? 'var(--orange-accent)' : 'transparent',
                    color: selectedAnswers[0] === oIndex ? 'white' : 'var(--text-medium)'
                  }}>
                    {String.fromCharCode(65 + oIndex)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSubmitMandatory}
              className="retro-btn"
              style={{ flex: 1, padding: '15px', fontSize: '12px' }}
              disabled={selectedAnswers[0] === undefined}
            >
              SUBMIT ANSWER
            </button>
            <button
              onClick={() => setQuizStage(null)}
              className="retro-btn secondary"
              style={{ flex: 1, padding: '15px', fontSize: '12px' }}
            >
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      {/* MANDATORY RESULT */}
      {quizStage === 'mandatory' && mandatoryResult && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
        >
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>
              {mandatoryResult.correctAnswer ? '🎉' : '❌'}
            </div>
            <div style={{
              fontSize: '24px',
              color: mandatoryResult.correctAnswer ? 'var(--success-green)' : 'var(--error-red)',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              {mandatoryResult.correctAnswer ? 'CORRECT!' : 'INCORRECT'}
            </div>

            {mandatoryResult.correctAnswer ? (
              <>
                <div style={{
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid var(--success-green)',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--success-green)', marginBottom: '10px', fontWeight: 'bold' }}>
                    You earned 100 XP and unlocked a badge!
                  </div>
                  {mandatoryResult.badgeEarned && mandatoryResult.badgeImage && (
                    <img
                      src={mandatoryResult.badgeImage.startsWith('/uploads/') 
                        ? `http://localhost:5000${mandatoryResult.badgeImage}` //might change to actual server IP
                        : mandatoryResult.badgeImage}
                      alt={mandatoryResult.badgeEarned}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        margin: '10px auto'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
                  Proceeding to decision screen...
                </div>
              </>
            ) : (
              <>
                <div style={{
                  padding: '20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid var(--error-red)',
                  marginBottom: '20px',
                  fontSize: '11px'
                }}>
                  The correct answer was: <strong>{String.fromCharCode(65 + mandatoryResult.correctAnswerIndex)}</strong>
                  <br /><br />
                  Review the materials and try again!
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
                  Returning to topic screen...
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* DECISION SCREEN */}
      {quizStage === 'decision' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
        >
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              GREAT JOB!
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '30px', lineHeight: '1.6' }}>
              You've earned <strong>100 XP</strong> and unlocked the badge!<br />
              Would you like to continue for bonus questions?
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '20px',
                border: '3px solid var(--success-green)',
                background: 'rgba(16, 185, 129, 0.05)',
                cursor: 'pointer'
              }}
              onClick={handleContinueToBonus}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📚</div>
                <div style={{ fontSize: '12px', color: 'var(--success-green)', marginBottom: '10px', fontWeight: 'bold' }}>
                  CONTINUE QUIZ
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                  Answer 4 bonus questions<br />
                  Earn up to 200 more XP<br />
                  (50 XP per correct answer)
                </div>
              </div>

              <div style={{
                padding: '20px',
                border: '3px solid var(--bright-blue)',
                background: 'rgba(59, 130, 246, 0.05)',
                cursor: 'pointer'
              }}
              onClick={handleFinishEarly}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏠</div>
                <div style={{ fontSize: '12px', color: 'var(--bright-blue)', marginBottom: '10px', fontWeight: 'bold' }}>
                  FINISH NOW
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                  Keep your 100 XP + Badge<br />
                  Return to home screen<br />
                  You can review anytime
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* BONUS QUESTIONS */}
      {quizStage === 'bonus' && !bonusResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            💎 BONUS QUESTIONS (50 XP Each)
          </h3>

          <div style={{
            padding: '15px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid var(--success-green)',
            marginBottom: '30px',
            fontSize: '10px',
            color: 'var(--text-dark)'
          }}>
            💎 Each correct answer earns 50 XP. Answer all 4 to maximize your rewards!
          </div>

          {topic.questions.slice(1).map((question, qIndex) => {
            const actualIndex = qIndex + 1;
            return (
              <div
                key={actualIndex}
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
                  Bonus Question {qIndex + 1} of 4 (50 XP)
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
                      onClick={() => handleAnswerSelect(actualIndex, oIndex)}
                      style={{
                        padding: '15px',
                        border: `3px solid ${
                          selectedAnswers[actualIndex] === oIndex 
                            ? 'var(--bright-blue)' 
                            : 'var(--border-color)'
                        }`,
                        background: selectedAnswers[actualIndex] === oIndex 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontSize: '11px',
                        color: 'var(--text-dark)',
                        textAlign: 'left',
                        boxShadow: selectedAnswers[actualIndex] === oIndex 
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
                        border: `2px solid ${selectedAnswers[actualIndex] === oIndex ? 'var(--bright-blue)' : 'var(--border-color)'}`,
                        marginRight: '10px',
                        textAlign: 'center',
                        lineHeight: '21px',
                        background: selectedAnswers[actualIndex] === oIndex ? 'var(--bright-blue)' : 'transparent',
                        color: selectedAnswers[actualIndex] === oIndex ? 'white' : 'var(--text-medium)'
                      }}>
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleSubmitBonus}
            className="retro-btn"
            style={{ width: '100%', padding: '15px', fontSize: '12px' }}
            disabled={!selectedAnswers[1] || !selectedAnswers[2] || !selectedAnswers[3] || !selectedAnswers[4]}
          >
            SUBMIT BONUS QUESTIONS
          </button>
        </motion.div>
      )}

      {/* BONUS RESULTS */}
      {quizStage === 'bonus' && bonusResults && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
        >
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
            <div style={{
              fontSize: '24px',
              color: 'var(--success-green)',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              BONUS COMPLETE!
            </div>

            <div style={{
              fontSize: '48px',
              color: 'var(--bright-blue)',
              marginBottom: '20px'
            }}>
              {bonusResults.correctCount} / 4
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--success-green)',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--success-green)', marginBottom: '5px', fontWeight: 'bold' }}>
                Bonus XP Earned: +{bonusResults.xpEarned}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
                Total XP from this topic: {100 + bonusResults.xpEarned}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
              Loading review screen...
            </div>
          </div>
        </motion.div>
      )}

      {/* REVIEW MODE */}
      {quizStage === 'review' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            REVIEW: ALL ANSWERS & EXPLANATIONS
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
            ✅ Review all questions and their correct answers with explanations
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
                border: `3px solid ${qIndex === 0 ? 'var(--orange-accent)' : 'var(--bright-blue)'}`,
                background: 'white'
              }}
            >
              <div style={{
                fontSize: '11px',
                color: 'var(--text-medium)',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                {qIndex === 0 ? 'Mandatory Question (100 XP)' : `Bonus Question ${qIndex} (50 XP)`}
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
                          CORRECT
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
                    EXPLANATION
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

          <button
            onClick={handleReturnHome}
            className="retro-btn"
            style={{ width: '100%', padding: '15px 30px' }}
          >
            RETURN HOME
          </button>
        </motion.div>
      )}

      <style>{`
        .quiz-option:hover {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default TopicDetail;