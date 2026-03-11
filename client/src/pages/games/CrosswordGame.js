import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const CrosswordGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !completed) {
      handleSubmit();
    }
  }, [timeLeft, gameStarted, completed]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/games/${gameId}`);
      setGame(response.data);
      initializeGrid(response.data.gameData);
      setTimeLeft(response.data.timeLimit || 600);
    } catch (error) {
      console.error('Error fetching game:', error);
      alert('Failed to load game');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const initializeGrid = (gameData) => {
    const size = gameData.gridSize;
    const newGrid = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({ 
        letter: '', 
        isBlack: true, 
        number: null,
        isCorrect: null 
      }))
    );

    // Place across answers
    gameData.clues.across.forEach(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        newGrid[clue.row][clue.col + i] = {
          letter: '',
          isBlack: false,
          number: i === 0 ? clue.number : null,
          answer: clue.answer[i],
          isCorrect: null
        };
      }
    });

    // Place down answers
    gameData.clues.down.forEach(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const cell = newGrid[clue.row + i][clue.col];
        newGrid[clue.row + i][clue.col] = {
          letter: cell.letter || '',
          isBlack: false,
          number: i === 0 ? clue.number : cell.number,
          answer: clue.answer[i],
          isCorrect: null
        };
      }
    });

    setGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col].isBlack || completed) return;
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setDirection(direction === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell || completed) return;

    const { row, col } = selectedCell;

    if (e.key.match(/^[a-zA-Z]$/)) {
      const newGrid = [...grid];
      newGrid[row][col].letter = e.key.toUpperCase();
      setGrid(newGrid);

      // Move to next cell
      moveToNextCell(row, col);
    } else if (e.key === 'Backspace') {
      const newGrid = [...grid];
      newGrid[row][col].letter = '';
      setGrid(newGrid);
      moveToPreviousCell(row, col);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
               e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      handleArrowKey(e.key, row, col);
    }
  };

  const moveToNextCell = (row, col) => {
    if (direction === 'across') {
      for (let c = col + 1; c < grid[0].length; c++) {
        if (!grid[row][c].isBlack) {
          setSelectedCell({ row, col: c });
          return;
        }
      }
    } else {
      for (let r = row + 1; r < grid.length; r++) {
        if (!grid[r][col].isBlack) {
          setSelectedCell({ row: r, col });
          return;
        }
      }
    }
  };

  const moveToPreviousCell = (row, col) => {
    if (direction === 'across') {
      for (let c = col - 1; c >= 0; c--) {
        if (!grid[row][c].isBlack) {
          setSelectedCell({ row, col: c });
          return;
        }
      }
    } else {
      for (let r = row - 1; r >= 0; r--) {
        if (!grid[r][col].isBlack) {
          setSelectedCell({ row: r, col });
          return;
        }
      }
    }
  };

  const handleArrowKey = (key, row, col) => {
    const moves = {
      'ArrowRight': [0, 1],
      'ArrowLeft': [0, -1],
      'ArrowDown': [1, 0],
      'ArrowUp': [-1, 0]
    };

    const [dr, dc] = moves[key];
    let newRow = row + dr;
    let newCol = col + dc;

    while (newRow >= 0 && newRow < grid.length && 
           newCol >= 0 && newCol < grid[0].length) {
      if (!grid[newRow][newCol].isBlack) {
        setSelectedCell({ row: newRow, col: newCol });
        return;
      }
      newRow += dr;
      newCol += dc;
    }
  };

  const handleStart = () => {
    setGameStarted(true);
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = 0;

    const newGrid = grid.map(row => 
      row.map(cell => {
        if (!cell.isBlack && cell.answer) {
          total++;
          const isCorrect = cell.letter === cell.answer;
          if (isCorrect) correct++;
          return { ...cell, isCorrect };
        }
        return cell;
      })
    );

    setGrid(newGrid);
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const handleSubmit = async () => {
    if (completed) return;

    const results = checkAnswers();
    const timeTaken = game.timeLimit - timeLeft;

    setScore(results.percentage);
    setCompleted(true);

    try {
      const response = await api.post(`/games/${gameId}/submit`, {
        score: results.percentage,
        timeSpent: timeTaken,
        completed: results.percentage >= 70
      });

      console.log('Game submitted:', response.data);
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, grid, completed]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
          BACK TO GAMES
        </button>

        <h1 className="neon-text" style={{ fontSize: '24px', marginBottom: '10px', color: 'var(--primary-navy)' }}>
          {game.title}
        </h1>

        {gameStarted && (
          <div style={{ 
            fontSize: '20px', 
            color: timeLeft < 60 ? 'var(--error-red)' : 'var(--bright-blue)',
            fontWeight: 'bold',
            marginTop: '10px'
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Start Screen */}
      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="retro-card"
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--secondary-pink)' }}>
            READY TO START?
          </h2>
          <div style={{ marginBottom: '30px', fontSize: '12px', lineHeight: '1.8' }}>
            <p>Time Limit: <strong>{Math.floor(game.timeLimit / 60)} minutes</strong></p>
            <p>Reward: <strong>{game.xpReward} XP</strong></p>
            <p>Difficulty: <strong style={{ textTransform: 'uppercase' }}>{game.difficulty}</strong></p>
            <p style={{ marginTop: '20px', fontSize: '10px', color: 'var(--text-medium)' }}>
              Fill in the crossword puzzle using the clues below.<br/>
              Click a cell and type your answer. Use arrow keys to navigate.
            </p>
          </div>
          <button onClick={handleStart} className="retro-btn" style={{ fontSize: '14px', padding: '15px 40px' }}>
             START GAME
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
          {/* Crossword Grid */}
          <div className="retro-card">
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: `repeat(${game.gameData.gridSize}, 40px)`,
              gap: '2px',
              background: 'var(--primary-navy)',
              padding: '2px',
              margin: '0 auto'
            }}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: cell.isBlack 
                        ? 'var(--primary-navy)' 
                        : completed
                          ? cell.isCorrect === true
                            ? 'rgba(16, 185, 129, 0.2)'
                            : cell.isCorrect === false
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'white'
                          : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                            ? 'var(--bright-blue)'
                            : 'white',
                      border: cell.isBlack ? 'none' : '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      position: 'relative',
                      cursor: cell.isBlack ? 'default' : 'pointer',
                      color: selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'white' : 'var(--text-dark)'
                    }}
                  >
                    {cell.number && (
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        fontSize: '8px',
                        color: 'var(--text-medium)'
                      }}>
                        {cell.number}
                      </span>
                    )}
                    {cell.letter}
                    {completed && cell.isCorrect === true && (
                      <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '16px' }}>✓</span>
                    )}
                    {completed && cell.isCorrect === false && (
                      <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '16px' }}>✗</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {!completed && (
              <button 
                onClick={handleSubmit} 
                className="retro-btn" 
                style={{ width: '100%', marginTop: '20px', fontSize: '12px' }}
              >
                SUBMIT ANSWERS
              </button>
            )}

            {completed && (
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid var(--bright-blue)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {score >= 70 ? '🎉' : '💪'}
                </div>
                <div style={{ fontSize: '24px', color: score >= 70 ? 'var(--success-green)' : 'var(--orange-accent)', fontWeight: 'bold', marginBottom: '10px' }}>
                  {score}%
                </div>
                <div style={{ fontSize: '12px', marginBottom: '20px' }}>
                  {score >= 70 ? 'COMPLETED!' : 'KEEP PRACTICING!'}
                </div>
                <button onClick={() => navigate('/games')} className="retro-btn">
                  ← BACK TO GAMES
                </button>
              </div>
            )}
          </div>

          {/* Clues */}
          <div className="retro-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--secondary-pink)' }}>
              CLUES
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '12px', marginBottom: '15px', color: 'var(--primary-navy)' }}>
                ACROSS
              </h4>
              {game.gameData.clues.across.map((clue, index) => (
                <div key={index} style={{ marginBottom: '10px', fontSize: '10px', lineHeight: '1.6' }}>
                  <strong>{clue.number}.</strong> {clue.clue}
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ fontSize: '12px', marginBottom: '15px', color: 'var(--primary-navy)' }}>
                DOWN
              </h4>
              {game.gameData.clues.down.map((clue, index) => (
                <div key={index} style={{ marginBottom: '10px', fontSize: '10px', lineHeight: '1.6' }}>
                  <strong>{clue.number}.</strong> {clue.clue}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordGame;