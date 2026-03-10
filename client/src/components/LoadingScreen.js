import React from "react";
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading...'}) => {
    return (
        <div style = {{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style = {{ textAlign: 'center' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '5px solid var(--border-color)',
                    borderTop: '5px solid var(--bright-blue)',
                    borderRadius: '50%',
                    margin: '0 auto 20px'
                  }}
                />
                <div className="neon-text" style={{ fontSize: '18px' }}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;