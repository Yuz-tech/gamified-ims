import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Tamago = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [spinning, setSpinning] = useState(false);
    const [slots, setSlots] = useState(['❓', '❓', '❓']);
    const [revealedSlots, setRevealedSlots] = useState([false, false, false]);
    const [result, setResult] = useState(null);
    const [canSpin, setCanSpin] = useState(true);
    const [cooldown, setCooldown] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const [totalSpins, setTotalSpins] = useState(0);
    const [longCooldownActive, setLongCooldownActive] = useState(false);
    const [longCooldownRemaining, setLongCooldownRemaining] = useState(0);

    const symbols = ['👽', '🤖','🎮','🌟','👾','⭕','💩','💎'];
    const prizes = {
        '💩💩💩': {xp: 1, name: 'You won!...but at what cost'},
        '👽👽👽': {xp: 50, name: "Congrats! That's like 1 bonus question"},
        '🤖🤖🤖': {xp: 100, name: 'You won! Just remember that there is more to life than playing slots'},
        '⭕⭕⭕': {xp: 150, name: 'Wow you actually won, never thought that would happen honestly'},
        '🌟🌟🌟': {xp: 200, name: 'You are indeed lucky! Now go touch grass'},
        '🎮🎮🎮': {xp: 250, name: 'Congrats on the win. Might as well stop at this point.'},
        '💎💎💎': {xp: 500, name: '🦾 PALDO!!'},
    };

    useEffect(() => {
        loadStoredData();
    }, []);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 300);
        } else if (!longCooldownActive) {
            setCanSpin(true);
        }
        return () => clearTimeout(timer);
    }, [cooldown, longCooldownActive]);

    useEffect(() => {
        let timer;
        if (longCooldownRemaining > 0) {
            timer = setTimeout(() => setLongCooldownRemaining(longCooldownRemaining - 1), 1000);
        } else if (longCooldownActive) {
            setLongCooldownActive(false);
            setCanSpin(true);

            localStorage.removeItem('xpSlots_longCooldown');
        }
        return () => clearTimeout(timer);
    }, [longCooldownRemaining, longCooldownActive]);

    const loadStoredData = () => {
        const storedSpins = parseInt(localStorage.getItem('xpSlots_totalSpins') || '0');
        const storedWins = parseInt(localStorage.getItem('xpSlots_totalWins') || 0);
        setTotalSpins(storedSpins);
        setTotalWins(storedWins);

        const longCooldownEnd = localStorage.getItem('xpSlots_longCooldown');
        if (longCooldownEnd) {
            const endTime = parseInt(longCooldownEnd);
            const now = Date.now();
            if (now < endTime) {
                const remaining = Math.ceil((endTime - now) / 1000);

                setLongCooldownRemaining(remaining);
                setLongCooldownActive(true);
                setCanSpin(false);
            } else {
                localStorage.removeItem('xpSlots_longCooldown');
            }
        }
    };

    const spin = async () => {
        if (!canSpin || spinning || longCooldownActive) return;

        setSpinning(true);
        setResult(null);
        setCanSpin(false);
        setRevealedSlots([false, false, false]);
        const newTotalSpins = totalSpins + 1;
        setTotalSpins(newTotalSpins);

        localStorage.setItem('xpSlots_totalSpins', newTotalSpins.toString());

        if (newTotalSpins % 100 === 0) {
            const cooldownEnd = Date.now() + (360 * 1000);

            localStorage.setItem('xpSlots_longCooldown', cooldownEnd.toString());
            setLongCooldownActive(true);
            setLongCooldownRemaining(360);
        }

        const finalSlots = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        await animateSlot(0, finalSlots[0]);
        await new Promise(resolve => setTimeout(resolve, 300));

        await animateSlot(1, finalSlots[1]);
        await new Promise(resolve => setTimeout(resolve, 300));

        await animateSlot(2, finalSlots[2]);
        await new Promise(resolve => setTimeout(resolve, 500));

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

            const newTotalWins = totalWins + 1;
            setTotalWins(newTotalWins);

            localStorage.setItem('xpSlots_totalWins', newTotalWins.toString());

            try {
                await api.post('/auth/award-xp', {xp: prize.xp, reason: 'Easter egg found'});
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

        if (!longCooldownActive) {
            setCooldown(7);
        }
    };

    const animateSlot = async (index, finalSymbol) => {
        const spinDuration = 1000;
        const spinInterval = 100;
        const iterations = spinDuration / spinInterval;

        for (let i=0; i<iterations; i++) {
            setSlots(prev => {
                const newSlots = [...prev];
                newSlots[index] = symbols[Math.floor(Math.random() * symbols.length)];
                return newSlots;
            });
            await new Promise(resolve => setTimeout(resolve, spinInterval));
        }

        setSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = finalSymbol;
            return newSlots;
        });

        setRevealedSlots(prev => {
            const newRevealed = [...prev];
            newRevealed[index] = true;
            return newRevealed;
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}: ${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="retro-container" style={{ paddingTop: '40px', minHeight: '100vh'}}>
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
                        style={{ fontSize: '48px', marginBottom: '10px', color: 'var(--bright-blue)'}}
                    >
                        XP Slots
                    </motion.h1>
                    <p style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                        Hello Player, I see you found the easter egg ᕙ(  •̀ ᗜ •́  )ᕗ
                        <br />
                        Be a good person and gatekeep it.
                    </p>
                    <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '10px' }}>
                        Spins: {totalSpins} | Wins: {totalWins}
                    </div>
                    {totalSpins > 0 && totalSpins % 100 === 0 && longCooldownActive && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '2px solid var(--error-red)',
                            fontSize: '11px',
                            color: 'var(--error-red)',
                            fontWeight: 'bold'
                        }}>
                            100 Spins Reached! 6-minute cooldown activated!
                        </div>
                    )}
                </div>

                {/* Machine */}
                <motion.div
                    className="retro-card"
                    style={{
                        padding: '40px',
                        background: 'linear-gradient(135deg, var(--primary-navy) 0%, #le3a8a 100%',
                        border: '5px solid var(--bright-blue)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
                    }}>
                        {/* Slots */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '20px',
                            marginBottom: '40px'
                        }}>
                            {slots.map((symbol, index) => (
                                <motion.div
                                    key={index}
                                    animate={spinning && !revealedSlots[index] ? {
                                        y: [0, -10, 0],
                                        rotate: [0, 360, 0]
                                    } : 
                                revealedSlots[index] ? {
                                    scale: [1, 1.2, 1]
                                } : {}}
                                transition={spinning && !revealedSlots[index] ? {
                                    repeat: Infinity,
                                    duration: 0.3
                                } : revealedSlots[index] ? {
                                    duration: 0.5
                                } : {}}
                                style={{
                                    background: 'white',
                                    border: `5px solid ${revealedSlots[index] ? 'var(--success-green)' : 'var(--orange-accent)'}`,
                                    borderRadius: '20px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    fontSize: '80px',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: spinning && !revealedSlots[index] ? '0 0 20px rgba(249, 115, 22, 0.8)' : revealedSlots[index] ? '0 0 20px rgba(16, 185, 129, 0.8)' : 'none'
                                }}
                            >
                                {symbol}
                            </motion.div>
                            ))}
                        </div>

                        {/* Spin Button */}
                        <motion.button
                            whileHover={canSpin && !longCooldownActive ? { scale: 1.05 } : {}}
                            whileTap={canSpin && !longCooldownActive ? { scale: 0.95 } : {}}
                            onClick={spin}
                            disabled={!canSpin || spinning || longCooldownActive}
                            className="retro-btn"
                            style={{
                                width: '100%',
                                fontSize: '24px',
                                padding: '20px',
                                background: canSpin && !longCooldownActive ? 'var(--success-green)' : 'var(--text-medium)',
                                opacity: canSpin && !longCooldownActive ? 1 : 0.5,
                                cursor: canSpin && !longCooldownActive ? 'pointer' : 'not-allowed'
                            }}>
                                {spinning ? 'Spinning...' : longCooldownActive ? `Long Cooldown: ${formatTime(longCooldownRemaining)}` : cooldown > 0 ? `Cooldown: ${cooldown}` : 'SPIN!'}
                            </motion.button>

                            {/* Results */}
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
                                            {result.win ? '⁶🤷🏻‍♀️⁷' : '🫵🤣'}
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

                    {/* Prize table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="retro-card"
                        style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '20px'}}>
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
                                            {prize.xp} XP
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        {/* Back Button */}
                            <button onClick={() => navigate('/')} className="retro-btn secondary" style={{ width: '100%', marginTop: '30px' }}>
                                Back to Home
                            </button>
            </motion.div>
            <div style={{ paddingTop: '50px', textAlign: 'center', fontSize: '28px'}}>
                Proverbs 13:11 ˗ˏˋ ✞ ˎˊ˗  ᡣ𐭩
            </div>
        </div>
    );
};

export default Tamago;