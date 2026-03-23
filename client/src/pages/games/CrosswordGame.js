import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CrosswordGame = ({ game }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
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
      const response = await api.post(`/games/${game._id}/submit`, {answers});

      setScore(response.data.score);
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

  if (submitted) {
    return (
      <div className="retro-container" style={{ paddingTop: '40px' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-card"
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>
              {score >= 70 ? 'Wow' : score >= 50 ? 'Great' : 'Well'}
            </div>
            <h2 style={{ fontSize: '24px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
              Game Complete!
            </h2>
            <div style={{
              padding: '20px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid var(--bright-blue)',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                {score} XP
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                Earned
              </div>
            </div>
            <button onClick={() => navigate('/games')} className="retro-btn" style={{ width: '100%' }}>
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
        className="retro-card">
          <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
            {game.title}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '30px' }}>
            Fill in the puzzle below
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
                  <input type="text" className="retro-input" value={answers[index] || ''} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder={`${question.answer.length} letters`} maxLength={question.answer.length} style={{ textTransform: 'uppercase' }} required />
                </div>
              ))}
            </div>

            <button type="submit" className="retro-btn" style={{ width: '100%' }} disabled={loading} >
              {loading ? 'Submitting...' : 'Submit answers'}
            </button>
          </form>
        </motion.div>
    </div>
  );
};

export default CrosswordGame;