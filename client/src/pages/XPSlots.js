import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const XPSlots = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [spinning, setSpinning] = useState(false);
    const [slots, setSlots] = useState(['🎮', '🎮', '🎮']);
    const [result, setResult] = useState(null);
    const [canSpin, setCanSpin] = useState(true);
    const [cooldown, setCooldown] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const [totalSpins, setTotalSpins] = useState(0);

    const symbols = ['🎮', '🏆', '⭐', '💎', '🔥', '👑', '🎯'];
    const prizes = {
        '🎮🎮🎮': { xp: 10, name: 'Triple Game' },
        '🏆🏆🏆': { xp: 50, name: 'Triple Trophy' },
        '⭐⭐⭐': { xp: 75, name: 'Triple Star' },
        '💎💎💎': { xp: 100, name: 'Triple Diamond' },
        '🔥🔥🔥': { xp: 150, name: 'Triple Fire' },
        '👑👑👑': { xp: 200, name: 'Triple Crown' },
        '🎯🎯🎯': { xp: 500, name: 'JACKPOT!' },
    };

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        } else {
            setCanSpin(true);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const spin = async () => {
        if (!canSpin || spinning) return;

        setSpinning(true);
        setResult(null);
        setCanSpin(false);
        setTotalSpins(totalSpins + 1);

        const spinDuration = 2000;
        const spinInterval = 100;
        const iterations = spinDuration / spinInterval;

        for (let i=0; i<iterations; i++) {
            setSlots([
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ]);
            await new Promise(resolve => setTimeout(resolve, spinInterval));
        }

        const finalSlots = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        setSlots(finalSlots);
        setSpinning(false);

        const key = finalSlots.join('');
        const prize = prizes[key];

        if (prize) {
            setResult({
                win: true,
                xp: prize.xp,
                name: prize.name
            });
            setTotalWins(totalWins + 1);

            try {
                await api.post('/auth/award-xp', { xp: prize.xp, reason: `XP Slots: ${prize.name}`});
                const userResponse = await api.get('/auth/me');
                updateUser(userResponse.data);
            } catch (error) {
                console.error('Error awarding XP: ', error);
            }
        } else {
            setResult({
                win: false,
                xp: 0
            });
        }

        if (totalSpins > 10) {
            setCooldown(360);
        } else {
            setCooldown(1);
        }
        
    };

    return (
        <div className="retro-container" style={{ paddingTop: '40px', minHeight: '100vh' }}>
            <div className="scanlines"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.h1
                        animate={{
                            textShadow: [
                                '0 0 10px #3b82f6',
                                '0 0 20px #3b82f6',
                                '0 0 10px #3b82f6'
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="neon-text"
                        style={{ fontSize: '48px', marginBottom: '10px', color: 'var(--bright-blue'}}
                    >
                        XP SLOTS
                    </motion.h1>
                    <p style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                        Match 3 symbols to win XP!
                    </p>
                    <div style={{ fontSize: '20px', color: 'var(--text-light)', marginTop: '10px' }}>
                        🤫 You found the Easter Egg! <br /> Spins: {totalSpins} | Wins: {totalWins}
                    </div>
                </div>

                {/* Slot Machine */}
                <motion.div
                    className="retro-card"
                    style={{
                        padding: '40px',
                        background: 'linear-gradient(135deg, var(--primary-navy) 0%, #1e3a8a 100%)',
                        border: '5px solid var(--bright-blue)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
                    }}
                >
                    {/* Slots Display */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        {slots.map((symbol, index) => (
                            <motion.div
                                key={index}
                                animate={spinning ? {
                                    y: [0, -10, 0],
                                    rotate: [0, 360, 0]
                                } : {}}
                                transition={spinning ? {
                                    repeat: Infinity,
                                    duration: 0.3,
                                    delay: index * 0.1
                                } : {}}
                                style={{
                                    background: 'white',
                                    border: '5px solid var(--orange-accent)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    fontSize: '80px',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: spinning ? '0 0 20px rgba(249, 115, 22, 0.8)' : 'none'
                                }}
                            >
                                {symbol}
                            </motion.div>
                        ))}
                    </div>

                    {/* Spin Button */}
                    <motion.button
                        whileHover={canSpin ? { scale: 1.05 } : {}}
                        whileTap={canSpin ? { scale: 0.95 } : {}}
                        onClick={spin}
                        disabled={!canSpin || spinning}
                        className="retro-btn"
                        style={{
                            width: '100%',
                            fontSize: '24px',
                            padding: '20px',
                            background: canSpin ? 'var(--success-green)' : 'var(--text-medium)',
                            opacity: canSpin ? 1 : 0.5,
                            cursor: canSpin ? 'pointer' : 'not-allowed'
                        }}
                    >
                        {spinning ? 'Spinning...' : cooldown > 0 ? `Cooldown: ${cooldown}s` : 'Spin!'}
                    </motion.button>

                    {/* Result Display */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                style={{
                                    marginTop: '30px',
                                    padding: '30px',
                                    background: result.win ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    border: `3px solid ${result.win ? 'var(--success-green)' : 'var(--error-red)'}`,
                                    borderRadius: '10px',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                                    {result.win ? '🎉' : '😢'}
                                </div>
                                <div style={{
                                    fontSize: '24px',
                                    color: result.win ? 'var(--success-green)' : 'var(--error-red)',
                                    fontWeight: 'bold',
                                    marginBottom: '10px'
                                }}>
                                    {result.win ? result.name : 'Try Again!'}
                                </div>
                                {result.win && (
                                    <div style={{
                                        fontSize: '48px',
                                        color: 'var(--success-green)',
                                        fontWeight: 'bold'
                                    }}>
                                        +{result.xp} XP
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Prize Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="retro-card"
                    style={{ marginTop: '30px' }}
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        Prize Table
                    </h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {Object.entries(prizes).map(([key, prize]) => (
                            <div key={key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 15px',
                                background: 'var(--bg-light)',
                                border: '2px solid var(--border-color)',
                                fontSize: '12px'
                            }}>
                                <div style={{ fontSize: '24px' }}>{key}</div>
                                <div>
                                    <strong>{prize.name}</strong> - {prize.xp} XP
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Back Button */}
                <button onClick={() => navigate('/')} className="retro-btn secondary" style={{ width: '100%', marginTop: '30px'}}>
                    Back to Home
                </button>
            </motion.div>
            
        </div>
    );
};

export default XPSlots;