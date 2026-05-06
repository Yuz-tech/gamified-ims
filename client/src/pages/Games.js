import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import api from '../utils/api';

const Games = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    gameType: 'wordle',
    difficulty: 'easy',
    timeLimit: 0,
    content: {}
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games: ', error);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async () => {
    try {
      await api.post('/games', newGame);
      setNewGame({ title: '', description: '', gameType: 'wordle', difficulty: 'easy', timeLimit: 0, content: {} });
      fetchGames();
    } catch (error) {
      console.error('Error creating game: ', error);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await api.delete(`/games/${id}`);
      fetchGames();
    } catch (error) {
      console.error('Error deleting game: ', error);
    }
  };

if (loading) {
    return (
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className='loading neon-text'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='retro-container'>
      <h2 className='neon-text'>IMS Awareness Games!</h2>
      {loading ? (
        <p>Loading games...</p>
      ) : (
        games.map((game) => (
          <div key={game.id} className='retro-card pixel-corners'>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <p>Type: {game.gameType} | Difficulty: {game.difficulty}</p>

            <div style={{ marginTop: '10px' }}>
              <button className='retro-btn secondary' onClick={() => alert('Play')}>
                PLAY
              </button>
              {user?.role === 'admin' && (
                <button className='retro-btn danger' onClick={() => deleteGame(game._id)} style={{ marginLeft: '10px' }}>
                  DELETE
                </button>
              )}
            </div>
          </div>
        )))
      }

      {user?.role === 'admin' && (
        <div className='retro-card pixel-corners'>
          <h3>CREATE NEW GAME</h3>
          <input
            className='retro-input'
            placeholder='Title'
            value={newGame.title}
            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
          />
          <textarea
            className='retro-input'
            placeholder='Description'
            value={newGame.description}
            onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
          />
          <select
            className='retro-input'
            value={newGame.gameType}
            onChange={(e) => setNewGame({ ...newGame, gameType: e.target.value })}
          >
            <option value="texttwist">TextTwist</option>
            <option value="wordle">Wordle</option>
            <option value="quickquiz">QuickQuiz</option>
            <option value="hangman">Hangman</option>
          </select>
          <select
            className='retro-input'
            value={newGame.difficulty}
            onChange={(e) => setNewGame({ ...newGame, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            className='retro-input'
            type='number'
            placeholder='Time Limit (seconds)'
            value={newGame.timeLimit}
            onChange={(e) => setNewGame({ ...newGame, timeLimit: Number(e.target.value) })}
          />

          <button className='retro-btn' onClick={createGame} style={{ margin: '10px' }}>
            Create Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Games;