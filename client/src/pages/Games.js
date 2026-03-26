import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Games = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await api.get('/games');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching game: ', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || game.type === filter;
        return matchesSearch && matchesFilter;
    });

    const gamesByType = {
        crossword: filteredGames.filter(g => g.type === 'crossword'),
        word_scramble: filteredGames.filter(g => g.type === 'word_scramble'),
        quick_quiz: filteredGames.filter(g => g.type === 'quick_quiz'),
        true_false: filteredGames.filter(g => g.type === 'true_false')
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy' : return 'var(--success-green)';
            case 'medium' : return 'var(--orange-accent)';
            case 'hard' : return 'var(--error-red)';
            default: return 'var(--text-medium)';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading Games...</div>
            </div>
        );
    }

    return (
        <div className = "retro-container" style={{ paddingTop: '40px' }}>
            <div className = "scanlines">

                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="neon-text"
                    style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
                >
                    IMS Awareness Games
                </motion.h1>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="retro-card"
                    style={{ marginBottom: '30px' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Search
                            </label>
                            <input type="text" className="retro-input" placeholder="Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Filter by type
                            </label>
                            <select className='retro-input' value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">All Games ({games.length})</option>
                                <option value="crossword">Crossword ({gamesByType.crossword.length})</option>
                                <option value="word_scramble">Word Scramble ({gamesByType.word_scramble.length})</option>
                                <option value="quick_quiz">Quick Quiz ({gamesByType.quick_quiz.length})</option>
                                <option value="true_false">True/False ({gamesByType.true_false.length})</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Games Grid */}
                {filteredGames.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-medium)'}} >
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎮</div>
                        <div style={{ fontSize: '14px' }}>No games found</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filteredGames.map((game, index) => (
                            <motion.div key={game._id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className='retro-card'
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    border: game.completed ? '3px solid var(--success-green)' : '2px solid var(--border-color)'
                                }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate(`/games/${game._id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    {game.completed && (
                                        <div style={{
                                            padding: '5px 10px',
                                            background: 'var(--success-green)',
                                            color: 'white',
                                            fontSize: '9px',
                                            fontWeight: 'bold',
                                            borderRadius: '3px'
                                        }}>
                                            Completed
                                        </div>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                                    {game.title}
                                </h3>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        background: getDifficultyColor(game.difficulty),
                                        color: 'white',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        borderRadius: '3px'
                                    }}>
                                        {game.difficulty}
                                    </span>
                                    <span style={{
                                        padding: '5px 10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '2px solid var(--bright-blue)',
                                        color: 'var(--bright-blue)',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        borderRadius: '3px'
                                    }}>
                                        {game.xpReward} XP
                                    </span>
                                </div>

                                <button className='retro-btn' style={{ width: '100%', fontSize: '11px' }}>
                                    {game.completed ? 'Play Again' : 'Play Now'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;