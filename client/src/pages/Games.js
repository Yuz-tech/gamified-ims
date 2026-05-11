import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameTypes, setGameTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
      
      // Extract unique game types
      const types = response.data.map(game => 
        game.configs.map(config => config.gameType)
      ).flat().filter((type, i, arr) => arr.indexOf(type) === i);
      setGameTypes(['all', ...types]);
      
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = selectedType === 'all' 
    ? games 
    : games.filter(game => 
        game.configs.some(config => config.gameType === selectedType)
      );

  const playGame = (gameSlug, config) => {
    navigate(`/games/${config.gameType}/${gameSlug}`);
  };

  if (loading) {
    return (
      <div className="retro-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="loading neon-text" style={{ fontSize: '24px' }}>LOADING GAMES...</div>
      </div>
    );
  }

  return (
    <div className="retro-container">
      <div className="retro-card pixel-corners">
        <h1 className="neon-text">🎮 IMS TRAINING GAMES</h1>
        <p>Test your workplace safety &amp; compliance knowledge!</p>
        
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {gameTypes.map(type => (
            <button
              key={type}
              className={`retro-btn ${selectedType === type ? '' : 'secondary'}`}
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'ALL GAMES' : type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredGames.map((game) => (
            <div key={game._id} className="retro-card pixel-corners">
              <h3>{game.name}</h3>
              <p className="text-light">{game.description}</p>
              
              <div style={{ marginTop: '20px' }}>
                {game.configs.map((config, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <div className="badge-info" style={{ marginBottom: '10px' }}>
                      {config.title} ({config.gameType.toUpperCase()})
                    </div>
                    <button
                      className="retro-btn"
                      style={{ width: '100%' }}
                      onClick={() => playGame(game.slug, config)}
                    >
                      🎮 PLAY {config.gameType.toUpperCase()}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2 className="neon-text">No games found</h2>
            <p>Try another filter or contact admin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;