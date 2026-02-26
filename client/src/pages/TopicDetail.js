import React, { useState, useEffect } from "react";
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
  const [materialsConfirmed, setMaterialsConfirmed] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const fetchTopic = async() => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      setTopic(response.data);
      if(response.data.isCompleted) {
        setMaterialsConfirmed(true);
      }
    } catch(error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if(!materialsConfirmed) {
      alert('Please confirm that you have reviewed the training materials.');
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
    if(Object.keys(selectedAnswers).length !== topic.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await api.post(`/topics/${topicId}/submit-quiz`, {
        answers: selectedAnswers
      });

      setQuizResults(response.data);
    } catch(error) {
      alert(error.response?.data?.message || 'Error submitting quiz');
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if(loading) {
    return (
      <div style = {{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div className = "loading neon-text">
          Loading Topic...
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className = "retro-container" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error-red)' }}>Topic not found</h2>
        <button onClick={() => 
          navigate('/topics')} className="retro-btn"
          style = {{ marginTop: '20px' }}>
            Back to Topics
          </button>
      </div>
    );
  }

  return (
    <div className = "retro-container" style = {{ paddingTop: '40px' }}>
      <div className = "scanlines"></div>

      {/*Header*/}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style = {{ marginBottom: '30px' }}
      >
        <button onClick={() => navigate('/topics')} className="retro-btn secondary"
         style={{ marginBottom: '20px' }}>
          Back to Topics
         </button>

         <h1 className="neon-text" style={{ fontSize: '28px', marginBottom: '15px', color: 'var(--primary-navy)' }}>{topic.title}</h1>
         <p style = {{ fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.6' }}>{topic.description}</p>
      </motion.div>

      {/*Completion Status*/}
      {topic.isCompleted && !quizStarted && (
        <motion.div
          initial = {{ scale: 0.9, opacity: 0 }}
          animate = {{ scale: 1, opacity: 1 }}
          style = {{ 
            padding: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '3px solid var(--success-green)',
            marginBottom: '30px',
            textAlign: 'center'
          }}
        >
          <div style = {{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <div style = {{
            fontSize: '14px',
            color: 'var(--success-green)',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            You have completed this Topic
          </div>
          <div style = {{ fontSize: '10px', color: 'var(--text-medium)' }}>
            You can review the content below
          </div>
        </motion.div>
      )}

      {/*Materials Section*/}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>Topic Materials</h3>
        <div style = {{ marginBottom: '20px' }}>
          <p style = {{ 
            fontSize: '10px',
            color: 'var(--text-medium)',
            marginBottom: '15px',
            lineHeight: '1.6'
          }}>
            Please review the training materials before taking the quiz.
          </p>

          <div style = {{ display: 'grid', gap: '15px' }}>
            <a href = {topic.documentUrl}
            target = "_blank"
            rel="noopener noreferrer"
            className="retro-btn"
            style = {{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'var(--bright-blue)',
              borderColor: 'var(--primary-navy)'
            }}>
              Open Document
            </a>

            <a href = {topic.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'var(--orange-accent)',
                borderColor: '#ea580c'
              }}>
                Open Video
              </a>
          </div>
        </div>

        {/* Confirmation */}
        {!topic.isCompleted && (
          <div style = {{
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
              <input type = "checkbox" checked={materialsConfirmed}
                onChange = {(e) => setMaterialsConfirmed(e.target.checked)}
                style = {{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span>
                <strong>I confirm that I have reviewed the document and watched the training video.</strong>
                <strong>I am not a liar</strong>
                <br />
                <span style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                  By checking this box, you acknowledge that you have completed the required training materials.
                </span>
              </span>
            </label>
          </div>
        )}
      </motion.div>

      {/* Quiz */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>Knowledge Check</h3>
        
        {!quizStarted ? (
          <div style = {{ textAlign: 'center', padding: '40px 20px' }}>
            <div style = {{ fontSize: '48px', marginBottom: '20px' }}>
              {topic.isCompleted ? 'Done' : 'Iie' } {/*Change to possible icons*/}
            </div>
            <div style = {{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              {topic.isCompleted ? 'Review Quiz' : 'Test your knowledge' }
            </div>
            <div style = {{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style = {{
                padding: '15px',
                border: '2px solid var(--bright-blue)',
                background: 'rgba(59, 130, 246, 0.05)'
              }}>
                <div style = {{ fontSize: '9px', color: 'var(--text-medium)' }}>Questions</div>
                <div style = {{ fontSize: '18px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                  {topic.questions.length}
                </div>
              </div>
              <div style = {{
                padding: '15px',
                border: '2px solid var(--orange-accent)',
                background: 'rgba(249, 115, 22, 0.05)'
              }}>
                <div style = {{ fontSize: '9px', color: 'var(--text-medium)' }}>Passing Score</div>
                <div style = {{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
                  {topic.passingScore}%
                </div>
              </div>
              <div style = {{
                padding: '15px',
                border: '2px solid var(--success-green)',
                background: 'rgba(16,185,129,0.05)'
              }}>
                <div style = {{ fontSize: '9px', color: 'var(--text-medium)' }}>XP Reward</div>
                <div style = {{ fontSize: '18px', color: 'var(--success-green)', marginTop: '5px' }}>
                  {topic.xpReward}
                </div>
              </div>
            </div>

            {!materialsConfirmed && !topic.isCompleted && (
              <div style = {{
                padding: '15px', 
                background: 'rgba(239, 68, 6i, 0.1)',
                border: '2px solid var(--error-red)',
                marginBottom: '20px',
                fontSize: '10px',
                color: 'var(--text-dark)'
              }}>
                Please confirm that you have reviewed the given training materials
              </div>
            )}

            <button onClick={handleStartQuiz}
              className="retro-btn"
              style={{
                padding: '15px 30px',
                fontSize: '12px',
                opacity: materialsConfirmed ? 1 : 0.5,
                cursor: materialsConfirmed ? 'pointer' : 'not-allowed'
              }}
              disabled={!materialsConfirmed && !topic.isCompleted}
            >
              {materialsConfirmed || topic.isCompleted 
                ? (topic.isCompleted ? 'Review Quiz' : 'Start Quiz')
                : 'Confirm Materials'
              }
            </button>
          </div>
        ) : quizResults? (
          //Explanation screen
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scalse: 1, opacity: 1 }}
              style={{ padding: '20px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                  {quizResults.passed ? '🎉' : '😔'}
                </div>
                <div style = {{
                  fontSize: '24px',
                  color: quizResults.passed ? 'var(--success-green)' : 'var(--error-red)',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  {quizResults.passed ? 'Congratulations!' : 'Aww, not quite there'}
                </div>
                <div style = {{ fontSize: '48px', color: 'var(--bright-blue)', marginBottom: '30px' }}>
                  {quizResults.score}%
                </div>

                <div style = {{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  <div style = {{
                    padding: '15px',
                    border: '2px solid var(--bright-blue)',
                    background: 'rgba(59,130,246,0.05)'
                  }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>Correct Answers</div>
                    <div style={{ fontSize: '18px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                      {quizResults.correctAnswers} / {quizResults.totalQuestions}
                    </div>
                  </div>
                  {quizResults.passed && (
                    <>
                    <div style = {{
                      padding: '15px',
                      border: '2px solid var(--success-green)',
                      background: 'rgba(16, 185, 129, 0.05)'
                    }}>
                      <div style = {{
                        fontSize: '9px',
                        color: 'var(--text-medium)'
                      }}>XP Earned</div>
                      <div style = {{ fontSize: '18px', color: 'var(--success-green)', marginTop: '5px' }}>
                        +{quizResults.xpEarned}
                      </div>
                    </div>
                    <div style = {{
                      padding: '15px',
                      border: '2px solid var(--orange-accent)',
                      background: 'rgba(249, 115, 22, 0.05)'
                    }}>
                      <div style = {{ fontSize: '9px', color: 'var(--text-medium)' }}>New Level</div>
                      <div style = {{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
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
                    <div style = {{
                      fontSize: '14px',
                      color: 'var(--orange-accent)',
                      marginBottom: '15px',
                      fontWeight: 'bold'
                    }}>
                      Badge Unlocked!
                    </div>
                    {quizResults.badgeImage && (
                      <img src = {quizResults.badgeImage.startsWith('/uploads/')
                        //PALITAN PAG NADEPLOY -> SERVER IP
                        ? `http://localhost:5000${quizResults.badgeImage}` 
                        : quizResults.badgeImage }
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
                          
                          e.target.parentElement.innerHTML += 
                          '<div style = "font-size: 64px;">🏆</div>';
                        }}
                        />
                    )}

                    <div style={{ fontSize: '12px', color: 'var(--primary-navy)'}}>
                      {quizResults.badgeEarned}
                    </div>
                  </motion.div>
                )}
              </div>

              <div style = {{
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '2px solid var(--bright-blue)',
                marginBottom: '30px'
              }}>
                <h4 style = {{
                  fontSize: '14px',
                  color: 'var(--primary-navy)',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  Question Review & Explanations
                </h4>

                {topic.questions.map((question, qIndex) => {
                  const userAnswer = selectedAnswers[qIndex];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <motion.div 
                      key = {qIndex}
                      initial={{ x:-20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: qIndex * 0.1 }}
                      style={{
                        marginBottom: '25px',
                        padding: '20px',
                        border: `3px solid ${isCorrect ? 'var(--success-green)' : 'var(--error-red)'}`,
                        background: 'white'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                      }}>
                        <div style = {{
                          fontSize: '20px',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isCorrect ? 'var(--success-green)' : 'var(--error-red)',
                          color: 'white',
                          borderRadius: '50%',
                          fontWeight: 'bold'
                        }}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
                          Question {qIndex+1} of {topic.questions.length}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div style = {{
                        fontSize: '12px',
                        color: 'var(--text-dark)',
                        marginBottom: '15px',
                        fontWeight: 'bold'
                      }}>
                        {question.question}
                      </div>

                      {/* Options */}
                      <div style = {{ marginBottom: '15px' }}>
                        {question.options.map((option, oIndex) => {
                          const isUserAnswer = userAnswer === oIndex;
                          const isCorrectAnswer = question.correctAnswer === oIndex;
                          return (
                            <div key = {oIndex}
                              style = {{
                                padding: '10px 15px',
                                marginBottom: '8px',
                                border: `2px solid ${
                                  isCorrectAnswer ? 'var(--success-green)' : isUserAnswer && !isCorrect
                                  ? 'var(--error-red)'
                                  : 'var(--border-color)'
                                }`,
                                background: isCorrectAnswer
                                ? 'rgba(16,185,129,0.1)'
                                : isUserAnswer && !isCorrect
                                ? 'rgba(239,68,68,0.1)'
                                : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '10px',
                                color: 'var(--text-dark)'
                              }}
                            >
                              <span style = {{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '2px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px',
                                fontWeight: 'bold',
                                background: isCorrectAnswer ? 'var(--success-green)' : 'transparent',
                                color: isCorrectAnswer ? 'white' : 'var(--text-medium)'
                              }}>
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                              <span style = {{ flex: 1 }}>{option}</span>
                              {isUserAnswer && (
                                <span style = {{ fontSize: '8px', color: 'var(--text-medium)' }}>Your Answer</span>
                              )}
                              {isCorrectAnswer && (
                                <span style = {{ fontSize: '8px', color: 'var(--success-green)', fontWeight: 'bold' }}>
                                  Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {question.explanation && (
                        <div style={{
                          padding: '15px',
                          background: 'rgba(59,130,246,0.05)',
                          border: '2px solid var(--bright-blue)'
                        }}>
                          <div style = {{ fontSize: '9px', color: 'var(--bright-blue)', marginBottom: '8px', fontWeight: 'bold' }}>Explanation</div>
                          <div style = {{ fontSize: '10px', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                            {question.explanation}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {!quizResults.passed && (
                <div style = {{
                  padding: '15px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid var(--error-red)',
                  marginBottom: '20px',
                  fontSize: '10px',
                  color: 'var(--text-dark)',
                  textAlign: 'center'
                }}>
                  You need {quizResults.requiredScore}% to pass.
                </div>
              )}

              <div style = {{ 
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {!quizResults.passed && (
                  <button onClick={() => {
                    setQuizStarted(false);
                    setQuizResults(null);
                    setSelectedAnswers({});
                  }}
                  className="retro-btn"
                >Try Again</button>
                )}
                <button onClick={handleReturnHome}
                  className="retro-btn secondary">
                    Return Home
                  </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ): (
          <div>
            <div style={{
              padding: '15px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid var(--bright-blue)',
              marginBottom: '30px',
              fontSize: '10px',
              color: 'var(--text-dark)'
            }}>
              Select the best answer for each question. You need {topic.passingScore}% to pass.
            </div>
            {topic.questions.map((question, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ x:-20, opacity:0 }}
                animate={{ x:0, opacity:1 }}
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
                <div style = {{
                  fontSize: '13px',
                  color: 'var(--text-dark)',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {question.question}
                </div>

                <div style = {{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {question.options.map((option, oIndex) => (
                    <button key = {oIndex} onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      style={{
                        padding: '15px',
                        border: `3px solid ${selectedAnswers[qIndex] === oIndex
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
                      <span style = {{
                        display: 'inline-block',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: `2px solid ${selectedAnswers[qIndex] === oIndex
                          ? 'var(--bright-blue)'
                          : 'var(--border-color)'
                        }`,
                        marginRight: '10px',
                        textAlign: 'center',
                        lineHeight: '21px',
                        background: selectedAnswers[qIndex] === oIndex
                        ? 'var(--bright-blue)'
                        : 'transparent',
                        color: selectedAnswers[qIndex] === oIndex
                        ? 'white'
                        : 'var(--text-medium)'
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
              <button onClick={handleSubmitQuiz}
                className="retro-btn"
                style={{
                  flex: 1,
                  padding: '15px',
                  fontSize: '12px'
                }}
                disabled={Object.keys(selectedAnswers).length !== topic.questions.length}
              >
                Submit Quiz
              </button>
              <button onClick={() => {
                setQuizStarted(false);
                setSelectedAnswers({});
              }}
              className="retro-btn secondary"
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '12px'
              }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <style>
        {`
        .quiz-option:hover {
          transform: translateX(5px);
          border-color: var(--bright-blue) !important;
        }
        `}
      </style>
    </div>
  );
};

export default TopicDetail;