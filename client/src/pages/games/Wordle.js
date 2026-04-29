import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from '../../utils/api';

const Wordle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [hint, setHint] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [maxAttempts] = useState(6);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    fetchGame();
  }, [id]);

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => prev + e.key.toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentGuess, gameOver]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/games/play/${id}`);
      const gameData = response.data;
      setGame(gameData);

      const words = gameData.content.words;
      const randomWord = words[Math.floor(Math.random() * words.length)];

      setTargetWord(randomWord.word.toUpperCase());

      setHint(randomWord.hint);
      setGuesses([]);
      setCurrentGuess('');
      setGameOver(false);
      setWon(false);
    } catch (error) {
      console.error('Error fetching game: ', error);
      if (error.response?.status === 403) {
        alert('You have already completed this game!');
        navigate('/games');
      } else {
        alert('Error loading game');
        navigate('/games');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (letter) => {
    if (gameOver) return;

    if (letter === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (letter === 'ENTER') {
      submitGuess();
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + letter);
    }
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      alert('Word must be 5 letters');
      return;
    }

    setIsValidating(true);
    const isValidWord = await validateWord(currentGuess);
    setIsValidating(false);

    if (!isValidWord) {
      alert('Not a valid English word!');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      await submitScore(true, newGuesses.length);
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true);
      await submitScore(false, newGuesses.length);
    }
  };

  const validateWord = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      return response.ok;
    } catch (error) {
      console.error('Error validating word: ', error);
      return true;
    }
  };

  const submitScore = async (won, attempts) => {
    try {
      let score = 0;
      if (won) {
        const baseXP = game.maxXP || 150;
        score = Math.round(baseXP * (1 - (attempts - 1) / maxAttempts));
      }

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      await api.post('/games/submit-score', {
        gameId: game._id,
        gameType: 'wordle',
        score,
        timeSpent: timeTaken
      });
    } catch (error) {
      console.error('Error submitting score: ', error);
    }
  };

  const getLetterColor = (letter, index, guess) => {
    if (guess[index] === targetWord[index]) {
      return 'var(--success-green)';
    } else if (targetWord.includes(letter)) {
      return 'var(--orange-accent)';
    } else {
      return 'var(--text-medium)';
    }
  };

  const renderGuess = (guess, isActive = false) => {
    const letters = guess.split('');
    const emptySlots = 5 - letters.length;

    return (
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '10px' }}>
        {letters.map((letter, idx) => (
          <div key={idx} style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--primary-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            background: isActive ? 'var(--bright-blue)' : getLetterColor(letter, idx, guess)
          }}
          >
            {letter}
          </div>
        ))}
        {isActive && Array(emptySlots).fill(0).map((_, idx) => (
          <div key={`empty-${idx}`} style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--border-color)',
            background: 'white'
          }}
          />
        ))}
      </div>
    );
  };

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    return (
      <div style={{ marginTop: '30px' }}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '5px' }}>
            {row.map(key => (
              <button key={key} onClick={() => handleKeyPress(key)} className="retro-btn secondary" style={{
                padding: key.length > 1 ? '10px 8px' : '10px 15px',
                fontSize: '10px',
                minWidth: key.length > 1 ? '80px' : '40px'
              }}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error-red)' }}>Game not Found</h2>
          <button onClick={() => navigate('/games')} className="retro-btn">
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
        Back to Games
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px', textAlign: 'center' }}>
          {game.title}
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginBottom: '20px', textAlign: 'center' }}>
          {game.description}
        </p>

        {!gameOver ? (
          <>
            <div style={{
              padding: '15px',
              background: 'var(--bg-light)',
              border: '2px solid var(--border-color)',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                HINT
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>{hint}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginTop: '5px' }}>
                (5 letters)
              </div>
            </div>

            {guesses.map((guess, idx) => (
              <div key={idx}>{renderGuess(guess)}</div>
            ))}

            {!gameOver && guesses.length < maxAttempts && renderGuess(currentGuess, true)}

            {Array(maxAttempts - guesses.length - (gameOver ? 0 : 1)).fill(0).map((_, idx) => (
              <div key={`empty-row-${idx}`} style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '10px' }}>
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--border-color)',
                    background: 'white'
                  }}
                  />
                ))}
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text-medium)' }}>
              {isValidating ? (
                <span style={{ color: 'var(--bright-blue)', fontWeight: 'bold' }}>
                  Validating word...
                </span>
              ) : (
                <>
                Attempts: {guesses.length} / {maxAttempts}
                </>
              )}
            </div>

            {renderKeyboard()}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {won ? '🎉' : '😢'}
            </div>
            <h2 style={{ fontSize: '24px', color: won ? 'var(--success-green)' : 'var(--error-red)', marginBottom: '20px' }}>
              {won ? 'You Won!' : 'Game Over'}
            </h2>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              The word was: <strong style={{ color: 'var(--primary-navy)' }}>{targetWord}</strong>
            </div>
            {won && (
              <div style={{ fontSize: '12px', marginBottom: '30px', color: 'var(--text-medium)' }}>
                Solved in {guesses.length} {guesses.length === 1 ? 'attempt' : 'attempts'}!
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/games')} className="retro-btn">
                Back to Games
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Wordle;