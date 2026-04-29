import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const TextTwist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchGame();
  }, [id]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft === 0 && !gameOver) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/games/play/${id}`);
      const gameData = response.data;
      setGame(gameData);
      
      // Pick random word from the list
      const words = gameData.content.words;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
      
      // Scramble the main word
      const letters = randomWord.mainWord.split('');
      setScrambledLetters(shuffleArray([...letters]));
      
      setTimeLeft(gameData.timeLimit || 120);
    } catch (error) {
      console.error('Error fetching game:', error);
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

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startGame = () => {
    setGameStarted(true);
    setFoundWords([]);
    setCurrentInput('');
    setMessage('');
  };

  const handleLetterClick = (letter, index) => {
    if (currentInput.length < currentWord.mainWord.length) {
      setCurrentInput(currentInput + letter);
      // Remove letter from available (visually)
      const newLetters = [...scrambledLetters];
      newLetters[index] = null;
      setScrambledLetters(newLetters);
    }
  };

  const handleClear = () => {
    setCurrentInput('');
    // Reshuffle letters instead of showing them in order
    setScrambledLetters(shuffleArray([...currentWord.mainWord.split('')]));
  };

  const handleSubmitWord = () => {
    if (currentInput.length < 3) {
      setMessage('Word must be at least 3 letters!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const upperInput = currentInput.toUpperCase();
    
    // Check if already found
    if (foundWords.includes(upperInput)) {
      setMessage('Already found!');
      setTimeout(() => setMessage(''), 2000);
      handleClear();
      return;
    }

    // Check if valid word
    const allValidWords = [currentWord.mainWord, ...currentWord.subwords];
    if (allValidWords.includes(upperInput)) {
      setFoundWords([...foundWords, upperInput]);
      setMessage('✓ Correct!');
      setTimeout(() => setMessage(''), 1000);
      
      // Check if found main word
      if (upperInput === currentWord.mainWord) {
        endGame(true);
      }
    } else {
      setMessage('✗ Not a valid word!');
      setTimeout(() => setMessage(''), 2000);
    }
    
    // Always reshuffle after submitting (correct or wrong)
    handleClear();
  };

  const handleTwist = () => {
    setScrambledLetters(shuffleArray([...currentWord.mainWord.split('')]));
    setCurrentInput('');
  };

  const endGame = async (foundMainWord = false) => {
    setGameOver(true);
    
    const allValidWords = [currentWord.mainWord, ...currentWord.subwords];
    const percentage = Math.round((foundWords.length / allValidWords.length) * 100);
    let score = Math.round((percentage / 100) * game.maxXP);
    
    // Bonus if found main word
    if (foundMainWord || foundWords.includes(currentWord.mainWord)) {
      score = game.maxXP;
    }

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      await api.post('/games/submit-score', {
        gameId: game._id,
        gameType: 'texttwist',
        score,
        timeSpent: timeTaken
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING GAME...</div>
      </div>
    );
  }

  if (!game || !currentWord) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error-red)' }}>Game Not Found</h2>
          <button onClick={() => navigate('/games')} className="retro-btn">BACK TO GAMES</button>
        </div>
      </div>
    );
  }

  const allValidWords = [currentWord.mainWord, ...currentWord.subwords];

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
        ← BACK TO GAMES
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ maxWidth: '700px', margin: '0 auto' }}
      >
        <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px', textAlign: 'center' }}>
           {game.title}
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginBottom: '30px', textAlign: 'center' }}>
          {game.description}
        </p>

        {!gameStarted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔤</div>
            <h2 style={{ fontSize: '20px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              READY TO PLAY?
            </h2>
            <div style={{ fontSize: '12px', marginBottom: '30px', lineHeight: '1.8' }}>
              <p>• Form words using the scrambled letters</p>
              <p>• Find the main word ({currentWord.mainWord.length} letters) to win!</p>
              <p>• {formatTime(game.timeLimit || 120)} time limit</p>
              <p>• Max {game.maxXP} XP</p>
            </div>
            <button onClick={startGame} className="retro-btn" style={{ fontSize: '14px', padding: '15px 30px' }}>
              START GAME
            </button>
          </div>
        ) : !gameOver ? (
          <>
            {/* Timer and Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div style={{
                padding: '10px 20px',
                background: timeLeft <= 10 ? 'var(--error-red)' : 'var(--bright-blue)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '3px'
              }}>
                 {formatTime(timeLeft)}
              </div>
              <div style={{
                padding: '10px 20px',
                background: 'var(--success-green)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '3px'
              }}>
                {foundWords.length} / {allValidWords.length} Words
              </div>
            </div>

            {/* Current Input Display */}
            <div style={{
              padding: '20px',
              background: 'var(--bg-light)',
              border: '3px solid var(--primary-navy)',
              marginBottom: '20px',
              textAlign: 'center',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-navy)', letterSpacing: '5px' }}>
                {currentInput || '_ _ _ _ _ _'}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: '10px',
                background: message.includes('✓') ? 'var(--success-green)' : 'var(--orange-accent)',
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                fontWeight: 'bold'
              }}>
                {message}
              </div>
            )}

            {/* Letter Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '20px',
              padding: '20px',
              background: 'var(--bg-light)',
              border: '2px solid var(--border-color)'
            }}>
              {scrambledLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => letter && handleLetterClick(letter, index)}
                  disabled={!letter}
                  className="retro-btn"
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    padding: '0',
                    opacity: letter ? 1 : 0.3,
                    cursor: letter ? 'pointer' : 'not-allowed'
                  }}
                >
                  {letter || ''}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              <button onClick={handleSubmitWord} className="retro-btn" style={{ flex: 1 }}>
                ✓ SUBMIT WORD
              </button>
              <button onClick={handleClear} className="retro-btn secondary" style={{ flex: 1 }}>
                CLEAR
              </button>
              <button onClick={handleTwist} className="retro-btn secondary" style={{ flex: 1 }}>
                🔄 TWIST
              </button>
            </div>

            {/* Found Words */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
                FOUND WORDS:
              </h3>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {foundWords.map((word, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '5px 10px',
                      background: word === currentWord.mainWord ? 'var(--success-green)' : 'var(--bright-blue)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '3px'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {foundWords.includes(currentWord.mainWord) ? '🎉' : '⏰'}
            </div>
            <h2 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
              {foundWords.includes(currentWord.mainWord) ? 'EXCELLENT!' : 'TIME\'S UP!'}
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                You found <strong>{foundWords.length}</strong> out of <strong>{allValidWords.length}</strong> words
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                The main word was: <strong style={{ color: 'var(--primary-navy)' }}>{currentWord.mainWord}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>All valid words:</h3>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {allValidWords.map((word, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '5px 10px',
                      background: foundWords.includes(word) ? 'var(--success-green)' : 'var(--text-medium)',
                      color: 'white',
                      fontSize: '10px',
                      borderRadius: '3px'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/games')} className="retro-btn">
                BACK TO GAMES
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TextTwist;