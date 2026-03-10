import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200, 5950, 6750, 7600
];

const getXPForNextLevel = (currentLevel) => {
  if(currentLevel >= LEVEL_THRESHOLDS.length) {
    const lastThreshold=LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const increment = 1300 + (currentLevel - LEVEL_THRESHOLDS.length) * 150;
    return lastThreshold + increment;
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

const getXPForCurrentLevel = (currentLevel) => {
  if(currentLevel <= 1) return 0;
  return LEVEL_THRESHOLDS[currentLevel - 1] || 0;
};

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTopicsCompleted, setAllTopicsCompleted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
  try {
    console.log('Fetching home page data...');
    
    const [leaderboardRes, userRes, topicsRes] = await Promise.all([
      api.get('/leaderboard?limit=5'),
      api.get('/auth/me'),
      api.get('/topics')
    ]);

    console.log('Data fetched:', userRes.data);

    setLeaderboard(leaderboardRes.data || []);
    
    // Get user badges (no population needed)
    const badges = userRes.data.badges || [];
    setUserBadges(badges);

    // Calculate stats
    const earnedCount = badges.length;
    const totalTopics = topicsRes.data.length;
    const completedCount = userRes.data.completedTopics?.filter(ct => ct.mandatoryCompleted).length || 0;

    setStats({
      level: userRes.data.level || 1,
      xp: userRes.data.xp || 0,
      totalBadges: earnedCount,
      completedTopics: completedCount
    });

    // Check if all topics completed
    setAllTopicsCompleted(completedCount === totalTopics && totalTopics > 0);

  } catch (error) {
    console.error(' Error fetching home data:', error);
    
    setStats({
      level: user?.level || 1,
      xp: user?.xp || 0,
      totalBadges: 0,
      completedTopics: 0
    });
    setUserBadges([]);
    setLeaderboard([]);
  } finally {
    setLoading(false);
  }
};

  const handleFinishTraining = () => {
    window.open('Your_Google_Form_URL_Here', '_blank');
  };

  if(loading) {
    return (
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">Loading...</div>
      </div>
    );
  }

  const currentLevelXP = getXPForCurrentLevel(stats.level);
  const nextLevelXP = getXPForNextLevel(stats.level);
  const xpIntoLevel = stats.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressToNextLevel = (xpIntoLevel / xpNeededForLevel) * 100;

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
          Konnichiwa, {user?.username?.toUpperCase()}!
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
          Ready to Train?
        </p>
      </motion.div>

      {/* Stats */}
      <div style = {{
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
          <div style = {{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            LEVEL
          </div>
          <div style = {{ fontSize: '48px', color: 'var(--bright-blue)', fontWeight: 'bold' }}>
            {stats.level}
          </div>
          <div style = {{
            marginTop: '15px',
            background: 'var(--bg-dark)',
            border: '2px solid var(--primary-navy)',
            height: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style = {{
              background: 'linear-gradient(90deg, var(--bright-blue), var(--light-blue))',
              height: '100%',
              width: `${progressToNextLevel}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style = {{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>
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
          <div style = {{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            TOTAL XP
          </div>
          <div style = {{ fontSize: '48px', color: 'var(--orange-accent)', fontWeight: 'bold' }}>
            {stats.xp}
          </div>
          <div style = {{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
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
          <div style = {{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            Badges Earned
          </div>
          <div style = {{ fontSize: '48px', color: 'var(--success-green)', fontWeight: 'bold' }}>
            {stats.totalBadges}
          </div>
          <div style = {{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
            Click to View All
          </div>
        </motion.div>

        {/* Topics Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="retro-card"
          style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/topics')}
        >
          <div style = {{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            Completed Topics
          </div>
          <div style = {{ fontSize: '48px', color: 'var(--light-blue)', fontWeight: 'bold' }}>
            {stats.completedTopics}
          </div>
          <div style = {{ fontSize: '9px', color: 'var(--text-light)', marginTop: '10px' }}>
            Click to Continue
          </div>
        </motion.div>
      </div>

      {/* Finish Training Button */}
      {allTopicsCompleted ? (
        <motion.div
          initial = {{ scale: 0.9, opacity: 0 }}
          animate = {{ scale: 1, opacity: 1 }}
          className="retro-card"
          style = {{
            marginBottom: '40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--success-green) 0%, #059669 100%)',
            border: '3px solid #047857'
          }}>
            <div style = {{ fontSize: '18px', color: 'white', marginBottom: '15px', fontWeight: 'bold' }}>
              Congratulations!
            </div>
            <p style = {{ fontSize: '11px', color: 'white', marginBottom: '20px', opacity: 0.9 }}>
              You've completed all training topics! Click below to submit your completion form.
            </p>
            <button onClick={handleFinishTraining}
              className="retro-btn"
              style={{
                background: 'white',
                color: 'var(--success-green)',
                border: '3px solid white'
              }}>
                Submit Completion Form
              </button>
          </motion.div>
      ) : (
        <motion.div 
          initial = {{ scale: 0.9, opacity: 0 }}
          animate = {{ scale: 1, opacity: 1 }}
          className="retro-card"
          style={{ marginBottom: '40px', textAlign: 'center', opacity: 0.6 }}
        >
          <h3 style = {{ fontSize: '14px', color: 'var(--text-medium)', marginBottom: '10px' }}>
            Finish All Training
          </h3>
          <p style = {{ fontSize: '10px', color: 'var(--text-light)' }}>
            Complete ALL topics to unlock the completion form
          </p>
        </motion.div>
      )}

      {/* Badge Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="retro-card"
        style={{ marginBottom: '40px' }}
      >
        <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          Your Recent Badges
        </h3>

        {userBadges.length > 0 ? (
          <div style = {{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '20px'
          }}>
            {userBadges.slice(0, 6).map((badge, index) => {
              const imageUrl = badge.badgeImage?.startsWith('/uploads/')
              ? `http://localhost:5000${badge.badgeImage}`
              : badge.badgeImage

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                  style={{ textAlign: 'center' }}
                  title={badge.badgeName}
                >
                  <div style = {{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 10px',
                    border: '3px solid var(--orange-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-lightest)',
                    boxShadow: '3px 3px 0 var(--primary-navy)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {imageUrl ? (
                      <>
                        <img src = {imageUrl} alt={badge.badgeName} style={{
                          maxWidth: '90%', maxHeight: '90%', objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML += '<div style = "font-size: 40px;"></div>;'
                        }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                          animation: 'shine 3s infinite',
                          pointerEvents: 'none'
                        }} />
                      </>
                    ) : (
                      <div style = {{ fontSize: '8px', color: 'var(--text-dark)', fontWeight: 'bold' }}>
                        {badge.badgeName}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style = {{ fontSize: '12px' }}>No badges yet</div>
          </div>
        )}

        {userBadges.length > 0 && (
          <button onClick={() => navigate('/achievements')}
            className="retro-btn"
            style={{ marginTop: '20px', width: '100%' }}
          >
            View All Achievements
          </button>
        )}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="retro-card"
      >
        <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          Top Performers
        </h3>

        {leaderboard.length > 0 ? (
          <div style = {{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                <div style={{ fontSize: '20px', marginRight: '15px', minWidth: '30px', textAlign: 'center' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style = {{ flex: 1 }}>
                  <div style = {{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold' }}>
                    {player.username}
                  </div>
                  <div style = {{ fontSize: '8px', color: 'var(--text-light)' }}>
                    Level {player.level} • {player.xp} XP 
                  </div>
                </div>
                <div style = {{
                  fontSize: '10px',
                  color: 'var(--orange-accent)',
                  padding: '5px 10px',
                  border: '2px solid var(--orange-accent)',
                  background: 'rgba(249, 115, 22, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {player.badgeCount || 0}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style = {{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            No leaderboard data yet
          </div>
        )}
      </motion.div>

      <style>
        {`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        `}
      </style>
    </div>
  );
};

export default Home;