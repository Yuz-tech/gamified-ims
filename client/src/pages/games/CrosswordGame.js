import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CrosswordGame = ({ game }) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value.toUpperCase()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(`/games/${game._id}/submit`, { answers });
      setResult(response.data);
      setSubmitted(true);

      const userResponse = await api.get('/auth/me');
      updateUser(userResponse.data);
    } catch (error) {
      console.error('Error submitting game: ', error);
      alert('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && result) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>
            {result.percentage >= 70 ? 'GREAT' : result.percentage >= 50 ? 'NICE' : "You didn't even try" }
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
            Game complete!
          </h2>
          <div style={{
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid var(--bright-blue)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              Score: {result.correctCount} / {result.totalQuestions}
              ({result.percentage}%)
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
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
              Leveled Up! You're now level {result.newLevel}!
            </div>
          )}
          <button onClick={() => navigate('/games')} className="retro-btn" style={{ width: '100%' }}>
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  if (!game || !game.questions || game.questions.length === 0) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
          style={{ textAlign: 'center', padding: '60px' }}
        >
          <h2 style={{ fontSize: '24px', color:'var(--error-red)', marginBottom: '20px'}}>Game Data Error</h2>
          <p style={{ fontSize: '12px', marginBottom: '30px' }}>
            This game is ahh.
          </p>
          <button onClick={() => navigate('/games')} className="retro-btn">
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
      >
        <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
          {game.title}
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '30px' }}>
          Fill in the puzzle below. Earn {game.xpReward} XP!
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {game.questions.map((question, index) => (
              <div key={index} style={{
                padding: '15px',
                background: 'var(--bg-light)',
                border: '2px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {index + 1}.{question.clue}
                </div>
                <input type="text" className="retro-input" value={answers[index] || ''} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder={`${question.answer.length} letters`} maxLength={question.answer.length} style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }} required />
              </div>
            ))}
          </div>

          <button type="submit" className="retro-btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Answers'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CrosswordGame;