import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Achievements = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      // We need to get all badges and mark which ones the user has
      const topicsResponse = await api.get('/topics');
      const userResponse = await api.get('/auth/me');
      
      const userBadgeIds = userResponse.data.badges.map(b => b.badgeId._id || b.badgeId);
      
      // Create a combined list
      const badgesList = topicsResponse.data.map(topic => {
        const earned = userBadgeIds.includes(topic._id);
        return {
          topicId: topic._id,
          topicTitle: topic.title,
          earned: earned,
          isCompleted: topic.isCompleted
        };
      });

      setAllBadges(badgesList);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className="loading neon-text">LOADING ACHIEVEMENTS...</div>
      </div>
    );
  }

  const earnedCount = allBadges.filter(b => b.earned).length;
  const totalCount = allBadges.length;
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text-achieve"
        style={{ 
          fontSize: '28px', 
          marginBottom: '40px',
          textAlign: 'center',
        }}
      >
        YOUR ACHIEVEMENTS
      </motion.h1>

      {/* Progress Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="retro-card pixel-corners"
        style={{ marginBottom: '40px' }}
      >
        <h3 style={{
          fontSize: '14px',
          color: 'var(--sky-blue)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          COLLECTION PROGRESS
        </h3>

        <div style={{
          fontSize: '48px',
          textAlign: 'center',
          marginBottom: '20px',
          color: 'var(--light-blue)'
        }}>
          {earnedCount} / {totalCount}
        </div>

        <div style={{
          background: 'var(--primary-navy)',
          border: '2px solid var(--bright-blue)',
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

        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--orange-accent)'
        }}>
          {progressPercentage === 100 
            ? '🎊 ALL BADGES COLLECTED! YOU ARE A MASTER! 🎊'
            : `${Math.round(progressPercentage)}% COMPLETE - KEEP GOING!`
          }
        </div>
      </motion.div>

      {/* Badge Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        {allBadges.map((badge, index) => {
          const userBadge = user?.badges?.find(b => (
            b.badgeId?._id || b.badgeId) === badge.topicId
          );
          const badgeData = userBadge?.badgeId;
          return (
          <motion.div
            key={badge.topicId}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="retro-card"
            style={{
              textAlign: 'center',
              opacity: badge.earned ? 1 : 0.4,
              filter: badge.earned ? 'none' : 'grayscale(100%)'
            }}
          >
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              border: `3px solid ${badge.earned ? 'var(--orange-accent)' : 'var(--grid-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              background: badge.earned ? 'var(--bg-lightest)' : 'var(--bg-medium)',
              boxShadow: badge.earned ? '4px 4px 0 var(--primary-navy)' : '2px 2px 0 var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {badge.earned && badgeData?.imageUrl?(
                <>
                  <img src = {badgeData.imageUrl}
                       alt = {badgeData.name || badge.topicTitle}
                       style = {{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        imageRendering: 'pixelated'
                       }}
                       onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style = "font-size: 48px;">BADGE</div>';
                       }}
                       />
                
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
                <div style = {{
                  fontSize: '48px',
                  color: 'var(--text-lighter)'
                }}> 🔒</div>
              )}
            </div>

            <h4 style={{
              fontSize: '12px',
              color: badge.earned ? 'var(--primary-navy)' : 'var(--text-light)',
              marginBottom: '10px'
            }}>
              {badge.topicTitle}
            </h4>

            <div style={{
              fontSize: '9px',
              color: badge.earned ? 'var(--success-green)' : 'var(--error-red)',
              padding: '5px 10px',
              border: `1px solid ${badge.earned ? 'var(--success-green)' : 'var(--error-red)'}`
            }}>
              {badge.earned ? '✓ EARNED' : '✗ LOCKED'}
            </div>

            {badge.earned && badgeData?.name && (
              <div style = {{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary-navy)',
                color: 'white',
                padding: '5px 10px',
                fontSize: '8px',
                whiteSpace: 'nowrap',
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.3s',
                zIndex: 10
              }}
              className="badge-tooltip"
              >
                {badgeData.name}
              </div>
            )}
          </motion.div>
        );
      })}
      </div>

      {allBadges.length === 0 && (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: 'var(--light-blue)' }}>
            NO ACHIEVEMENTS YET
          </div>
          <div style={{ fontSize: '10px', color: 'var(--bright-blue)', marginTop: '10px' }}>
            Complete topics to earn badges!
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;