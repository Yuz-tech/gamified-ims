import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Games = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await api.get('/games');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games: ', error);
            alert('Error loading games');
        } finally {
            setLoading (false);
        }
    };

    const filteredGames = games.filter(game => {
        if (filterType !== 'all' && game.type !== filterType) return false;
        if (filterDifficulty !== 'all' && game.difficulty !== filterDifficulty) return false;
        return true;
    });

    const gameTypeNames = {
        crossword: 'Crossword Puzzle',
        image_match: 'Image Match',
        quick_quiz: 'Quick Quiz',
        word_scramble: 'Word Scramble',
        memory_match: 'Memory Match',
        flashcards: 'Flash Cards'
    };

    const difficultyColors = {
        easy: 'var(--success-green)',
        medium: 'var(--orange-accent)',
        hard: 'var(--error-red)'
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
              style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center', color: 'var(--primary-navy)' }}>
                Training Games
              </motion.h1>

              {/* Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ marginBottom: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, var(--bg-light) 100%)' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '15px' }}>
                        Earn XP through games
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', fontSize: '10px' }}>
                        <div>
                            <div style = {{ fontSize: '20px', color: 'var(--success-green)', marginBottom: '5px' }}>+50 XP</div>
                            <div style = {{ color: 'var(--text-medium)' }}>First Completion</div>
                        </div>
                        <div>
                            <div style = {{ fontSize: '20px', color: 'var(--bright-blue)', marginBottom: '5px' }}>+12 XP</div>
                            <div style={{ color: 'var(--text-medium)' }}>New Best Score</div>
                        </div>
                        <div>
                            <div style = {{ fontSize: '20px', color: 'var(--orange-accent)', marginBottom: '5px' }}>+5 XP</div>
                            <div style = {{ color: 'var(--text-medium)' }}>Replay Completion</div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="retro-card"
                  style={{ marginBottom: '30px' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Game Type
                            </label>
                            <select className="retro-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: '100%' }}>
                                <option value = "all">All Types</option>
                                <option value = "crossword">Crossword</option>
                                <option value = "image_match">Image Match</option>
                                <option value = "quick_quiz">Quick Quiz</option>
                                <option value = "word_scramble">Word Scramble</option>
                                <option value = "memory_match">Memory Match</option>
                                <option value = "flashcards">Flash Cards</option>
                            </select>
                        </div>
                        <div>
                            <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Difficulty
                            </label>
                            <select className="retro-input" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} style={{ width: '100%' }}>
                                <option value = "all">All Difficulties</option>
                                <option value = "easy">Easy</option>
                                <option value = "medium">Medium</option>
                                <option value = "hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div style = {{ marginTop: '15px', fontSize: '10px', color: 'var(--text-medium)' }}>
                        Showing {filteredGames.length} of {games.length} games
                    </div>
                </motion.div>

                {/* Games Grid */}
                {filteredGames.length === 0 ? (
                    <div className="retro-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <h3 style={{ fontSize: '14px', color: 'var(--text-medium)' }}>
                            No Games Found
                        </h3>
                    </div>
                ) : (
                    <div style = {{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        {filteredGames.map((game, index) => (
                            <motion.div 
                              key={game._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="retro-card"
                              style={{
                                cursor: 'pointer',
                                background: game.userProgress?.completed
                                  ? 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, var(--bg-light) 100%)'
                                  : 'var(--bg-light)',
                                borderColor: game.userProgress?.completed
                                  ? 'var(--success-green)'
                                  : 'var(--border-color)'
                              }}
                              onClick={() => navigate(`/games/${game._id}`)}
                              >
                                {/* Title */}
                                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', fontWeight: 'bold', marginBottom: '5px' }}>
                                        {game.title}
                                    </h3>
                                    <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                                        {gameTypeNames[game.type]}
                                    </div>
                                </div>

                                {/* Difficulty & XP */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '10px' }}>
                                    <div style={{
                                        padding: '5px 10px',
                                        background: `${difficultyColors[game.difficulty]}20`,
                                        color: difficultyColors[game.difficulty],
                                        border: `2px solid ${difficultyColors[game.difficulty]}`,
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {game.difficulty}
                                    </div>
                                    <div style={{
                                        padding: '5px 10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: 'var(--bright-blue)',
                                        border: '2px solid var(--bright-blue)',
                                        fontWeight: 'bold'
                                    }}>
                                        {game.xpReward} XP
                                    </div>
                                </div>

                                {/* Progress */}
                                {game.userProgress && (
                                    <div style = {{
                                        padding: '10px',
                                        background: 'rgba(59, 130, 246, 0.05)',
                                        border: '2px solid var(--bright-blue)',
                                        marginBottom: '15px',
                                        fontSize: '9px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span>Best Score: </span>
                                            <span style={{ fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                                                {game.userProgress.bestScore}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span>
                                                Attempts:
                                            </span>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {game.userProgress.attempts}
                                            </span>
                                        </div>
                                        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>
                                                XP Earned: 
                                            </span>
                                            <span style={{ fontWeight: 'bold', color: 'var(--success-green)' }}>
                                                +{game.userProgress.xpEarned}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Button */}
                                <button className="retro-btn" style={{
                                    width: '100%',
                                    background: game.userProgress?.completed ? 'var(--success-green)' : 'var(--bright-blue)',
                                    fontSize: '11px',
                                    padding: '12px'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/games/${game._id}`);
                                }}
                                >
                                    {game.userProgress?.completed ? 'Play Again' : 'Play Now'}
                                </button>
                              </motion.div>
                        ))}
                    </div>
                )}

                <style>{`
                    .retro-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 5px 5px 0 var(--primary-navy);
                    }
                `}</style>
        </div>
    );
};

export default Games;