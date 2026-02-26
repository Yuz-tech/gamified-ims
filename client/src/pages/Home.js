import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leaderboardRes, userRes, badgesRes] = await Promise.all([
        api.get('/leaderboard?limit=5'),
        api.get('/auth/me'),
        api.get('/admin/badges')
      ]);

      setLeaderboard(leaderboardRes.data);
      
      // Get all badges
      const allBadges = badgesRes.data;
      
      // Get user's earned badge IDs
      const earnedBadgeIds = (userRes.data.badges || []).map(
        ub => ub.badgeId?._id || ub.badgeId
      );

      // Map badges with earned status
      const badgesWithStatus = allBadges.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge._id)
      }));

      setUserBadges(badgesWithStatus);

      // Calculate stats
      const earnedCount = badgesWithStatus.filter(b => b.earned).length;
      const totalCount = badgesWithStatus.length;

      setStats({
        level: userRes.data.level || 1,
        xp: userRes.data.xp || 0,
        totalBadges: earnedCount,
        completedTopics: userRes.data.completedTopics?.length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING...</div>
      </div>
    );
  }

  const nextLevelXP = Math.pow(stats.level, 2) * 100;
  const progressToNextLevel = ((stats.xp % nextLevelXP) / nextLevelXP) * 100;

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      {/* Welcome Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <h1 className="neon-text" style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--primary-navy)' }}>
          KONNICHIWA, {user?.username?.toUpperCase()}!
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
          Ready to train?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Level Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            LEVEL
          </div>
          <div style={{ fontSize: '48px', color: 'var(--bright-blue)', fontWeight: 'bold' }}>
            {stats.level}
          </div>
          <div style={{
            marginTop: '15px',
            background: 'var(--bg-dark)',
            border: '2px solid var(--primary-navy)',
            height: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, var(--bright-blue), var(--light-blue))',
              height: '100%',
              width: `${progressToNextLevel}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>
            {Math.round(progressToNextLevel)}% to Level {stats.level + 1}
          </div>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            TOTAL XP
          </div>
          <div style={{ fontSize: '48px', color: 'var(--orange-accent)', fontWeight: 'bold' }}>
            {stats.xp}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
            Experience Points
          </div>
        </motion.div>

        {/* Badges Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="retro-card"
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/achievements')}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            BADGES EARNED
          </div>
          <div style={{ fontSize: '48px', color: 'var(--success-green)', fontWeight: 'bold' }}>
            {stats.totalBadges}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
            Click to view all
          </div>
        </motion.div>

        {/* Topics Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="retro-card"
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/topics')}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            COMPLETED TOPICS
          </div>
          <div style={{ fontSize: '48px', color: 'var(--light-blue)', fontWeight: 'bold' }}>
            {stats.completedTopics}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
            Click to continue
          </div>
        </motion.div>

        {/* IMS Portal Link Card -- change if ever man the url changes IRL*/}
        <motion.div 
          initial = {{ scale: 0.9, opacity: 0 }}
          animate = {{ scale: 1, opacity: 1 }}
          transition = {{ delay: 0.5 }}
          className = "retro-card"
          style = {{
            textAlign: 'center',
            cursor: 'pointer',
            background: 'linear gradient(135deg, var(--bright-blue) 0%, var(--light-blue) 100%',
            border: '3px solid var(--primary-navy)',
            color: 'white'
          }}
          onClick={() => window.open('https:webmail.awsys-i.com', '_blank')}
          >
            <div style = {{ 
              fontSize: '10px',
              marginBottom: '10px',
              opacity: 0.9
            }}>
              Quick Access
            </div>
            {/* <div style = {{ fontSize: '40px', marginBottom: '10px' }}>QUICKIE</div> */}
            <div style = {{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              IMS Portal
            </div>
            <div style = {{ fontSize: '8px', opacity: 0.8 }}>
              Click to open
            </div>
          </motion.div>
      </div>

      {/* Badge Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="retro-card"
        style={{ marginBottom: '40px' }}
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          YOUR BADGE COLLECTION
        </h3>

        {userBadges.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '20px'
          }}>
            {userBadges.map((badge, index) => {
              const imageUrl = badge.imageUrl.startsWith('/uploads/') 
                ? `http://localhost:5000${badge.imageUrl}` 
                : badge.imageUrl;

              return (
                <motion.div
                  key={badge._id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                  style={{
                    textAlign: 'center',
                    opacity: badge.earned ? 1 : 0.3,
                    filter: badge.earned ? 'none' : 'grayscale(100%)'
                  }}
                  title={badge.name}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 10px',
                    border: `3px solid ${badge.earned ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: badge.earned ? 'var(--bg-lightest)' : 'var(--bg-medium)',
                    boxShadow: badge.earned ? '3px 3px 0 var(--primary-navy)' : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {badge.earned ? (
                      <>
                        <img 
                          src={imageUrl}
                          alt={badge.name}
                          style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            imageRendering: 'pixelated'
                          }}
                          onError={(e) => {
                            console.error('Badge image failed to load:', imageUrl);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="font-size: 40px;">🏆</div>';
                          }}
                        />
                        {/* Shine effect */}
                        <div style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                          animation: 'shine 3s infinite',
                          pointerEvents: 'none'
                        }} />
                      </>
                    ) : (
                      <div style={{ fontSize: '40px', color: 'var(--text-lighter)' }}>
                        🔒
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '8px', 
                    color: badge.earned ? 'var(--text-dark)' : 'var(--text-light)',
                    fontWeight: badge.earned ? 'bold' : 'normal'
                  }}>
                    {badge.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
            <div style={{ fontSize: '12px' }}>No badges yet - complete topics to earn badges!</div>
          </div>
        )}

        <button
          onClick={() => navigate('/achievements')}
          className="retro-btn"
          style={{ marginTop: '20px', width: '100%' }}
        >
          VIEW ALL ACHIEVEMENTS →
        </button>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="retro-card"
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          TOP PERFORMERS
        </h3>

        {leaderboard.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.map((player, index) => (
              <motion.div
                key={player._id || index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: index === 0 ? '3px solid var(--orange-accent)' : '2px solid var(--border-color)',
                  background: index === 0 ? 'rgba(249, 115, 22, 0.05)' : 'var(--bg-light)',
                  boxShadow: index === 0 ? '3px 3px 0 var(--primary-navy)' : 'none'
                }}
              >
                <div style={{
                  fontSize: '20px',
                  marginRight: '15px',
                  minWidth: '30px',
                  textAlign: 'center'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold' }}>
                    {player.username}
                  </div>
                  <div style={{ fontSize: '8px', color: 'var(--text-light)' }}>
                    Level {player.level} • {player.xp} XP
                  </div>
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--orange-accent)',
                  padding: '5px 10px',
                  border: '2px solid var(--orange-accent)',
                  background: 'rgba(249, 115, 22, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ opacity: player.badgeCount > 0 ? 1 : 0.3 }}>🏆</span>
                  {player.badgeCount}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            No leaderboard data yet
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;