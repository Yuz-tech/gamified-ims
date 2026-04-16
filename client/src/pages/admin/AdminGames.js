import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import ConfirmModal from '.././components/ConfirmModal';

const AdminGames = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        gameType: 'crossword',
        difficulty: 'medium',
        maxXP: 200,
        timeLimit: 0,
        content: {}
    });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await api.get('/games/admin/all');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
            alert('Error loading games');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingGame(null);
        setFormData({
            title: '',
            description: '',
            gameType: 'crossword',
            difficulty: 'medium',
            maxXP: 100,
            timeLimit: 0,
            content: {}
        });
        setShowModal(true);
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        setFormData({
            title: game.title,
            description: game.description,
            gameType: game.gameType,
            difficulty: game.difficulty,
            maxXP: game.maxXP,
            timeLimit: game.timeLimit,
            content: game.content,
            isActive: game.isActive
        });
        setShowModal(true);
    };

    const handleDelete = (game) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Game',
            message: `Are you sure you want to delete this?`,
            onConfirm: () => confirmDelete(game._id)
        });
    };

    const confirmDelete = async (gameId) => {
        try {
            await api.delete(`/games/admin/${gameId}`);

            setConfirmModal({ ...confirmModal, isOpen: false });
            fetchGames();
            alert('Game deleted successfully!');
        } catch (error) {
            console.error('Error deleting game: ', error);
            alert('Error deleting game');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingGame) {
                await api.put(`/games/admin/${editingGame._id}`, formData);
                alert('Game updated successfully!');
            } else {
                await api.post('/games/admin/create', formData);
                alert('Game created successfully!');
            }
            setShowModal(false);
            fetchGames();
        } catch (error) {
            console.error('Error saving game: ', error);
            alert('Error saving game');
        }
    };

    const renderContentEditor = () => {
        const contentStr = JSON.stringify(formData.content, null, 2);

        return (
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                    Game Content (JSON)
                </label>
                <textarea value={contentStr} onChange={(e) => {
                    try {
                        const parsed = JSON.parse(e.target.value);

                        setFormData({ ...formData, content: parsed });
                    } catch (err) {
                        setFormData({ ...formData, content: e.target.value });
                    }
                }}
                style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '10px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-light)'
                }}
                placeholder={getContentTemplate(formData.gameType)}
                />
                <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginTop: '5px' }}>
                    {getContentHelp(formData.gameType)}
                </div>
            </div>
        );
    };

    const getContentTemplate = (gameType) => {
        switch (gameType) {
            case 'crossword':
                return JSON.stringify({
                    grid: [
                        ['Q', 'U', 'A', 'L', 'I', 'T', 'Y', null, null, null]
                    ],
                    clues: {
                        across: [{ number: 1, row: 0, col: 0, answer: 'QUALITY', clue: 'ISO 9001 focus (7)'}],
                        down: []
                    }
                }, null, 2);
            case 'wordle':
                return JSON.stringify({
                    words: [
                        { word: 'AUDIT', hint: 'Systematic examination' },
                        { word: 'RISKS', hint: 'Uncertainties' }
                    ]
                }, null, 2);
            case 'quickquiz':
                return JSON.stringify({
                    questions: [
                        {
                            question: 'What does IMS stand for?',
                            options: ['Integrated Management System', 'Other', 'Other', 'Other'],
                            correctAnswer: 0,
                            points: 10
                        }
                    ]
                }, null, 2);
            default:
                return '{}';
        }
    };

    const getContentHelp = (gameType) => {
        switch (gameType) {
            case 'crossword':
                return 'Grid: 10x10 array, use null for black cells. Clues: across/down arrays with number, row, col, answer, clue';
            case 'wordle':
                return 'Words: array of {word, hint}. Words can be 4-6 letters.';
            case 'quickquiz':
                return 'Questions: array of {question, options (4 items), correctAnswer (0-3 index), points}';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)' }}>
                    Manage Games
                </h1>
                <button onClick={handleCreate} className="retro-btn">
                    + Create Game
                </button>
            </div>

            {/* Games Table */}
            <div className="retro-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Difficulty</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Max XP</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Time Limit</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map(game => (
                            <tr key={game._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{game.title}</div>
                                </td>
                                <td style={{ padding: '15px', textTransform: 'capitalize' }}>{game.gameType}</td>
                                <td style={{ padding: '15px', textTransform: 'capitalize' }}>{game.difficulty}</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: 'var(--bright-blue)', fontWeight: 'bold' }}>{game.maxXP}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{game.timeLimit > 0 ? `${Math.floor(game.timeLimit / 60)}:${(game.timeLimit % 60).toString().padStart(2, '0')}` : 'None'} </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        background: game.isActive ? 'var(--success-green)' : 'var(--text-medium)',
                                        color: 'white',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        borderRadius: '3px'
                                    }}>
                                        {game.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => handleEdit(game)} className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 12px', marginRight: '5px' }}>
                                        EDIT
                                    </button>
                                    <button onClick={() => handleDelete(game)} className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 12px'}}>
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {games.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-medium)' }}>
                        No games found
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="retro-card"
                        style={{
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            margin: '20px'
                        }}
                    >
                        <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                            {editingGame ? 'EDIT GAME' : 'CREATE GAME'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                                    Title *
                                </label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({
                                    ...formData, title: e.target.value
                                })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '12px',
                                    border: '2px solid var(--border-color)'
                                }}
                                />
                            </div>

                            {/* Game Type */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px'}}>
                                    Game Type*
                                </label>
                                <select value={formData.gameType} onChange={(e) => setFormData({ ...formData, gameType: e.target.value })} style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '12px',
                                    border: '2px solid var(--border-color)'
                                }}
                                >
                                    <option value="crossword">Crossword</option>
                                    <option value="wordle">Wordle</option>
                                    <option value="quickquiz">Quick Quiz</option>
                                </select>
                            </div>

                            {/* Difficulty, Max XP, Time Limit */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                                        Difficulty
                                    </label>
                                    <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} style={{
                                        width: '100%',
                                        padding: '10px',
                                        fontSize: '12px',
                                        border: '2px solid var(--border-color)'
                                    }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                                        Max XP
                                    </label>
                                    <input type="number" value={formData.maxXP} onChange={(e) => setFormData({ ...formData, maxXP: parseInt(e.target.value) })}
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            fontSize: '12px',
                                            border: '2px solid var(--border-color)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                                        Time Limit (sec)
                                    </label>
                                    <input type="number" value={formData.timeLimit} onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })} min="0" style={{
                                        width: '100%',
                                        padding: '10px',
                                        fontSize: '12px',
                                        border: '2px solid var(--border-color)'
                                    }}
                                    />
                                </div>
                            </div>

                            {/* Active Status */}
                            {editingGame && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                                        <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ marginRight: '10px' }} />
                                        Active
                                    </label>
                                </div>
                            )}

                            {/* Content Editor */}
                            {renderContentEditor()}

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                                    {editingGame ? 'UPDATE GAME' : 'CREATE GAME'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="retro-btn secondary" style={{ flex: 1 }}>
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default AdminGames;