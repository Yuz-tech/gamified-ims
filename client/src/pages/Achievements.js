import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Achievements = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      // Fetch all badges
      const badgesResponse = await api.get('/admin/badges');
      const allBadges = badgesResponse.data;
      
      // Get current user's earned badges
      const userResponse = await api.get('/auth/me');
      const userBadges = userResponse.data.badges || [];
      
      // Map badges with earned status
      const badgesWithStatus = allBadges.map(badge => {
        const isEarned = userBadges.some(
          ub => (ub.badgeId?._id || ub.badgeId) === badge._id
        );
        
        return {
          ...badge,
          earned: isEarned
        };
      });
      
      setBadges(badgesWithStatus);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING ACHIEVEMENTS...</div>
      </div>
    );
  }

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;
  const currentYear = new Date().getFullYear();

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
<<<<<<< HEAD
        YOUR ACHIEVEMENTS ({currentYear})
=======
        🏆 YOUR ACHIEVEMENTS ({currentYear})
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
      </motion.h1>

      {/* Progress Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="retro-card pixel-corners"
        style={{ marginBottom: '40px' }}
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px', textAlign: 'center' }}>
          COLLECTION PROGRESS
        </h3>

        <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '20px', color: 'var(--bright-blue)' }}>
          {earnedCount} / {totalCount}
        </div>

        <div style={{
          background: 'var(--bg-dark)',
          border: '3px solid var(--primary-navy)',
          height: '40px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, var(--bright-blue), var(--light-blue))',
            height: '100%',
            width: `${progressPercentage}%`,
            transition: 'width 1s ease',
            boxShadow: '0 0 20px var(--bright-blue)'
          }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--orange-accent)' }}>
          {progressPercentage === 100 
            ? 'ALL BADGES COLLECTED! YOU ARE A MASTER! '
            : `${Math.round(progressPercentage)}% COMPLETE - KEEP GOING!`
          }
        </div>
      </motion.div>

      {/* Badge Gallery */}
      {badges.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
          {badges.map((badge, index) => {
            const imageUrl = badge.imageUrl.startsWith('/uploads/') 
              ? `http://localhost:5000${badge.imageUrl}` 
              : badge.imageUrl;
            
            return (
              <motion.div
                key={badge._id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="retro-card"
                style={{
                  textAlign: 'center',
                  opacity: badge.earned ? 1 : 0.5,
                  border: `3px solid ${badge.earned ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                  boxShadow: badge.earned ? '4px 4px 0 var(--primary-navy)' : 'none',
                  position: 'relative'
                }}
              >
                {/* Badge Image Container */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 20px',
                  border: `3px solid ${badge.earned ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: badge.earned ? 'var(--bg-lightest)' : 'var(--bg-medium)',
                  boxShadow: badge.earned 
                    ? '4px 4px 0 var(--primary-navy)' 
                    : '2px 2px 0 var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden',
                  filter: badge.earned ? 'none' : 'grayscale(100%) brightness(0.7)'
                }}>
                  {badge.earned ? (
                    <>
                      <img 
                        src={imageUrl}
                        alt={badge.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          imageRendering: 'pixelated'
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', badge.imageUrl);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="font-size: 48px;">🏆</div>';
                        }}
                      />
                      
                      {/* Glow effect for earned badges */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '150%',
                        height: '150%',
                        background: 'radial-gradient(circle, var(--light-blue) 0%, transparent 70%)',
                        opacity: 0.3,
                        animation: 'pulse 2s infinite'
                      }} />
                    </>
                  ) : (
                    <div style={{ fontSize: '48px', color: 'var(--text-lighter)' }}>
                      🔒
                    </div>
                  )}
                </div>

                <h4 style={{
                  fontSize: '11px',
                  color: badge.earned ? 'var(--primary-navy)' : 'var(--text-light)',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  {badge.name}
                </h4>

                <p style={{
                  fontSize: '8px',
                  color: 'var(--text-medium)',
                  marginBottom: '10px',
                  lineHeight: '1.4'
                }}>
                  {badge.description}
                </p>

                <div style={{
                  fontSize: '9px',
                  color: 'var(--text-light)',
                  marginBottom: '10px',
                  padding: '5px',
                  background: 'var(--bg-medium)',
                  border: '1px solid var(--border-color)'
                }}>
<<<<<<< HEAD
                  {badge.topicId?.title || 'Topic'}
=======
                  📚 {badge.topicId?.title || 'Topic'}
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
                </div>

                <div style={{
                  fontSize: '9px',
                  color: badge.earned ? 'var(--success-green)' : 'var(--error-red)',
                  padding: '8px 10px',
                  border: `2px solid ${badge.earned ? 'var(--success-green)' : 'var(--error-red)'}`,
                  fontWeight: 'bold',
                  boxShadow: badge.earned ? '2px 2px 0 var(--primary-navy)' : 'none'
                }}>
                  {badge.earned ? '✓ EARNED' : '✗ LOCKED'}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: 'var(--bright-blue)' }}>NO BADGES YET</div>
          <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '10px' }}>
            Complete topics to earn badges!
          </div>
          <button onClick={fetchBadges} className="retro-btn" style={{ marginTop: '20px' }}>
<<<<<<< HEAD
            REFRESH
=======
            🔄 REFRESH
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Achievements;