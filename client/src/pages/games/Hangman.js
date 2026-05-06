import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import getImageUrl from '../../utils/getImageUrl';

const Hangman = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data);
        setWord(response.data.content.word.toUpperCase()); // backend supplies word
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    fetchGame();
  }, [id]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || completed) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= 6) {
        setCompleted(true);
        setWon(false);
      }
    } else {
      const allLettersGuessed = word.split('').every((l) => guessedLetters.includes(l) || l === letter);
      if (allLettersGuessed) {
        setCompleted(true);
        setWon(true);
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, idx) => (
      <span
        key={idx}
        style={{
          display: 'inline-block',
          margin: '0 5px',
          fontSize: '20px',
          borderBottom: '3px solid var(--primary-navy)',
          width: '20px',
          textAlign: 'center'
        }}
      >
        {guessedLetters.includes(letter) ? letter : ''}
      </span>
    ));
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (!game) {
    return (
      <motion.div className="retro-card pixel-corners" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="neon-text">Loading Hangman...</h2>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div
        className="retro-card pixel-corners"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="neon-text" style={{ animation: 'glow 1.5s infinite alternate' }}>
          {won ? '🎉 You Won!' : '💀 Game Over'}
        </h2>
        <p>The word was: {word}</p>
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

  return (
    <div className="retro-container">
      <motion.div
        className="retro-card pixel-corners"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="neon-text" style={{ animation: 'glow 2s infinite alternate' }}>
          Hangman
        </h3>

        {/* Hangman image stage */}
        <div style={{ margin: '20px auto', textAlign: 'center' }}>
          <img
            src={getImageUrl(`/hangman/hangman${wrongGuesses}.png`)}
            alt={`Hangman stage ${wrongGuesses}`}
            className="pixel-corners"
            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
          />
        </div>

        {/* Word display */}
        <div style={{ margin: '20px 0', fontSize: '24px' }}>
          {renderWord()}
        </div>

        {/* Wrong guesses counter */}
        <p className="neon-text">Wrong guesses: {wrongGuesses} / 6</p>

        {/* Alphabet buttons */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {alphabet.map((letter) => (
            <motion.button
              key={letter}
              className="retro-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              disabled={guessedLetters.includes(letter)}
              onClick={() => handleGuess(letter)}
              style={{ width: '40px', height: '40px', padding: '0' }}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Hangman;
