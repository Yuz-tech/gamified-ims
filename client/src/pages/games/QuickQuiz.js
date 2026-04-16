import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";

const QuickQuiz = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        fetchGame();
    }, [gameId]);

    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameStarted && timeLeft === 0 && !gameOver) {
            endGame();
        }
    }, [timeLeft, gameStarted, gameOver]);

    const fetchGame = async () => {
        try {
            const response = await api.get(`/games/${gameId}`);
            const gameData = response.data;
            setGame(gameData);

            setQuestions(gameData.content.questions);
            setTimeLeft(gameData.timeLimit || 120);
        } catch (error) {
            console.error('Error fetching game: ', error);
            alert('Error loading game');
            navigate('/games');
        } finally {
            setLoading(false);
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setStartTime(Date.now());
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setScore(0);
        setGameOver(false);
        setSelectedAnswer(null);
    };

    const handleAnswerSelect = (answerIndex) => {
        if (gameOver) return;
        setSelectedAnswer(answerIndex);
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        const newAnswers = [...answers, {
            questionIndex: currentQuestionIndex,
            selectedAnswer,
            correct: isCorrect,
            points: isCorrect ? (currentQuestion.points || 10) : 0
        }];

        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        } else {
            endGame(newAnswers);
        }
    };

    const endGame = async (finalAnswers = answers) => {
        setGameOver(true);

        const totalScore = finalAnswers.reduce((sum, answer) => sum + answer.points, 0);
        const maxScore = questions.reduce((sum, q) => sum + (q.points || 10), 0);
        const cappedScore = Math.min(totalScore, game.maxXP);

        setScore(cappedScore);
        
        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            await api.post('/games/submit-score', {
                gameId: game._id,
                gameType: 'quickquiz',
                score: cappedScore,
                timeSpent: timeTaken
            });
        } catch (error) {
            console.error('Error submitting score: ', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds/60);
        const secs = seconds % 60;
        return `${mins}: ${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = answers.filter(a => a.correct).length;

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px'}}>
                Back to Games
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ maxWidth: '700px', margin: '0 auto' }}
            >
                <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                    {game?.title || 'QUICK QUIZ'}
                </h1>

                {!gameStarted ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px'}}>
                            ⏱️
                        </div>
                        <h2 style={{ fontSize: '20px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                            Ready to Start?
                        </h2>
                        <div style={{ fontSize: '12px', marginBottom: '30px', lineHeight: '1.8' }}>
                            <p>• {questions.length} questions</p>
                            <p>• {formatTime(game.timeLimit || 120)} time limit</p>
                            <p>• {game.maxXP} XP maximum</p>
                        </div>
                        <button onClick={startGame} className="retro-btn" style={{ fontSize: '14px', padding: '15px 30px' }}>
                            Start Quiz
                        </button>
                    </div>
                ) : !gameOver ? (
                    <>
                        {/* TIMER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div style={{
                                padding: '10px 20px',
                                background: timeLeft <= 10 ? 'var(--error-red)' : 'var(--bright-blue)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                borderRadius: '3px'
                            }}>
                                {formatTime(timeLeft)}
                            </div>
                            <div style={{
                                padding: '10px 20px',
                                background: 'var(--primary-navy)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                borderRadius: '3px'
                            }}>
                                {currentQuestionIndex + 1} / {questions.length}
                            </div>
                        </div>

                        {/* Question */}
                        <div style={{
                            padding: '30px',
                            background: 'var(--bg-light)',
                            border: '3px solid var(--primary-navy)',
                            marginBottom: '30px'
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                                {currentQuestion.question}
                            </div>

                            <div style={{ display: 'grid', gap: '10px' }}>
                                {currentQuestion.options.map((option, idx) => (
                                    <button key={idx} onClick={() => handleAnswerSelect(idx)} className={selectedAnswer === idx ? 'retro-btn' : 'retro-btn secondary'} style={{
                                        textAlign: 'left',
                                        padding: '15px',
                                        fontSize: '12px'
                                    }}
                                    >
                                        {String.fromCharCode(65 + idx)}. {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="retro-btn" style={{
                            width: '100%',
                            fontSize: '14px',
                            opacity: selectedAnswer === null ? 0.5 : 1,
                            cursor: selectedAnswer === null ? 'not-allowed' : 'pointer'
                        }}
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'NEXT QUESTION' : 'FINISH QUIZ'}
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                            {correctAnswers === questions.length ? '' : correctAnswers >= questions.length * 0.7 ? '' : ''}
                        </div>
                        <h2 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                            QUIZ COMPLETE!
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                    CORRECT
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success-green)' }}>
                                    {correctAnswers}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                    TOTAL
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-navy)'}}>
                                    {questions.length}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                    XP EARNED
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                                    {score}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'left',
                            marginBottom: '30px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '20px',
                            background: 'var(--bg-light)',
                            border: '2px solid var(--border-color)'
                        }}>
                            <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>
                                REVIEW ANSWERS
                            </h3>
                            {answers.map((answer, idx) => {
                                const question = questions[answer.questionIndex];
                                return (
                                    <div key={idx} style={{
                                        marginBottom: '15px',
                                        padding: '10px',
                                        background: 'white',
                                        border: `2px solid ${answer.correct ? 'var(--success-green)' : 'var(--error-red)'}`
                                    }}
                                    >
                                        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
                                            Question {idx + 1}
                                        </div>
                                        <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                                            {question.question}
                                        </div>
                                        <div style={{ fontSize: '10px', color: answer.correct ? 'var(--success-green)' : 'var(--error-red)' }}>
                                            {answer.correct ? 'Correct' : `Wrong - Correct: ${question.options[question.correctAnswer]}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => navigate('/games')} className="retro-btn">
                                Back to Games
                            </button>
                            <button onClick={() => window.location.reload()} className="retro-btn secondary">
                                PLAY AGAIN
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QuickQuiz;