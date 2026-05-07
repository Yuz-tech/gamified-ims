import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const Hangman = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const maxWrong = 6;

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await api.get(`/games/${id}`);
      const gameData = response.data;
      const config = gameData.configs.find(c => c.gameType === 'hangman');
      if (config) {
        setGame(config);
        setTargetWord(config.data.hangman.targetWord);
      }
    } catch (error) {
      console.error('Failed to load Hangman:', error);
    }
  };

  const guessLetter = (letter) => {
    if (!guessedLetters.includes(letter) && !gameOver) {
      const upperLetter = letter.toUpperCase();
      setGuessedLetters([...guessedLetters, upperLetter]);
      
      if (targetWord.includes(upperLetter)) {
        // Correct guess
        const allCorrect = targetWord.split('').every(char => 
          guessedLetters.includes(char.toUpperCase()) || char === ' '
        );
        if (allCorrect) {
          setWon(true);
          setGameOver(true);
        }
      } else {
        // Wrong guess
        setWrongGuesses(wrongGuesses + 1);
        if (wrongGuesses + 1 >= maxWrong) {
          setGameOver(true);
        }
      }
    }
  };

  const displayWord = targetWord.split('').map((char, i) => {
    const upperChar = char.toUpperCase();
    return guessedLetters.includes(upperChar) || char === ' ' 
      ? char 
      : '_';
  }).join(' ');

  const keyboardLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (!game) return <div className="loading neon-text">LOADING HANGMAN...</div>;

  return (
    <div className="retro-container">
      <div className="retro-card pixel-corners">
        <h1 className="neon-text">{game.title}</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '24px', letterSpacing: '5px', marginBottom: '10px' }}>
            {displayWord}
          </div>
          {game.data.hangman.hint && (
            <div className="text-light">Hint: {game.data.hangman.hint}</div>
          )}
          <div>Wrong: {wrongGuesses}/{maxWrong}</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '5px', marginBottom: '20px' }}>
          {keyboardLetters.map((letter) => (
            <button 
              key={letter}
              className={`retro-btn secondary ${guessedLetters.includes(letter) ? 'retro-btn' : ''}`}
              style={{ fontSize: '14px', padding: '10px 5px' }}
              onClick={() => guessLetter(letter)}
              disabled={guessedLetters.includes(letter) || gameOver}
            >
              {letter}
            </button>
          ))}
        </div>
        
        {gameOver && (
          <div style={{ textAlign: 'center' }}>
            <h2 className={`neon-text ${won ? 'text-success' : 'text-error'}`}>
              {won ? '🎉 YOU WIN!' : `Game Over - Word: ${targetWord}`}
            </h2>
            <button className="retro-btn" onClick={() => window.history.back()}>
              NEW GAME
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hangman;