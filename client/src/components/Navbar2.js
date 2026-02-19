import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        alignItems: 'center'
      }}>
        {/* Logo / Title */}
        <div style={{ fontSize: '14px', color: '#ffffff' }}>
          GAMIFIED IMS AWARENESS TRAINING
        </div>

        {/* Hamburger button*/}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--bright-blue)',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'none' 
          }}
          className="hamburger-btn"
        >
          ☰
        </button>

        {/* Nav links */}
        <div 
          className={`nav-links ${menuOpen ? 'open' : ''}`} 
          style={{ 
            display: 'flex', 
            gap: '15px',
            alignItems: 'center'
          }}
        >
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
              onClick={() => setMenuOpen(false)}
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

        {/* User info */}
        <div style={{ fontSize: '10px', color: 'var(--sky-blue)' }}>
          LVL {user?.level || 1} | {user?.xp || 0} XP | {user?.username}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
