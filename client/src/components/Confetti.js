import React, { useEffect, useState } from "react";

const Confetti = ({ active }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2,
                color: ['#3b82f6', '#f97316', '#10b981', '#ec4899']
                [Math.floor(Math.random() * 4)]
            }));
            setParticles(newParticles);
        }
    }, [active]);

    if (!active) return null;

    return (
        <div style = {{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }}>
            {particles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: `${p.left}%`,
                    top: '-10px',
                    width: '10px',
                    height: '10px',
                    background: p.color,
                    animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
                    opacity: 0
                }}
                />
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacit: 0; }
                }
            `}</style>
        </div>
    );
};

export default Confetti;