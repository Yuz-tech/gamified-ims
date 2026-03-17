import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Games = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');

    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        filterGames();
    }, [games, filterType, filterDifficulty]);

    const fetchGames = async () => {
        try {
            const response = await api.get('/games');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games: ', error);
            alert('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    const filterGames = () => {
        let filtered = [...games];

        if (filterType !== 'all') {
            filtered = filtered.filter(game => game.type === filterType);
        }

        if (filterDifficulty !== 'all') {
            filtered = filtered.filter(game => game.difficulty === filterDifficulty);
        }

        setFilteredGames(filtered);
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'var(--success-green)',
            medium: 'var(--orange-accent)',
            hard: 'var(--error-red)'
        };
        return colors[difficulty] || 'var(--text-medium)';
    };

    if (loading) {
        return (
            <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading Games...</div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <div className="scanlines"></div>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="neon-text"
              style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}>
                IMS Training Games
              </motion.h1>

              {/* Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Game Type
                            </label>
                            <select className="retro-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: '100%' }}>
                                <option value="all">All Types</option>
                                <option value="crossword">Crossword</option>
                                <option value="word_scramble">Word Scramble</option>
                                <option value="quick_quiz">Quick Quiz</option>
                                <option value="true_false">True/False</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Difficulty
                            </label>
                            <select className="retro-input" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} style={{ width: '100%' }}>
                                <option value="all">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
                                Showing {filteredGames.length} of {games.length} games
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Games Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredGames.map((game, index) => (
                        <motion.div 
                          key={game._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="retro-card"
                          style={{ cursor: 'pointer', position: 'relative' }}
                          onClick={() => navigate(`/games/${game._id}`)}
                        >
                            <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                                {game.title}
                            </h3>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                marginBottom: '15px'
                            }}>
                                <span style={{
                                    padding: '4px 12px',
                                    background: getDifficultyColor(game.difficulty),
                                    color: 'white',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    textTransform: 'uppercase'
                                }}>
                                    {game.difficulty}
                                </span>

                                <span style={{
                                    padding: '4px 12px',
                                    background: 'var(--bright-blue)',
                                    color: 'white',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    borderRadius: '12px'
                                }}>
                                    {game.xpReward} XP
                                </span>
                            </div>

                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', textAlign: 'center', marginBottom: '15px' }}>
                                {Math.floor(game.timeLimit / 60)} minutes
                            </div>

                            {game.userProgress && (
                                <div style = {{
                                    padding: '10px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '2px solid var(--success-green)',
                                    fontSize: '10px',
                                    textAlign: 'center'
                                }}>
                                    Completed | Best: {game.userProgress.bestScore}%
                                </div>
                            )}

                            <button className="retro-btn" style={{ width: '100%', marginTop: '15px', fontSize: '11px' }}>
                                {game.userProgress ? 'Play Again' : 'Play Now'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-medium)' }}>
                        <div>
                            No games found
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Games;