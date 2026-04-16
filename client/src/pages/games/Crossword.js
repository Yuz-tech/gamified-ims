import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Crossword = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [grid, setGrid] = useState([]);
  const [clues, setClues] = useState({ across: [], down: [] });
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/games/${gameId}`);
      const gameData = response.data;
      setGame(gameData);
      initializeGrid(gameData.content);
    } catch (error) {
      console.error('Error fetching game:', error);
      alert('Error loading game');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const initializeGrid = (content) => {
    const userGrid = content.grid.map(row =>
      row.map(cell => ({
        correct: cell,
        user: cell === null ? null : '',
        isBlack: cell === null
      }))
    );
    setGrid(userGrid);
    setClues(content.clues);
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col].isBlack) return;
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleInput = (e, row, col) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 1) return;

    const newGrid = [...grid];
    newGrid[row][col] = { ...newGrid[row][col], user: value };
    setGrid(newGrid);

    if (value && direction === 'across') {
      if (col < 9 && !newGrid[row][col + 1]?.isBlack) {
        setSelectedCell({ row, col: col + 1 });
      }
    } else if (value && direction === 'down') {
      if (row < 9 && !newGrid[row + 1]?.[col]?.isBlack) {
        setSelectedCell({ row: row + 1, col });
      }
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'Backspace' && !grid[row][col].user) {
      if (direction === 'across' && col > 0) {
        setSelectedCell({ row, col: col - 1 });
      } else if (direction === 'down' && row > 0) {
        setSelectedCell({ row: row - 1, col });
      }
    }
  };

  const checkAnswers = async () => {
    let correct = 0;
    let total = 0;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.isBlack) {
          total++;
          if (cell.user === cell.correct) {
            correct++;
          }
        }
      });
    });

    const percentage = Math.round((correct / total) * 100);
    const earnedXP = Math.round((percentage / 100) * game.maxXP);
    setScore(earnedXP);

    if (percentage === 100) {
      setGameComplete(true);
      await submitScore(earnedXP);
    } else {
      alert(`You got ${correct}/${total} correct (${percentage}%). Keep trying!`);
    }
  };

  const submitScore = async (earnedXP) => {
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      await api.post('/games/submit-score', {
        gameId: game._id,
        gameType: 'crossword',
        score: earnedXP,
        timeSpent: timeTaken
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const revealAnswers = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        user: cell.correct || ''
      }))
    );
    setGrid(newGrid);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING GAME...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
        ← BACK TO GAMES
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
      >
        <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
          🧩 {game?.title || 'CROSSWORD'}
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginBottom: '30px' }}>
          {game?.description}
        </p>

        {!gameComplete ? (
          <>
            {/* Grid */}
            <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
              <div style={{
                display: 'inline-grid',
                gridTemplateColumns: 'repeat(10, 40px)',
                gap: '2px',
                padding: '20px',
                background: 'var(--bg-light)',
                border: '3px solid var(--primary-navy)'
              }}>
                {grid.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: cell.isBlack ? 'var(--primary-navy)' : 'white',
                        border: cell.isBlack ? 'none' : '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: cell.isBlack ? 'default' : 'pointer',
                        position: 'relative',
                        boxShadow: selectedCell?.row === r && selectedCell?.col === c
                          ? '0 0 0 3px var(--bright-blue)'
                          : 'none'
                      }}
                    >
                      {!cell.isBlack && (
                        <input
                          ref={el => {
                            if (selectedCell?.row === r && selectedCell?.col === c) {
                              el?.focus();
                            }
                          }}
                          type="text"
                          maxLength="1"
                          value={cell.user}
                          onChange={(e) => handleInput(e, r, c)}
                          onKeyDown={(e) => handleKeyDown(e, r, c)}
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'var(--primary-navy)',
                            textTransform: 'uppercase',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Clues */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* Across */}
              <div>
                <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '15px' }}>
                  ACROSS
                </h3>
                {clues.across.map((clue, idx) => (
                  <div key={idx} style={{ fontSize: '11px', marginBottom: '10px', lineHeight: '1.6' }}>
                    <strong>{clue.number}.</strong> {clue.clue}
                  </div>
                ))}
              </div>

              {/* Down */}
              <div>
                <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '15px' }}>
                  DOWN
                </h3>
                {clues.down.map((clue, idx) => (
                  <div key={idx} style={{ fontSize: '11px', marginBottom: '10px', lineHeight: '1.6' }}>
                    <strong>{clue.number}.</strong> {clue.clue}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={checkAnswers} className="retro-btn">
                ✓ CHECK ANSWERS
              </button>
              <button onClick={revealAnswers} className="retro-btn secondary">
                💡 REVEAL ANSWERS
              </button>
              <button onClick={() => fetchGame()} className="retro-btn secondary">
                RESET
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', color: 'var(--success-green)', marginBottom: '20px' }}>
              PERFECT!
            </h2>
            <div style={{ fontSize: '14px', marginBottom: '30px' }}>
              You earned <strong style={{ color: 'var(--bright-blue)' }}>{score} XP</strong>!
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/games')} className="retro-btn">
                BACK TO GAMES
              </button>
              <button onClick={() => window.location.reload()} className="retro-btn secondary">
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Crossword;
