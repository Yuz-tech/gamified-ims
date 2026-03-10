import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(null); 
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [bonusAnswers, setBonusAnswers] = useState({});
  const [mandatoryResult, setMandatoryResult] = useState(null);
  const [bonusResult, setBonusResult] = useState(null);
  const [materialsConfirmed, setMaterialsConfirmed] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      setTopic(response.data);
      if (response.data.mandatoryCompleted) {
        setMaterialsConfirmed(true);
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMandatory = () => {
    if (!materialsConfirmed && !topic.mandatoryCompleted) {
      alert('Please confirm that you have reviewed the training materials.');
      return;
    }
    setCurrentStage('mandatory');
    setSelectedAnswer(null);
    setMandatoryResult(null);
  };

  const handleStartBonus = () => {
    setCurrentStage('bonus');
    setBonusAnswers({});
    setBonusResult(null);
  };

  const handleStartReview = () => {
    setCurrentStage('review');
  };

  const handleSubmitMandatory = async () => {
    if (selectedAnswer === null) {
      alert('Please select an answer.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-mandatory`, {
        answer: selectedAnswer
      });

      setMandatoryResult(response.data);

      if (response.data.passed && response.data.correctAnswer) {
        // Passed - refresh topic data
        await fetchTopic();
        
        // Show success for 5 seconds
        setTimeout(() => {
          setCurrentStage(null);
        }, 5000);
      } else {
        // Failed - show error for 3 seconds then reset
        setTimeout(() => {
          setCurrentStage(null);
          setSelectedAnswer(null);
          setMandatoryResult(null);
        }, 5000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting answer');
    }
  };

  const handleSubmitBonus = async () => {
    // Check all 4 bonus questions answered
    if (Object.keys(bonusAnswers).length < 4) {
      alert('Please answer all 4 bonus questions.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-bonus`, {
        answers: bonusAnswers
      });

      setBonusResult(response.data);
      
      // Refresh topic
      await fetchTopic();

      // Show results for 5 seconds then return home
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting bonus');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error-red)' }}>Topic not found</h2>
        <button onClick={() => navigate('/topics')} className="retro-btn" style={{ marginTop: '20px' }}>
          BACK TO TOPICS
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
          BACK TO TOPICS
        </button>

        <h1 className="neon-text" style={{ fontSize: '28px', marginBottom: '15px', color: 'var(--primary-navy)' }}>
          {topic.title}
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
          {topic.description}
        </p>
      </motion.div>

      {/* Completion Status */}
      {topic.mandatoryCompleted && !currentStage && (
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
            MANDATORY QUESTION COMPLETED
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
            You earned 100 XP and a badge! {!topic.bonusCompleted && 'You can still take bonus questions for extra XP.'}
          </div>
        </motion.div>
      )}

      {/* Training Materials */}
      {!currentStage && (
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
              Review the training materials before taking the quiz.
            </p>

            {/* Document */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', fontWeight: 'bold' }}>
                IMS Reference Manual
              </label>
              <a
                href={topic.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Open Reference
              </a>
            </div>

            {/* Video */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', fontWeight: 'bold' }}>
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
            </div>
          </div>

          {/* Confirmation */}
          {!topic.mandatoryCompleted && (
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
                fontSize: '11px'
              }}>
                <input
                  type="checkbox"
                  checked={materialsConfirmed}
                  onChange={(e) => setMaterialsConfirmed(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>
                  <strong>I confirm that I have reviewed the training materials.</strong>
                </span>
              </label>
            </div>
          )}
        </motion.div>
      )}

      {/* Quiz Options */}
      {!currentStage && (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Mandatory Question */}
          {!topic.mandatoryCompleted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="retro-card"
              style={{ background: 'rgba(249, 115, 22, 0.05)', borderColor: 'var(--orange-accent)' }}
            >
              <h3 style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '20px' }}>
                MANDATORY QUESTION
              </h3>

              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
                  Answer the question correctly to earn <strong>100 XP</strong> and unlock a badge!
                </div>

                <button
                  onClick={handleStartMandatory}
                  className="retro-btn"
                  style={{
                    width: '100%',
                    opacity: materialsConfirmed ? 1 : 0.5,
                    cursor: materialsConfirmed ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!materialsConfirmed}
                >
                  {materialsConfirmed ? 'START QUIZ' : 'CONFIRM MATERIALS FIRST'}
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Bonus Questions */}
              {!topic.bonusCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="retro-card"
                  style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'var(--bright-blue)' }}
                >
                  <h3 style={{ fontSize: '14px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
                    💎 BONUS QUESTIONS
                  </h3>

                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
                      Answer 4 bonus questions. Each correct answer earns <strong>50 XP</strong> (up to 200 XP total).
                    </div>

                    <button onClick={handleStartBonus} className="retro-btn" style={{ width: '100%' }}>
                      START BONUS
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Review */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="retro-card"
                style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--success-green)' }}
              >
                <h3 style={{ fontSize: '14px', color: 'var(--success-green)', marginBottom: '20px' }}>
                  REVIEW ANSWERS
                </h3>

                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Review the {topic.bonusCompleted ? 'mandatory and bonus' : 'mandatory'} questions with explanations.
                  </div>

                  <button onClick={handleStartReview} className="retro-btn" style={{ width: '100%' }}>
                    REVIEW
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {/* Next Topic */}
          {topic.mandatoryCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="retro-card"
            >
              <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                NEXT TOPIC
              </h3>

              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
                  Continue with the next training topic.
                </div>

                <button onClick={() => navigate('/topics')} className="retro-btn" style={{ width: '100%' }}>
                  VIEW TOPICS
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* MANDATORY QUESTION STAGE */}
      {currentStage === 'mandatory' && !mandatoryResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '20px' }}>
            MANDATORY QUESTION (100 XP)
          </h3>

          <div style={{
            marginBottom: '30px',
            padding: '20px',
            border: '3px solid var(--orange-accent)',
            background: 'rgba(249, 115, 22, 0.05)'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: '20px', fontWeight: 'bold' }}>
              {topic.questions[0].question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topic.questions[0].options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => setSelectedAnswer(oIndex)}
                  style={{
                    padding: '15px',
                    border: `3px solid ${selectedAnswer === oIndex ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                    background: selectedAnswer === oIndex ? 'rgba(249, 115, 22, 0.1)' : 'white',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textAlign: 'left',
                    transition: 'all 0.3s'
                  }}
                  className="quiz-option"
                >
                  <span style={{
                    display: 'inline-block',
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-color)',
                    marginRight: '10px',
                    textAlign: 'center',
                    lineHeight: '21px',
                    background: selectedAnswer === oIndex ? 'var(--orange-accent)' : 'transparent',
                    color: selectedAnswer === oIndex ? 'white' : 'var(--text-medium)'
                  }}>
                    {String.fromCharCode(65 + oIndex)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSubmitMandatory} className="retro-btn" style={{ flex: 1 }} disabled={selectedAnswer === null}>
              SUBMIT
            </button>
            <button onClick={() => setCurrentStage(null)} className="retro-btn secondary" style={{ flex: 1 }}>
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      {/* MANDATORY RESULT */}
      {currentStage === 'mandatory' && mandatoryResult && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
        >
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>
              {mandatoryResult.correctAnswer ? '🎉' : '❌'}
            </div>
            <div style={{
              fontSize: '24px',
              color: mandatoryResult.correctAnswer ? 'var(--success-green)' : 'var(--error-red)',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              {mandatoryResult.correctAnswer ? 'CORRECT!' : 'INCORRECT!'}
            </div>

            {mandatoryResult.correctAnswer ? (
              <div style={{
                padding: '20px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid var(--success-green)'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                  You earned <strong>100 XP</strong> and unlocked a badge!
                </div>
                {mandatoryResult.badgeImage && (
                  <img
                    src={mandatoryResult.badgeImage.startsWith('/uploads/') 
                      ? `http://localhost:5000${mandatoryResult.badgeImage}` 
                      : mandatoryResult.badgeImage}
                    alt="Badge"
                    style={{ width: '80px', height: '80px', margin: '10px auto' }}
                  />
                )}
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid var(--error-red)',
                fontSize: '11px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  The correct answer was: <strong>{String.fromCharCode(65 + mandatoryResult.correctAnswerIndex)}</strong>
                </div>
                {mandatoryResult.explanation && (
                  <div style={{ marginTop: '10px', fontSize: '10px', lineHeight: '1.6' }}>
                    {mandatoryResult.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* BONUS QUESTIONS STAGE */}
      {currentStage === 'bonus' && !bonusResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
            💎 BONUS QUESTIONS (50 XP Each)
          </h3>

          {topic.questions.slice(1).map((question, qIndex) => (
            <div
              key={qIndex}
              style={{
                marginBottom: '30px',
                padding: '20px',
                border: '3px solid var(--border-color)',
                background: 'var(--bg-light)'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--primary-navy)', marginBottom: '15px', fontWeight: 'bold' }}>
                Bonus Question {qIndex + 1} of 4 (50 XP)
              </div>
              <div style={{ fontSize: '13px', marginBottom: '20px' }}>
                {question.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => setBonusAnswers({ ...bonusAnswers, [qIndex + 1]: oIndex })}
                    style={{
                      padding: '15px',
                      border: `3px solid ${bonusAnswers[qIndex + 1] === oIndex ? 'var(--bright-blue)' : 'var(--border-color)'}`,
                      background: bonusAnswers[qIndex + 1] === oIndex ? 'rgba(59, 130, 246, 0.1)' : 'white',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textAlign: 'left'
                    }}
                    className="quiz-option"
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      border: '2px solid var(--border-color)',
                      marginRight: '10px',
                      textAlign: 'center',
                      lineHeight: '21px',
                      background: bonusAnswers[qIndex + 1] === oIndex ? 'var(--bright-blue)' : 'transparent',
                      color: bonusAnswers[qIndex + 1] === oIndex ? 'white' : 'var(--text-medium)'
                    }}>
                      {String.fromCharCode(65 + oIndex)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitBonus}
            className="retro-btn"
            style={{ width: '100%' }}
            disabled={Object.keys(bonusAnswers).length < 4}
          >
            ✓ SUBMIT BONUS
          </button>
        </motion.div>
      )}

      {/* BONUS RESULT */}
      {currentStage === 'bonus' && bonusResult && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
        >
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
            <div style={{ fontSize: '24px', color: 'var(--success-green)', marginBottom: '20px', fontWeight: 'bold' }}>
              BONUS COMPLETE!
            </div>

            <div style={{ fontSize: '48px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
              {bonusResult.correctCount} / 4
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--success-green)'
            }}>
              <div style={{ fontSize: '12px' }}>
                Bonus XP Earned: <strong>+{bonusResult.xpEarned}</strong>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* REVIEW MODE */}
      {currentStage === 'review' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            REVIEW: CORRECT ANSWERS & EXPLANATIONS
          </h3>

          {topic.questions.slice(0, topic.bonusCompleted ? 5 : 1).map((question, qIndex) => (
            <div
              key={qIndex}
              style={{
                marginBottom: '25px',
                padding: '20px',
                border: `3px solid ${qIndex === 0 ? 'var(--orange-accent)' : 'var(--bright-blue)'}`,
                background: 'white'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-medium)', marginBottom: '15px', fontWeight: 'bold' }}>
                {qIndex === 0 ? 'Mandatory Question (100 XP)' : `Bonus Question ${qIndex} (50 XP)`}
              </div>

              <div style={{ fontSize: '13px', marginBottom: '20px', fontWeight: 'bold' }}>
                {question.question}
              </div>

              <div style={{ marginBottom: '15px' }}>
                {question.options.map((option, oIndex) => {
                  const isCorrect = question.correctAnswer === oIndex;
                  return (
                    <div
                      key={oIndex}
                      style={{
                        padding: '12px 15px',
                        marginBottom: '10px',
                        border: `2px solid ${isCorrect ? 'var(--success-green)' : 'var(--border-color)'}`,
                        background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '11px'
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
                        background: isCorrect ? 'var(--success-green)' : 'transparent',
                        color: isCorrect ? 'white' : 'var(--text-medium)'
                      }}>
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span style={{ flex: 1 }}>{option}</span>
                      {isCorrect && <span style={{ fontSize: '9px', color: 'var(--success-green)', fontWeight: 'bold' }}>✓ CORRECT</span>}
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
                  <div style={{ fontSize: '9px', color: 'var(--bright-blue)', marginBottom: '8px', fontWeight: 'bold' }}>
                    EXPLANATION
                  </div>
                  <div style={{ fontSize: '10px', lineHeight: '1.6' }}>
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={() => setCurrentStage(null)} className="retro-btn" style={{ width: '100%' }}>
            BACK
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