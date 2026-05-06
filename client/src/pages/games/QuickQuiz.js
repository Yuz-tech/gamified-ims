import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const QuickQuiz = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data);
        setStartTime(Date.now());
        if (response.data.timeLimit > 0) {
          setTimeLeft(response.data.timeLimit);
        }
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    fetchGame();
  }, [id]);

  // Countdown effect
  useEffect(() => {
    if (!timeLeft || completed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, completed]);

  const handleAnswer = (option) => {
    const currentQuestion = game.content[currentIndex];
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < game.content.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setCompleted(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      await api.post(`/games/${id}/complete`, {
        userId: user._id,
        score,
        timeSpent
      });
    } catch (error) {
      console.error('Error recording completion:', error);
    }
  };

  if (!game) {
    return (
      <motion.div
        className="retro-card pixel-corners"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="neon-text">Loading Quiz...</h2>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div
        className="retro-card pixel-corners"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="neon-text" style={{ animation: 'glow 1.5s infinite alternate' }}>
          🎉 Quiz Completed! 🎉
        </h2>
        <p>You scored {score} out of {game.content.length}</p>
        <motion.button
          className="retro-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/games'}
          style={{ marginTop: '15px' }}
        >
          Back to Games
        </motion.button>
      </motion.div>
    );
  }

  const currentQuestion = game.content[currentIndex];

  // Danger zone styling
  const dangerZone = timeLeft <= 10;

  return (
    <div className="retro-container">
      {/* Timer bar */}
      {game.timeLimit > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <motion.div
            style={{
              height: '20px',
              background: dangerZone ? 'var(--error-red)' : 'var(--bright-blue)',
              border: '3px solid var(--primary-navy)',
              boxShadow: dangerZone
                ? '0 0 10px var(--error-red), 3px 3px 0 var(--primary-navy)'
                : '3px 3px 0 var(--primary-navy)',
              width: `${(timeLeft / game.timeLimit) * 100}%`,
              transition: 'width 1s linear'
            }}
            animate={dangerZone ? { opacity: [1, 0.5, 1] } : {}}
            transition={dangerZone ? { duration: 0.8, repeat: Infinity } : {}}
          />
          <p
            style={{ textAlign: 'center', marginTop: '5px' }}
            className="neon-text"
          >
            Time Left: {timeLeft}s
          </p>
        </div>
      )}

      <motion.div
        className="retro-card pixel-corners"
        key={currentIndex}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="neon-text" style={{ animation: 'glow 2s infinite alternate' }}>
          Question {currentIndex + 1}
        </h3>
        <p style={{ marginTop: '10px', color: 'var(--text-medium)' }}>
          {currentQuestion.question}
        </p>

        <div style={{ marginTop: '20px' }}>
          {currentQuestion.options.map((option, idx) => (
            <motion.button
              key={idx}
              className="retro-btn secondary"
              whileHover={{ scale: 1.05, backgroundColor: 'var(--light-blue)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(option)}
              style={{ display: 'block', marginBottom: '12px', width: '100%' }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p className="neon-text">Score: {score}</p>
        <p className="neon-text">Progress: {currentIndex + 1} / {game.content.length}</p>
      </div>
    </div>
  );
};

export default QuickQuiz;
