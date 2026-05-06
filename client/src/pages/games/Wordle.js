import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Wordle = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [completed, setCompleted] = useState(false);
  const [won, setWon] = useState(false);
  const [keyColors, setKeyColors] = useState({});
  const maxGuesses = 6;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data);
        setTargetWord(response.data.content.word.toUpperCase());
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    fetchGame();
  }, [id]);

  const validateWord = async (word) => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (currentGuess.length !== targetWord.length) return;

    const isValid = await validateWord(currentGuess);
    if (!isValid) {
      alert('❌ Not a valid word!');
      return;
    }

    const guess = currentGuess.toUpperCase();
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Update keyboard colors
    const newColors = { ...keyColors };
    guess.split('').forEach((letter, idx) => {
      if (letter === targetWord[idx]) {
        newColors[letter] = 'var(--bright-green)';
      } else if (targetWord.includes(letter)) {
        // Only upgrade to yellow if not already green
        if (newColors[letter] !== 'var(--bright-green)') {
          newColors[letter] = 'var(--bright-yellow)';
        }
      } else {
        // Only set to red if not already green/yellow
        if (!newColors[letter]) {
          newColors[letter] = 'var(--error-red)';
        }
      }
    });
    setKeyColors(newColors);

    if (guess === targetWord) {
      setCompleted(true);
      setWon(true);
    } else if (newGuesses.length >= maxGuesses) {
      setCompleted(true);
      setWon(false);
    }
  };

  const handleKeyPress = (letter) => {
    if (completed) return;
    if (currentGuess.length < targetWord.length) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const renderTile = (letter, idx, guess) => {
    const correctLetter = targetWord[idx];
    let bg = 'var(--primary-navy)';

    if (letter) {
      if (letter === correctLetter) {
        bg = 'var(--bright-green)';
      } else if (targetWord.includes(letter)) {
        bg = 'var(--bright-yellow)';
      } else {
        bg = 'var(--error-red)';
      }
    }

    return (
      <motion.div
        key={idx}
        className="pixel-corners"
        style={{
          width: '50px',
          height: '50px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '4px',
          background: bg,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '22px'
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {letter || ''}
      </motion.div>
    );
  };

  if (!game) return <p>Loading Wordle...</p>;

  if (completed) {
    return (
      <motion.div
        className="retro-card pixel-corners"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="neon-text">{won ? '🎉 You Won!' : '💀 Game Over'}</h2>
        <p>The word was: {targetWord}</p>
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

  const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), '⌫']
  ];

  return (
    <div className="retro-container">
      <motion.div
        className="retro-card pixel-corners"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="neon-text">Wordle</h3>

        {/* Full 6-row grid */}
        <div style={{ margin: '20px 0' }}>
          {Array.from({ length: maxGuesses }).map((_, rowIdx) => {
            const guess = guesses[rowIdx] || '';
            const letters = guess.split('');
            return (
              <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center' }}>
                {Array.from({ length: targetWord.length }).map((_, idx) =>
                  renderTile(letters[idx] || '', idx, guess)
                )}
              </div>
            );
          })}
        </div>

        {/* On-screen retro keyboard */}
        <div style={{ marginTop: '20px' }}>
          {keyboardRows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              {row.map((key) => {
                const bgColor = keyColors[key] || 'var(--primary-navy)';
                return (
                  <motion.button
                    key={key}
                    className="retro-btn secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (key === 'ENTER') handleSubmit();
                      else if (key === '⌫') handleBackspace();
                      else handleKeyPress(key);
                    }}
                    style={{
                      margin: '2px',
                      minWidth: '40px',
                      height: '40px',
                      background: bgColor,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {key}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Wordle;
