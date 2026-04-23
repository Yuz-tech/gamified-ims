import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Hangman = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [currentWord, setCurrentWord] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [maxWrongGuesses] = useState(6);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        fetchGame();
    }, [id]);

    useEffect(() => {
        if (currentWord && !gameOver) {
            checkWinCondition();
        }
    }, [guessedLetters]);

    const fetchGame = async () => {
        try {
            const response = await api.get(`/games/play/${id}`);
            const gameData = response.data;
            setGame(gameData);

            const words = gameData.content.words;
            const randomWord = words[Math.floor(Math.random() * words.length)];
            setCurrentWord(randomWord);
            setGuessedLetters([]);
            setWrongGuesses(0);
            setGameOver(false);
            setWon(false);
        } catch (error) {
            console.error('Error fetching game: ', error);
            if (error.response?.status === 403) {
                alert('You have already completed this game!');
                navigate('/games');
            } else {
                alert('Error loading game');
                navigate('/games');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLetterGuess = (letter) => {
        if (guessedLetters.includes(letter) || gameOver) return;

        setGuessedLetters([...guessedLetters, letter]);

        const wordLetters = currentWord.word.toUpperCase();
        if (!wordLetters.includes(letter)) {
            const newWrongGuesses = wrongGuesses + 1;
            setWrongGuesses(newWrongGuesses);

            if (newWrongGuesses >= maxWrongGuesses) {
                endGame(false);
            }
        }
    };

    const checkWinCondition = () => {
        if (!currentWord) return;

        const wordLetters = currentWord.word.toUpperCase().split('');
        const uniqueLetters = [...new Set(wordLetters.filter(l => l !== ' '))];
        const allGuessed = uniqueLetters.every(letter => guessedLetters.includes(letter));

        if (allGuessed) {
            endGame(true);
        }
    };

    const endGame = async (won) => {
        setGameOver(true);
        setWon(won);

        let score = 0;
        if (won) {
            const percentage = (maxWrongGuesses - wrongGuesses) / maxWrongGuesses;
            score = Math.round(percentage * game.maxXP);
        }

        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            await api.post('/games/submit-score', {
                gameId: game._id,
                gameType: 'hangman',
                score,
                timeSpent: timeTaken
            });
        } catch (error) {
            console.error('Error submitting score: ', error);
        }
    };

    const renderWord = () => {
        if (!currentWord) return null;

        return currentWord.word.toUpperCase().split('').map((letter, idx) => {
            if (letter === ' ') {
                return (
                    <div key={idx} style={{ width: '20px', height: '50px' }} />
                );
            }

            const isGuessed = guessedLetters.includes(letter);

            return (
                <div key={idx} style={{
                    width: '40px',
                    height: '50px',
                    border: '3px solid var(--primary-navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--primary-navy)',
                    background: isGuessed ? 'var(--bright-blue)' : 'white',
                    marginRight: '5px'
                }}
                >
                    {isGuessed || gameOver ? letter : ''}
                </div>
            );
        });
    };

    const renderKeyboard = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
                gap: '5px',
                marginTop: '30px'
            }}>
                {alphabet.map(letter => {
                    const isGuessed = guessedLetters.includes(letter);
                    const isCorrect = currentWord && currentWord.word.toUpperCase().includes(letter);

                    let bgColor = 'white';
                    if (isGuessed) {
                        bgColor = isCorrect ? 'var(--success-green)' : 'var(--error-red)';
                    }

                    return (
                        <button key={letter} onClick={() => handleLetterGuess(letter)} disabled={isGuessed || gameOver} style={{
                            padding: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            background: bgColor,
                            color: isGuessed ? 'white' : 'var(--primary-navy)',
                            border: '2px solid var(--primary-navy)',
                            cursor: isGuessed || gameOver ? 'not-allowed' : 'pointer',
                            opacity: isGuessed || gameOver ? 0.6 : 1
                        }}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderHangman = () => {
        const parts = [
            <circle key="head" cx="140" cy="50" r="20" stroke="var(--primary-navy)" strokeWidth="3" fill="none" />,
            <line key="body" x1="140" y1="70" x2="140" y2="120" stroke="var(--primary-navy)" strokeWidth="3" />,
            <line key="leftarm" x1="140" y1="85" x2="110" y2="100" stroke="var(--primary-navy)" strokeWidth="3" />,
            <line key="rightarm" x1="140" y1="85" x2="170" y2="100" stroke="var(--primary-navy)" strokeWidth="3" />,
            <line key="leftleg" x1="140" y1="120" x2="115" y2="150" stroke="var(--primary-navy)" strokeWidth="3" />,
            <line key="rightleg" x1="140" y1="120" x2="165" y2="150" stroke="var(--primary-navy)" strokeWidth="3"/>
        ];

        return (
            <svg width="200" height="200" style={{ margin: '0 auto', display: 'block' }}>
                {/* Gallows */}
                <line x1="10" y="180" x2="80" y2="180" stroke="var(--primary-navy)" strokeWidth="3" />
                <line x1="40" y="180" x2="40" y2="20" stroke="var(--primary-navy)" strokeWidth="3" />
                <line x1="40" y="20" x2="140" y2="20" stroke="var(--primary-navy)" strokeWidth="3" />
                <line x1="140" y="20" x2="140" y2="30" stroke="var(--primary-navy)" strokeWidth="3" />

                {parts.slice(0, wrongGuesses)}
            </svg>
        );
    };

    if (loading) {
        return(
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    if (!game || !currentWord) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--error-red)' }}>Game not Found</h2>
                    <button onClick={() => navigate('/games')} className="retro-btn">Back to Games</button>
                </div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <button onClick={() => navigate('/games')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
                Back to Games
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ maxWidth: '700px', margin: '0 auto' }}
            >
                <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '10px', textAlign: 'center' }}>
                    {game.title}
                </h1>
                <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginBottom: '30px', textAlign: 'center' }}>
                    {game.description}
                </p>

                {!gameOver ? (
                    <>
                        {/* Category and HINT */}
                        <div style={{
                            padding: '15px',
                            background: 'var(--bg-light)',
                            border: '2px solid var(--border-color)',
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                CATEGORY
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                                {currentWord.category}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                HINT
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>
                                {currentWord.hint}
                            </div>
                        </div>

                        {/* Drawing */}
                        <div style={{
                            padding: '20px',
                            background: 'var(--bg-light)',
                            border: '3px solid var(--primary-navy)',
                            marginBottom: '30px'
                        }}>
                            {renderHangman()}
                            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                                Wrong Guesses: {wrongGuesses} / {maxWrongGuesses}
                            </div>
                        </div>

                        {/* Word Display */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: '5px',
                            marginBottom: '30px',
                            padding: '20px',
                            background: 'var(--bg-light)',
                            border: '2px solid var(--border-color)'
                        }}>
                            {renderWord()}
                        </div>

                        {/* Keyboard */}
                        {renderKeyboard()}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                            {won ? '🎉' : '💀'}
                        </div>
                        <h2 style={{ fontSize: '24px', color: won ? 'var(--success-green)' : 'var(--error-red)', marginBottom: '20px' }}>
                            {won ? 'You won!' : 'Game Over'}
                        </h2>
                        <div style={{ fontSize: '14px', marginBottom: '30px' }}>
                            The {currentWord.category.toLowerCase()} was: 
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-navy)', marginTop: '10px' }}>
                                {currentWord.word.toUpperCase()}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => navigate('/games')} className="retro-btn">
                                Back to Games
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Hangman;