import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const TextTwist = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [letters, setLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [validWords, setValidWords] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await api.get(`/games/${id}`);
      const gameData = response.data;
      const config = gameData.configs.find(c => c.gameType === 'texttwist');
      if (config) {
        setGame(config);
        setLetters(config.data.texttwist.scrambledLetters.split(''));
        setValidWords(config.data.texttwist.validWords);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  };

  const handleLetterClick = (letter) => {
    if (currentWord.length < 8) {
      setCurrentWord(currentWord + letter);
    }
  };

  const submitWord = () => {
    const wordUpper = currentWord.toUpperCase();
    if (validWords.includes(wordUpper) && !foundWords.includes(wordUpper)) {
      const newFound = [...foundWords, wordUpper];
      setFoundWords(newFound);
      setScore(score + 100);
      if (newFound.length === validWords.length) {
        setGameOver(true);
      }
    }
    setCurrentWord('');
  };

  const shuffleLetters = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setLetters(shuffled);
  };

  if (!game) return <div className="loading neon-text">LOADING...</div>;

  return (
    <div className="retro-container">
      <div className="retro-card pixel-corners">
        <h1 className="neon-text">{game.title}</h1>
        <div className="badge-info">Score: {score}</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', margin: '20px 0' }}>
          {letters.map((letter, i) => (
            <button 
              key={i}
              className="retro-btn"
              style={{ fontSize: '16px', padding: '15px 10px', height: '60px' }}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <div className="retro-input" style={{ fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>
            {currentWord.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="retro-btn" onClick={submitWord}>SUBMIT</button>
            <button className="retro-btn secondary" onClick={() => setCurrentWord('')}>CLEAR</button>
            <button className="retro-btn secondary" onClick={shuffleLetters}>SHUFFLE</button>
          </div>
        </div>
        
        <div>
          <h3>Found ({foundWords.length}/{validWords.length}):</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {foundWords.map((word, i) => (
              <span key={i} className="badge-success">{word}</span>
            ))}
          </div>
        </div>
        
        {gameOver && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2 className="neon-text text-success">🎉 PERFECT!</h2>
            <button className="retro-btn" onClick={() => window.history.back()}>
              PLAY ANOTHER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextTwist;