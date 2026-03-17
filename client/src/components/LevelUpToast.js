import React, { useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const LevelUpToast = ({ show, level, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -100, scale: 0.8 }}
                  style={{
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    background: 'linear-gradient(135deg, var(--bright-blue), var(--secondary-pink))',
                    padding: '30px 50px',
                    borderRadius: '10px',
                    border: '4px solid var(--primary-navy)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    minWidth: '300px'
                  }}
                >
                    <div style = {{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                        Level Up!
                    </div>

                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
                        Level {level}
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
                        You're doing great!
                    </div>

                    <button onClick={onClose} style={{
                        marginTop: '15px',
                        padding: '8px 20px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        color: 'var(--primary-navy)',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}>
                        AWESOME!
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LevelUpToast;