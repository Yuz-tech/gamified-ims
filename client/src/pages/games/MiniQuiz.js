import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const MiniQuiz = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await api.get(`/games/${id}`);
      const gameData = response.data;
      const config = gameData.configs.find(c => c.gameType === 'miniquiz');
      if (config) setGame(config);
    } catch (error) {
      console.error('Failed to load MiniQuiz:', error);
    }
  };

  const questions = game?.data.miniquiz.questions || [];
  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQ.correctAnswer;
    setAnswers({
      ...answers,
      [currentQuestion]: { answer, correct: isCorrect }
    });
    
    if (isCorrect) setScore(score + 100);
    
    // Next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      // Quiz complete
    }
  };

  if (!game || !currentQ) return <div className="loading neon-text">LOADING MINI QUIZ...</div>;

  return (
    <div className="retro-container">
      <div className="retro-card pixel-corners">
        <h1 className="neon-text">{game.title}</h1>
        <div className="badge-info">Q {currentQuestion + 1}/{questions.length} | Score: {score}</div>
        
        <div style={{ margin: '30px 0' }}>
          <h3>{currentQ.question}</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
            {currentQ.options.map((option, i) => (
              <button 
                key={i}
                className="retro-btn"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => handleAnswer(option)}
                disabled={answers[currentQuestion]}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {currentQuestion > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Previous:</h4>
            {questions.slice(0, currentQuestion).map((q, i) => {
              const userAnswer = answers[i];
              if (userAnswer) {
                return (
                  <div key={i} className={`badge-${userAnswer.correct ? 'success' : 'error'}`}>
                    Q{i+1}: {userAnswer.answer}
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniQuiz;