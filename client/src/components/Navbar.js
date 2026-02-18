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
    { path: '/', label: 'HOME' },
    { path: '/topics', label: 'TOPICS' },
    { path: '/achievements', label: 'ACHIEVEMENTS' }
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: '⚙️' });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--primary-navy)',
        borderBottom: '3px solid var(--bright-blue)',
        boxShadow: '0 4px 12px var(--shadow-medium), 0 0 0 2px var(--bright-blue) inset',
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
          color: '#ffffff',
          textShadow: '0px 0px 0 var(--light-blue)'
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
                color: isActive ? 'rgb(0, 0, 0)' : 'var(--bright-blue)',
                textDecoration: 'none',
                fontSize: '12px',
                padding: '8px 12px',
                border: `3px solid ${isActive ? 'var(--light-blue)' : 'var(--bright-blue)'}`,
                background: isActive ? 'rgba(226, 255, 4, 0.99)' : 'transparent',
                transition: 'all 0.3s',
                boxShadow: isActive 
                  ? '0 0 15px var(--light-blue)' 
                  : '0 0 5px var(--bright-blue)'
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
            LOGOUT
          </button>
        </div>

        <div style={{ 
          fontSize: '10px',
          color: 'var(--sky-blue)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>LVL {user?.level || 1}</span>
          <span>|</span>
          <span>{user?.xp || 0} XP</span>
          <span>|</span>
          <span>👤 {user?.username}</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;