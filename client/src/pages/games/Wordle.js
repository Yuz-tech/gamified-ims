import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const Wordle = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [letterStates, setLetterStates] = useState({});

  // Free word API
  const isValidWord = useCallback(async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      return response.ok;
    } catch {
      return ['RISKS', 'HAZARD', 'EVACUATE', 'SAFETY', 'PPE'].includes(word.toUpperCase());
    }
  }, []);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/games/${id}`);
      const gameData = response.data;
      const config = gameData.configs.find(c => c.gameType === 'wordle');
      if (config) setGame(config);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const targetWord = game?.data.wordle.targetWord || '';

  const addLetter = (letter) => {
    if (!gameOver && currentGuess.length < 5) {
      const newGuess = currentGuess + letter.toUpperCase();
      setCurrentGuess(newGuess);
      guesses[currentGuessIndex] = newGuess;
      setGuesses([...guesses]);
    }
  };

  const deleteLetter = () => {
    if (!gameOver && currentGuess.length > 0) {
      const newGuess = currentGuess.slice(0, -1);
      setCurrentGuess(newGuess);
      guesses[currentGuessIndex] = newGuess;
      setGuesses([...guesses]);
    }
  };

  const deleteAll = () => {
  if (!gameOver && currentGuess.length > 0) {
    const newGuess = "";
    setCurrentGuess(newGuess);
    guesses[currentGuessIndex] = newGuess;
    setGuesses([...guesses]);
  }
};


  const submitGuess = async () => {
    if (currentGuess.length === 5 && !gameOver) {
      const isValid = await isValidWord(currentGuess);
      if (!isValid) {
        alert('Not a valid word');
        deleteAll();
        return;
      };

      // Move to next row
      const newLetterStates = calculateLetterStates(currentGuess);
      setLetterStates(prev => ({ ...prev, ...newLetterStates }));
      
      setCurrentGuessIndex(currentGuessIndex + 1);
      setCurrentGuess('');

      // Check win
      if (currentGuess.toUpperCase() === targetWord) {
        setWon(true);
        setGameOver(true);
        return;
      }

      // Check lose
      if (currentGuessIndex + 1 >= 6) {
        setGameOver(true);
      }
    }
  };

  const calculateLetterStates = (guess) => {
    const states = {};
    const target = targetWord;

    // First pass: greens
    guess.split('').forEach((letter, i) => {
      if (target[i] === letter) {
        states[letter] = 'correct';
      }
    });

    // Second pass: yellows
    guess.split('').forEach((letter, i) => {
      if (target[i] !== letter && target.includes(letter) && states[letter] !== 'correct') {
        states[letter] = 'present';
      }
    });

    // Third pass: grays
    guess.split('').forEach((letter) => {
      if (!states[letter]) {
        states[letter] = 'absent';
      }
    });

    return states;
  };

  const getCellClass = (row, col) => {
    const guess = guesses[row] || '';
    const letter = guess[col] || '';
    
    if (row < currentGuessIndex) {
      // Past guesses
      if (targetWord[col] === letter) return 'correct';
      if (targetWord.includes(letter)) return 'present';
      return 'absent';
    }
    
    return '';
  };

  const getKeyClass = (letter) => letterStates[letter] || '';

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
  ];

  if (loading || !game) {
    return <div className="retro-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div className="loading neon-text" style={{ fontSize: '24px' }}>LOADING WORDLE...</div>
    </div>;
  }

  return (
    <div className="retro-container" style={{ padding: '20px 10px', maxWidth: '820px', margin: '0 auto' }}>
      <div className="retro-card pixel-corners" style={{ 
        boxShadow: '0 10px 40px rgba(27, 58, 107, 0.3)',
        background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)'
      }}>

        {/* Grid */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px', 
          marginBottom: '5px'
        }}>
          {guesses.map((guess, row) => (
            <div key={row} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 62px)', 
              gap: '2px', 
              justifyContent: 'center',
              minHeight: '70px'
            }}>
              {Array.from({ length: 5 }, (_, col) => {
                const letter = guess[col] || '';
                const status = getCellClass(row, col);
                return (
                  <div
                    key={col}
                    className={`retro-card ${status}`}
                    style={{
                      height: '62px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      border: '2px solid rgba(0,0,0,0.1)',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div style={{ marginBottom: '20px' }}>
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} style={{ 
              display: 'flex', 
              gap: rowIndex === 1 ? '8px' : '6px', 
              justifyContent: 'center',
              marginBottom: rowIndex < 2 ? '8px' : '0',
              padding: '0 12px'
            }}>
              {row.map((key) => {
                if (key === 'ENTER') {
                  return (
                    <button
                      key={key}
                      className="retro-btn"
                      style={{
                        flex: '1',
                        maxWidth: '120px',
                        fontSize: '9px',
                        padding: '10px 8px',
                        height: '52px'
                      }}
                      onClick={submitGuess}
                      disabled={currentGuess.length !== 5 || gameOver}
                    >
                      ENTER
                    </button>
                  );
                }
                if (key === 'DELETE') {
                  return (
                    <button
                      key={key}
                      className="retro-btn secondary"
                      style={{
                        maxWidth: '120px',
                        fontSize: '12px',
                        padding: '10px 8px',
                        height: '52px'
                      }}
                      onClick={deleteLetter}
                      disabled={gameOver}
                    >
                      ⌫
                    </button>
                  );
                }
                return (
                  <button
                    key={key}
                    className={`retro-btn ${getKeyClass(key)}`}
                    style={{
                      flex: '1',
                      maxWidth: '60px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      height: '52px',
                      padding: '0'
                    }}
                    onClick={() => addLetter(key)}
                    disabled={gameOver}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Game Over */}
        {gameOver && (
          <div style={{ 
            textAlign: 'center', 
            padding: '25px 20px',
            background: 'linear-gradient(145deg, rgba(16,185,129,0.2), rgba(245,158,11,0.1))',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <h2 className={`neon-text ${won ? 'text-success' : 'text-error'}`} style={{ 
              fontSize: '16px', 
              marginBottom: '15px',
              lineHeight: '1.3'
            }}>
              {won 
                ? '🎉 CORRECT! IMS MASTER!' 
                : `Game Over\nThe word was: ${targetWord}`
              }
            </h2>
            <button 
              className="retro-btn" 
              style={{ width: '100%', fontSize: '11px' }}
              onClick={() => window.history.back()}
            >
              🎮 PLAY ANOTHER IMS GAME
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .retro-card.correct {
          background: linear-gradient(145deg, #10B981, #059669) !important;
          color: white !important;
          border-color: #047857 !important;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.6) !important;
          animation: flipIn 0.5s ease;
        }
        .retro-card.present {
          background: linear-gradient(145deg, #F59E0B, #D97706) !important;
          color: white !important;
          border-color: #B45309 !important;
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.6) !important;
          animation: flipIn 0.5s ease 0.1s;
        }
        .retro-card.absent {
          background: #6B7280 !important;
          color: white !important;
          border-color: #4B5563 !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3) !important;
          animation: flipIn 0.5s ease 0.2s;
        }
        .retro-btn.correct {
          background: #10B981 !important;
          border-color: #059669 !important;
        }
        .retro-btn.present {
          background: #F59E0B !important;
          border-color: #D97706 !important;
        }
        .retro-btn.absent {
          background: #6B7280 !important;
          border-color: #4B5563 !important;
          opacity: 0.6;
        }
        @keyframes flipIn {
          0% { 
            transform: rotateX(90deg) scale(0.8); 
            opacity: 0; 
          }
          100% { 
            transform: rotateX(0deg) scale(1); 
            opacity: 1; 
          }
        }
        @media (max-width: 480px) {
          [style*="grid-template-columns"] {
            grid-template-columns: repeat(5, 55px) !important;
          }
          .retro-card {
            height: 55px !important;
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Wordle;