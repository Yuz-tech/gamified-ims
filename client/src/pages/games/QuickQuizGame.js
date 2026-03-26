import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from '../../utils/api';
import { useAuth } from "../../context/AuthContext";

const QuickQuizGame = ({ game }) => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswer(optionIndex);
    };

    const handleNext = () => {
        if (selectedAnswer === null) {
            alert('Please select an answer');
            return;
        }

        const newAnswers = { ...answers, [currentQuestion]: selectedAnswer};
        setAnswers(newAnswers);

        const correct = selectedAnswer === game.questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(() => {
            if (currentQuestion < game.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                submitGame(newAnswers);
            }
        }, 2000);
    };

    const submitGame = async(finalAnswers) => {
        try {
            const response = await api.post(`/games/${game._id}/submit`, { answers: finalAnswers });
            setResult(response.data);
            setSubmitted(true);

            const userResponse = await api.get('/auth/me');
            updateUser(userResponse.data);
        } catch (error) {
            console.error('Error submitting game: ', error);
            alert('Failed to submit answers');
        }
    };

    if (submitted && result) {
        return (
            <div className="retro-container" style={{ paddingTop: '40px' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="retro-card"
                    style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '72px', marginBottom: '20px'}}>
                        {result.percentage >= 70 ? 'GREAT' : result.percentage >= 50 ? 'NICE' : "At least you tried"}
                    </div>
                    <h2 style={{ fontSize: '24px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        Quiz Complete!
                    </h2>
                    <div style={{ 
                        padding: '20px',
                        background: 'rgba(236, 72, 153, 0.1)',
                        border: '2px solid var(--secondary-pink)',
                        marginBottom: '20px'
                    }}>
                        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                            Score: {result.correctCount} / {result.totalQuestions} ({result.percentage} %)
                        </div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--secondary-pink)' }}>
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
                    <button onClick={() => navigate('/games')} className="retro-btn" style={{ width: '100%'}}>
                        Back to Games
                    </button>
                </motion.div>
            </div>
        );
    }

    const question = game.questions[currentQuestion];

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
                Back
            </button>

            <motion.div key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="retro-card"
            >
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                        Question {currentQuestion + 1} of {game.questions.length}
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--bg-medium)',
                        border: '2px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: `${((currentQuestion + 1) / game.questions.length) * 100}%`,
                            height: '100%',
                            background: 'var(--secondary-pink)',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>

                <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '30px', lineHeight: '1.6' }}>
                    {question.question}
                </h2>

                {!showResult ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            {question.options.map((option, index) => (
                                <button key={index} onClick={() => handleAnswerSelect(index)} style={{
                                    padding: '15px',
                                    border: `3px solid ${selectedAnswer === index ? 'var(--secondary-pink)' : 'var(--border-color)'}`,
                                    background: selectedAnswer === index ? 'rgba(236, 72, 153, 0.1)' : 'white',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                                className="quiz-option"
                                >
                                    <strong>
                                        {String.fromCharCode(65 + index)}.
                                    </strong>
                                    {option}
                                </button>
                            ))}
                        </div>

                        <button onClick={handleNext} className="retro-btn" style={{ width: '100%' }} disabled={selectedAnswer === null}>
                            {currentQuestion === game.questions.length - 1 ? 'FINISH' : 'NEXT'}
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                            {isCorrect ? '✅' : '❌'}
                        </div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: isCorrect ? 'var(--success-green)' : 'var(--error-red)',
                            marginBottom: '10px'
                        }}>
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </div>
                        {!isCorrect && (
                            <div style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                                Correct answer: <strong>{String.fromCharCode(65 + question.correctAnswer)}</strong>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            <style>{`
                .quiz-option:hover {
                    transform: translateX(5px);
                    border-color: var(--secondary-pink) !important;
                }
            `}</style>
        </div>
    );
};

export default QuickQuizGame;