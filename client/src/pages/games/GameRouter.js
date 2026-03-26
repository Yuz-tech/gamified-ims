import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import CrosswordGame from './CrosswordGame';
import WordScrambleGame from './WordScrambleGame';
import QuickQuizGame from './QuickQuizGame';
import TrueFalseGame from './TrueFalseGame';

const GameRouter = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGame();
    }, [gameId]);

    const fetchGame = async () => {
        try {
            const response = await api.get(`/games/${gameId}`);
            setGame(response.data);
        } catch (error) {
            console.error('Error fetching game: ', error);
            alert('Failed to load');
            navigate('/games');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading Game...</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Game not found</h2>
                <button onClick={() => navigate('/games')} className="retro-btn">
                    Back to Games
                </button>
            </div>
        );
    }

    switch (game.type) {
        case 'crossword':
            return <CrosswordGame game = {game} />;
        case 'word_scramble':
            return <WordScrambleGame game = {game} />;
        case 'quick_quiz':
            return <QuickQuizGame game = {game} />;
        case 'true_false':
            return <TrueFalseGame game = {game} />;
        default:
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>Unknown game type: {game.type}</h2>
                    <button onClick={() => navigate('/games')} className="retro-btn">
                        Back to Games
                    </button>
                </div>
            );
    }
};

export default GameRouter;