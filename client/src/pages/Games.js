import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || game.type === filter;
    return matchesSearch && matchesFilter;
  });

  const gamesByType = {
    crossword: filteredGames.filter(g => g.type === 'crossword'),
    word_scramble: filteredGames.filter(g => g.type === 'wordle'),
    quick_quiz: filteredGames.filter(g => g.type === 'quick_quiz')
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'var(--success-green)';
      case 'medium': return 'var(--orange-accent)';
      case 'hard': return 'var(--error-red)';
      default: return 'var(--text-medium)';
    }
  };

  const getGameRoute = (game) => {
    switch (game.gameType) {
      case 'crossword': 
        return `/games/crossword/${game._id}`;
      case 'wordle':
        return `/games/wordle/${game._id}`;
      case 'quickquiz':
        return `/games/quickquiz/${game._id}`;
      default: return '/games';
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
         TRAINING GAMES
      </motion.h1>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
              SEARCH
            </label>
            <input
              type="text"
              className="retro-input"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
              FILTER BY TYPE
            </label>
            <select
              className="retro-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {/* <option value="all">All Games ({games.length})</option>
              <option value="crossword">Crossword ({gamesByType.crossword.length})</option>
              <option value="wordle">Wordle ({gamesByType.wordle.length})</option>
              <option value="quick_quiz">Quick Quiz ({gamesByType.quick_quiz.length})</option> */}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-medium)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎮</div>
          <div style={{ fontSize: '14px' }}>No games found</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredGames.map((game, index) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="retro-card"
              style={{
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: game.completed ? '3px solid var(--success-green)' : '2px solid var(--border-color)'
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/games/${game._id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                {game.completed && (
                  <div style={{
                    padding: '5px 10px',
                    background: 'var(--success-green)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    borderRadius: '3px'
                  }}>
                    COMPLETED
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                {game.title}
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{
                  padding: '5px 10px',
                  background: getDifficultyColor(game.difficulty),
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '3px'
                }}>
                  {game.difficulty}
                </span>
                <span style={{
                  padding: '5px 10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '2px solid var(--bright-blue)',
                  color: 'var(--bright-blue)',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  borderRadius: '3px'
                }}>
                  {game.xpReward} XP
                </span>
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

              <button
                className="retro-btn"
                style={{ width: '100%', fontSize: '11px' }}
              >
                {game.completed ? 'PLAY AGAIN' : 'PLAY NOW'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;