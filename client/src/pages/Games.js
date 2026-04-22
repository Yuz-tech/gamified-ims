import React, { useState, useEffect } from "react";
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
      console.error('Error fetching games: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (gameType) => {
    switch (gameType) {
      case 'texttwist': return '🔤';
      case 'wordle': return '📝';
      case 'quickquiz': return '⚡';
      case 'hangman': return '🎯';
      default: return '🎮';
    }
  };

  const getGameName = (gameType) => {
    switch (gameType) {
      case 'texttwist': return 'Text Twist';
      case 'wordle': return 'Wordle';
      case 'quickquiz': return 'Quick Quiz';
      case 'hangman': return 'Hangman';
      default: return gameType;
    }
  };

  const handlePlayGame = (game) => {
    if (game.hasCompleted) {
      alert('You have already completed this game! You cannot XP farm');
      return;
    }
    navigate(`/games/${game.gameType}/${game._id}`);
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
        <div className="loading neon-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        IMS AWARENESS GAMES
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-dark)', textAlign: 'center' }}>
          Test your IMS Knowledge with games! Earn XP while learning.
          <br />
          <strong style={{ color: 'var(--orange-accent)' }}>Note: XP Farming is not allowed.</strong>
        </p>
      </motion.div>

      {games.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ textAlign: 'center', padding: '60px 20px'}}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>GAMES!</div>
          <h2 style={{ fontSize: '18px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            No Games Available
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>
            Check back later for new content!
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
              whileHover={{ scale: game.hasCompleted ? 1 : 1.03 }}
              className="retro-card"
              style={{
                cursor: game.hasCompleted ? 'not-allowed' : 'pointer',
                opacity: game.hasCompleted ? 0.6 : 1,
                position: 'relative',
                border: game.hasCompleted ? '2px solid var(--text-medium)' : '2px solid var(--border-color)'
              }}
              onClick={() => handlePlayGame(game)}
            >
              {/* Completed Badge */}
              {game.hasCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  padding: '5px 12px',
                  background: 'var(--success-green)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 10
                }}>
                  COMPLETED
                </div>
              )}

              <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: '20px' }}>
                {getGameIcon(game.gameType)}
              </div>

              <div style={{
                fontSize: '10px',
                color: 'var(--text-medium)',
                textAlign: 'center',
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {getGameName(game.gameType)}
              </div>

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

              <p style={{
                fontSize: '11px',
                color: 'var(--text-medium)',
                marginBottom: '20px',
                textAlign: 'center',
                minHeight: '40px'
              }}>
                {game.description}
              </p>

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
                  {Math.floor(game.timeLimit / 60)}:{(game.timeLimit % 60).toString().padStart(2, '0')} Time Limit
                </div>
              )}

              <button className="retro-btn" style={{
                width: '100%',
                fontSize: '12px',
                opacity: game.hasCompleted ? 0.5 : 1,
                cursor: game.hasCompleted ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayGame(game);
              }}
              disabled={game.hasCompleted}
              >
                {game.hasCompleted ? 'COMPLETED' : 'PLAY NOW'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;