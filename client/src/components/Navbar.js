import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
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
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'var(--bg-lightest)',
          borderBottom: '3px solid var(--primary-navy)',
          boxShadow: '0 4px 12px rgba(27, 58, 107, 0.15)',
          padding: '15px 20px'
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* Logo */}
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--primary-navy)',
            textShadow: '2px 2px 0 var(--light-blue)',
            flex: '0 0 auto'
          }}>
            🎮 IMS ARCADE
          </div>

          {/* Desktop Navigation */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '15px',
              alignItems: 'center',
              flex: '1 1 auto',
              justifyContent: 'center'
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/admin'}
                style={({ isActive }) => ({
                  color: isActive ? 'white' : 'var(--primary-navy)',
                  textDecoration: 'none',
                  fontSize: '10px',
                  padding: '8px 12px',
                  border: `2px solid ${isActive ? 'var(--bright-blue)' : 'var(--primary-navy)'}`,
                  background: isActive ? 'var(--bright-blue)' : 'transparent',
                  transition: 'all 0.3s',
                  boxShadow: isActive ? '3px 3px 0 var(--primary-navy)' : 'none',
                  whiteSpace: 'nowrap'
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

          {/* User Stats - Desktop */}
          <div 
            style={{ 
              fontSize: '10px',
              color: 'var(--bright-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flex: '0 0 auto'
            }}
            className="desktop-stats"
          >
            <span>LVL {user?.level || 1}</span>
            <span>|</span>
            <span>⭐ {user?.xp || 0} XP</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="retro-btn secondary mobile-menu-toggle"
            style={{ 
              fontSize: '14px', 
              padding: '8px 12px',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              position: 'sticky',
              top: '70px',
              zIndex: 999,
              background: 'var(--bg-lightest)',
              borderBottom: '3px solid var(--primary-navy)',
              boxShadow: '0 4px 12px rgba(27, 58, 107, 0.15)',
              overflow: 'hidden'
            }}
            className="mobile-menu"
          >
            <div style={{ 
              padding: '15px',
              display: 'flex', 
              flexDirection: 'column',
              gap: '10px'
            }}>
              {/* User Stats - Mobile */}
              <div style={{
                padding: '10px',
                background: 'var(--bg-medium)',
                border: '2px solid var(--bright-blue)',
                textAlign: 'center',
                fontSize: '10px',
                color: 'var(--bright-blue)'
              }}>
                👤 {user?.username} | LVL {user?.level || 1} | ⭐ {user?.xp || 0} XP
              </div>

              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/' || item.path === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? 'white' : 'var(--primary-navy)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    padding: '12px',
                    border: `2px solid ${isActive ? 'var(--bright-blue)' : 'var(--primary-navy)'}`,
                    background: isActive ? 'var(--bright-blue)' : 'transparent',
                    textAlign: 'center',
                    display: 'block'
                  })}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="retro-btn danger"
                style={{ fontSize: '12px', padding: '12px', width: '100%' }}
              >
                🚪 LOGOUT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .desktop-stats {
            display: none !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;