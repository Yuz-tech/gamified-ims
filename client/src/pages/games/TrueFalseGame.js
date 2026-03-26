import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const TrueFalseGame = ({ game }) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    const correct = answer === game.questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < game.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowResult(false);
      } else {
        submitGame(newAnswers);
      }
    }, 1500);
  };

  const submitGame = async (finalAnswers) => {
    try {
      const response = await api.post(`/games/${game._id}/submit`, { answers: finalAnswers });
      setResult(response.data);
      setSubmitted(true);

      const userResponse = await api.get('/auth/me');
      updateUser(userResponse.data);
    } catch (error) {
      console.error('Error submitting game:', error);
      alert('Failed to submit answers');
    }
  };

  if (submitted && result) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>
            {result.percentage >= 70 ? '🎉' : result.percentage >= 50 ? '👍' : '📝'}
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--orange-accent)', marginBottom: '20px' }}>
            GAME COMPLETE!
          </h2>
          <div style={{
            padding: '20px',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '2px solid var(--orange-accent)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              Score: {result.correctCount} / {result.totalQuestions} ({result.percentage}%)
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--orange-accent)' }}>
              +{result.score} XP
            </div>
          </div>
          {result.leveledUp && (
            <div style={{
              padding: '15px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--success-green)',
              marginBottom: '20px',
              fontSize: '12px',
              color: 'var(--success-green)',
              fontWeight: 'bold'
            }}>
              LEVEL UP! You're now level {result.newLevel}!
            </div>
          )}
          <button
            onClick={() => navigate('/games')}
            className="retro-btn"
            style={{ width: '100%' }}
          >
            ← BACK TO GAMES
          </button>
        </motion.div>
      </div>
    );
  }

  const question = game.questions[currentQuestion];

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
        ← BACK
      </button>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="retro-card"
        style={{ maxWidth: '700px', margin: '0 auto' }}
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            QUESTION {currentQuestion + 1} OF {game.questions.length}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-medium)',
            border: '2px solid var(--border-color)'
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / game.questions.length) * 100}%`,
              height: '100%',
              background: 'var(--orange-accent)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <h2 style={{
          fontSize: '20px',
          color: 'var(--primary-navy)',
          marginBottom: '40px',
          lineHeight: '1.6',
          textAlign: 'center',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {question.statement}
        </h2>

        {!showResult ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswerSelect(true)}
              className="retro-btn"
              style={{
                padding: '40px 20px',
                fontSize: '24px',
                background: 'var(--success-green)',
                borderColor: 'var(--success-green)'
              }}
            >
              ✓ TRUE
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswerSelect(false)}
              className="retro-btn"
              style={{
                padding: '40px 20px',
                fontSize: '24px',
                background: 'var(--error-red)',
                borderColor: 'var(--error-red)'
              }}
            >
              ✗ FALSE
            </motion.button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>
              {isCorrect ? '✅' : '❌'}
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: isCorrect ? 'var(--success-green)' : 'var(--error-red)',
              marginBottom: '10px'
            }}>
              {isCorrect ? 'CORRECT!' : 'INCORRECT'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
              {currentQuestion < game.questions.length - 1 ? 'Next question...' : 'Calculating score...'}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrueFalseGame;