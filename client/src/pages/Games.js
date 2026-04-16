import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (gameType) => {
    switch (gameType) {
      case 'crossword': return '🧩';
      case 'wordle': return '🔤';
      case 'quickquiz': return '⚡';
      default: return '🎮';
    }
  };

  const getGameRoute = (game) => {
    switch (game.gameType) {
      case 'crossword': return `/games/${game._id}`;
      case 'wordle': return `/games/wordle/${game._id}`;
      case 'quickquiz': return `/games/quickquiz/${game._id}`;
      default: return '/games';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'var(--success-green)';
      case 'medium': return 'var(--orange-accent)';
      case 'hard': return 'var(--error-red)';
      default: return 'var(--text-medium)';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING GAMES...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
         GAMES ARCADE
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-dark)', textAlign: 'center' }}>
          Test your IMS knowledge with fun and interactive games! Earn XP while learning.
        </p>
      </motion.div>

      {games.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ textAlign: 'center', padding: '60px 20px' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎮</div>
          <h2 style={{ fontSize: '18px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            No Games Available
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>
            Check back later for new games!
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {games.map((game, index) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="retro-card"
              style={{
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(getGameRoute(game))}
            >
              {/* Game Icon */}
              <div style={{
                fontSize: '64px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {getGameIcon(game.gameType)}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'var(--primary-navy)',
                marginBottom: '10px',
                textAlign: 'center',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {game.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '11px',
                color: 'var(--text-medium)',
                marginBottom: '20px',
                textAlign: 'center',
                minHeight: '40px'
              }}>
                {game.description}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-light)',
                  border: '2px solid var(--border-color)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                    DIFFICULTY
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: getDifficultyColor(game.difficulty),
                    textTransform: 'uppercase'
                  }}>
                    {game.difficulty}
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-light)',
                  border: '2px solid var(--border-color)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                    MAX XP
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                    {game.maxXP}
                  </div>
                </div>
              </div>

              {/* Time Limit */}
              {game.timeLimit > 0 && (
                <div style={{
                  padding: '8px',
                  background: 'var(--orange-accent)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '15px'
                }}>
                  ⏱️ {Math.floor(game.timeLimit / 60)}:{(game.timeLimit % 60).toString().padStart(2, '0')} Time Limit
                </div>
              )}

              {/* Play Button */}
              <button
                className="retro-btn"
                style={{ width: '100%', fontSize: '12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(getGameRoute(game));
                }}
              >
                PLAY NOW
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;