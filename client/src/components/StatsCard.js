import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ icon, label, value, color, delay = 0, onClick}) => {
    return (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay }}
          className="retro-card"
          style={{
            textAlign: 'center',
            cursor: onClick ? 'pointer' : 'default'
          }}
          onClick={onClick}
        >
            <div style = {{ 
                fontSize: '10px',
                color: 'var(--text-medium)',
                marginBottom: '10px'
            }}>
                {label}
            </div>

            <div style={{
                fontSize: '48px',
                color: color,
                fontWeight: 'bold'
            }}>
                {value}
            </div>

            <div style = {{
                fontSize: '9px',
                color: 'var(--text-light)',
                marginTop: '10px'
            }}>
                {icon}
            </div>
        </motion.div>
    );
};

export default StatsCard;