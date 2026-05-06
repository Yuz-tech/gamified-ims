import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/getImageUrl';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async() => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style = {{
      background: 'var(--bg-light)',
      borderBottom: '3px solid var(--primary-navy)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 0 var(--primary-navy)'
    }}>
      {/* Logo & Title */}
      <div style = {{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer'
      }}
      onClick={() => navigate('/')}
      >
        <img src = "/logo.png" alt="AWS" style={{
          height: '40px',
          width: 'auto',
          objectFit: 'contain',
          imageRendering: 'crisp-edges'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
        />
        <h1 style={{
          fontSize: '16px',
          color: 'var(--primary-navy)',
          margin: 0,
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          IMS Awareness Training
        </h1>
        <button className='retro-btn secondary' style={{ width: '30px', height: '30px', borderRadius: '40%', fontSize: '15px', color: 'white', padding: '0px' }} onClick={(e) => {
                  e.stopPropagation();
                  navigate('/user-manual');
                  }}>
                    ❓
        </button>
      </div>

      {/* Desktop Navigation */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 'bold'
      }}
      className="desktop-nav">
        <button onClick={() => navigate('/')} style={{
          background: location.pathname === '/' ? 'var(--bright-blue)' : 'transparent',
          border: location.pathname === '/' ? '2px solid var(--primary-navy)' : 'none',
          color: location.pathname === '/' ? 'white' : 'var(--text-dark)',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: location.pathname.startsWith('/') ? 'bold' : 'normal'
        }}>
          HOME
        </button>

        <button onClick={() => navigate('/topics')} style={{
          background: location.pathname.startsWith('/topics') ? 'var(--bright-blue)' : 'transparent',
          border: location.pathname.startsWith('/topics') ? '2px solid var(--primary-navy)' : 'none',
          color: location.pathname.startsWith('/topics') ? 'white' : 'var(--text-dark)',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: location.pathname.startsWith('/topics') ? 'bold' : 'normal'
        }}
        >
          TRAINING
        </button>

        <button onClick={() => navigate('/games')} style={{
          background: location.pathname.startsWith('/games') ? 'var(--bright-blue)' : 'transparent',
          border: location.pathname.startsWith('/games') ? '2px solid var(--primary-navy)' : 'none',
          color: location.pathname.startsWith('/games') ? 'white' : 'var(--text-dark)',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: location.pathname.startsWith('/games') ? 'bold' : 'normal',
        }}
        >
          GAMES
        </button>

        <button onClick={() => navigate('/achievements')} style={{
          background: location.pathname === '/achievements' ? 'var(--bright-blue)' : 'transparent',
          border: location.pathname === '/achievements' ? '2px solid var(--primary-navy)' : 'none',
          color: location.pathname === '/achievements' ? 'white' : 'var(--text-dark)',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: location.pathname === '/achievments' ? 'bold' : 'normal'
        }}>
          BADGES
        </button>

        <button onClick={() => navigate('/players')} style={{
            background: location.pathname === '/players' ? 'var(--bright-blue)' : 'transparent',
            border: location.pathname === '/players' ? '2px solid var(--primary-navy)' : 'none',
            color: location.pathname === '/players' ? 'white' : 'var(--text-dark)',
            padding: '8px 15px',
            cursor: 'pointer',
            fontWeight: location.pathname === '/players' ? 'bold' : 'normal',
          }}>
          PLAYERS
        </button>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowDropdown(!showDropdown)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              padding: '8px 15px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              {/* User Avatar */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '2px solid #000000',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-medium)'
              }}>
                {user && user.avatar ? (
                  <img 
                    src={getImageUrl(user.avatar)}
                    alt={user.username}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML='<div style="font-size: 20px;">👤</div>';
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '16px' }}>👤</div>
                )}
              </div>
            </button>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '70px',
              right: '0',
              background: 'var(--bg-light)',
              border: '3px solid var(--primary-navy)',
              boxShadow: '5px 5px 0 var(--primary-navy)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <button onClick={() => {
                navigate('/profile');
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                padding: '15px',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid var(--border-color)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'var(--text-dark)'
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--bg-medium)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Profile
              </button>

              {user?.role === 'admin' && (
                <button onClick={() => {
                  navigate('/admin');
                  setShowDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--border-color)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: 'var(--text-dark)'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--bg-medium)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Admin Panel
                </button>
              )}

              <button onClick={handleLogout} style={{
                width: '100%',
                padding: '15px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'var(--error-red)'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" style={{
        display: 'none',
        background: 'var(--primary-navy)',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="mobile-menu"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '300px',
              background: 'var(--bg-light)',
              borderLeft: '3px solid var(--primary-navy)',
              boxShadow: '-5px 0 10px rgba(0,0,0,0.2)',
              zIndex: 2000,
              padding: '20px',
              overflowY: 'auto'
            }}
          >
            <button onClick={() => setMobileMenuOpen(false)} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-dark)'
            }}
            >
              ✖
            </button>
            <div style = {{
              padding: '10px',
              background: 'var(--bg-medium)',
              border: '2px solid var(--bright-blue)',
              textAlign: 'center',
              fontSize: '10px',
              color: 'var(--bright-blue)',
              marginBottom: '20px',
              marginTop: '40px'
            }}>
              {user?.username} | LVL {user?.level || 1} | {user?.xp || 0} XP
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => navigate('/')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Home
              </button>
              <button onClick={() => navigate('/topics')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Training
              </button>
              <button onClick={() => navigate('/games')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Games
              </button>
              <button onClick={() => navigate('/achievements')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Achievements
              </button>
              <button onClick={() => navigate('/players')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Players
              </button>
              <button onClick={() => navigate('/profile')} className="retro-btn" style={{ width: '100%', textAlign: 'left' }}>
                Profile
              </button>

              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin/')} className="retro-btn" style={{ width: '100%', textAlign: 'left', background: 'var(--orange-accent)' }}>
                  Admin
                </button>
              )}

              <button onClick={handleLogout} className="retro-btn secondary" style={{ width: '100%', textAlign: 'left', marginTop: '20px', background: '#ff1414', color: '#FFFFFF' }}>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;