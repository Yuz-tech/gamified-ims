import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '🏠 HOME' },
    { path: '/topics', label: '📚 TOPICS' },
    { path: '/achievements', label: '🏆 ACHIEVEMENTS' }
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: '⚙️ ADMIN' });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--darker-bg)',
        borderBottom: '3px solid var(--neon-green)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
        padding: '15px 20px'
      }}
    >
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: 'var(--neon-yellow)',
          textShadow: '0 0 10px var(--neon-yellow)'
        }}>
          GAMIFIED IMS AWARENESS TRAINING
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? 'var(--neon-cyan)' : 'var(--neon-green)',
                textDecoration: 'none',
                fontSize: '10px',
                padding: '8px 12px',
                border: `2px solid ${isActive ? 'var(--neon-cyan)' : 'var(--neon-green)'}`,
                background: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s',
                boxShadow: isActive 
                  ? '0 0 15px var(--neon-cyan)' 
                  : '0 0 5px var(--neon-green)'
              })}
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="retro-btn danger"
            style={{ fontSize: '10px', padding: '8px 12px' }}
          >
            🚪 LOGOUT
          </button>
        </div>

        <div style={{ 
          fontSize: '10px',
          color: 'var(--neon-pink)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>LVL {user?.level || 1}</span>
          <span>|</span>
          <span>⭐ {user?.xp || 0} XP</span>
          <span>|</span>
          <span>👤 {user?.username}</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;