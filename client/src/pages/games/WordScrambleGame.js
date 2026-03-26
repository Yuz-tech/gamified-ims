import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const WordScrambleGame = ({ game }) => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnswerChange = (index, value) => {
        setAnswers({
            ...answers,
            [index]: value.toUpperCase()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(`/games/${game._id}/submit`, { answers });
            setResult(response.data);
            setSubmitted(true);

            const userResponse = await api.get('/auth/me');
            updateUser(userResponse.data);
        } catch (error) {
            console.error('Error submitting game: ', error);
            alert('Failed to submit answers');
        } finally {
            setLoading(false);
        }
    };

    if (submitted && result) {
        return (
            <div className="retro-container" style={{ paddingTop: '40px' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="retro-card"
                    style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}
                >
                    <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                        {result.percentage >= 70 ? 'GREAT' : result.percentage >= 50 ? 'NICE' : "You didn't even try"}
                    </div>
                    <h2 style={{ fontSize: '24px', color: 'var(--success-green)', marginBottom: '20px' }}>
                        Game complete!
                    </h2>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '2px solid var(--success-green)',
                        marginBottom: '20px'
                    }}>
                        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                            Score: {result.correctCount} / {result.totalQuestions} ({result.percentage}%)
                        </div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--success-green)'}}>
                            +{result.score} XP
                        </div>
                    </div>
                    {result.leveledUp && (
                        <div style={{
                            padding: '15px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '2px solid var(--success-green)',
                            marginBottom: '20px',
                            fontSize: '12px',
                            color: 'var(--success-green)',
                            fontWeight: 'bold'
                        }}>
                            Level Up! You're now level {result.newLevel}!
                        </div>
                    )}
                    <button onClick={() => navigate('/games')} className="retro-btn" style={{ width: '100%' }}>
                        Back to Games
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
                Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
            >
                <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                    {game.title}
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '30px' }}>
                    Unscramble the words. Earn {game.xpReward} XP!
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                        {game.questions.map((question, index) => (
                            <div key={index} style={{
                                padding: '20px',
                                background: 'var(--bg-light)',
                                border: '2px solid var(--border-color)'
                            }}>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: 'var(--orange-accent)',
                                    letterSpacing: '8px',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    fontFamily: 'monospace'
                                }}>
                                    {question.scrambled}
                                </div>
                                <input type="text" className="retro-input" value={answers[index] || ''} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder="Your answer..." style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: '16px' }} required />
                                {question.hint && (
                                    <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px', textAlign: 'center' }}>
                                        Hint: {question.hint}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="retro-btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Answers'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default WordScrambleGame;