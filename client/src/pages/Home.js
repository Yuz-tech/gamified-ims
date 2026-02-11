import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Home = () => {
  const { user, updateUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const carouselContent = [
    {
      title: '🎮 WELCOME TO IMS TRAINING ARCADE',
      text: 'Level up your IMS knowledge through interactive training modules!'
    },
    {
      title: '🏆 COLLECT BADGES',
      text: 'Complete topics and quizzes to earn exclusive badges and XP!'
    },
    {
      title: '📊 CLIMB THE LEADERBOARD',
      text: 'Compete with your colleagues and become the top player!'
    },
    {
      title: '🎯 MASTER YOUR SKILLS',
      text: 'Watch videos, pass quizzes, and prove your expertise!'
    }
  ];

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [leaderboardRes, userRes] = await Promise.all([
        api.get('/leaderboard?limit=5'),
        api.get('/auth/me')
      ]);

      setLeaderboard(leaderboardRes.data);
      setBadges(userRes.data.badges || []);
      updateUser(userRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        minHeight: '100vh' 
      }}>
        <div className="loading neon-text">LOADING...</div>
      </div>
    );
  }

  const xpToNextLevel = ((user?.level || 1) ** 2) * 100;
  const currentLevelXp = ((user?.level || 1) - 1) ** 2 * 100;
  const xpProgress = (user?.xp || 0) - currentLevelXp;
  const progressPercentage = (xpProgress / (xpToNextLevel - currentLevelXp)) * 100;

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      {/* Carousel */}
      <motion.div
        className="retro-card pixel-corners"
        style={{ marginBottom: '40px', minHeight: '200px' }}
      >
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          style={{ textAlign: 'center', padding: '40px 20px' }}
        >
          <h2 className="neon-text" style={{ 
            fontSize: '18px', 
            marginBottom: '20px',
            color: 'var(--neon-yellow)'
          }}>
            {carouselContent[currentSlide].title}
          </h2>
          <p style={{ 
            fontSize: '10px', 
            lineHeight: '1.8',
            color: 'var(--neon-cyan)'
          }}>
            {carouselContent[currentSlide].text}
          </p>
        </motion.div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px',
          marginTop: '20px'
        }}>
          {carouselContent.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '15px',
                height: '15px',
                border: `2px solid ${index === currentSlide ? 'var(--neon-cyan)' : 'var(--neon-green)'}`,
                background: index === currentSlide ? 'var(--neon-cyan)' : 'transparent',
                cursor: 'pointer',
                boxShadow: index === currentSlide ? '0 0 15px var(--neon-cyan)' : 'none'
              }}
            />
          ))}
        </div>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* XP Progress */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ 
            fontSize: '14px', 
            marginBottom: '20px',
            color: 'var(--neon-pink)',
            textShadow: '0 0 10px var(--neon-pink)'
          }}>
            ⭐ YOUR PROGRESS
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '10px',
              color: 'var(--neon-cyan)'
            }}>
              <span>LEVEL {user?.level || 1}</span>
              <span>LEVEL {(user?.level || 1) + 1}</span>
            </div>
            <div style={{
              background: 'var(--darker-bg)',
              border: '2px solid var(--neon-green)',
              height: '30px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
                height: '100%',
                width: `${Math.min(progressPercentage, 100)}%`,
                transition: 'width 0.5s ease',
                boxShadow: '0 0 20px var(--neon-green)'
              }} />
            </div>
            <div style={{ 
              textAlign: 'center', 
              marginTop: '10px',
              fontSize: '10px',
              color: 'var(--neon-green)'
            }}>
              {user?.xp || 0} / {xpToNextLevel} XP
            </div>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            fontSize: '12px'
          }}>
            <div style={{ 
              padding: '15px',
              border: '2px solid var(--neon-green)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--neon-yellow)', marginBottom: '5px' }}>
                🏅 BADGES
              </div>
              <div style={{ fontSize: '24px', color: 'var(--neon-green)' }}>
                {badges.length}
              </div>
            </div>
            <div style={{ 
              padding: '15px',
              border: '2px solid var(--neon-cyan)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--neon-yellow)', marginBottom: '5px' }}>
                ✅ TOPICS
              </div>
              <div style={{ fontSize: '24px', color: 'var(--neon-cyan)' }}>
                {user?.completedTopics?.length || 0}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="retro-card"
        >
          <h3 style={{ 
            fontSize: '14px', 
            marginBottom: '20px',
            color: 'var(--neon-pink)',
            textShadow: '0 0 10px var(--neon-pink)'
          }}>
            🏆 YOUR BADGES
          </h3>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            minHeight: '120px'
          }}>
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '3px solid var(--neon-yellow)',
                    padding: '5px',
                    background: 'var(--darker-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    boxShadow: '0 0 20px var(--neon-yellow)',
                    cursor: 'pointer'
                  }}
                  title={badge.badgeId?.name}
                >
                  {badge.badgeId?.imageUrl}
                </motion.div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--neon-cyan)',
                fontSize: '10px'
              }}>
                NO BADGES YET!
                <br />
                COMPLETE TOPICS TO EARN BADGES
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="retro-card"
          style={{ gridColumn: '1 / -1' }}
        >
          <h3 style={{ 
            fontSize: '14px', 
            marginBottom: '20px',
            color: 'var(--neon-pink)',
            textShadow: '0 0 10px var(--neon-pink)'
          }}>
            👑 LEADERBOARD
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--neon-green)' }}>
                  <th style={{ padding: '10px', color: 'var(--neon-yellow)' }}>RANK</th>
                  <th style={{ padding: '10px', color: 'var(--neon-yellow)', textAlign: 'left' }}>
                    PLAYER
                  </th>
                  <th style={{ padding: '10px', color: 'var(--neon-yellow)' }}>LEVEL</th>
                  <th style={{ padding: '10px', color: 'var(--neon-yellow)' }}>XP</th>
                  <th style={{ padding: '10px', color: 'var(--neon-yellow)' }}>BADGES</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player) => (
                  <tr
                    key={player.rank}
                    style={{ 
                      borderBottom: '1px solid var(--grid-color)',
                      background: player.username === user?.username 
                        ? 'rgba(0, 255, 255, 0.1)' 
                        : 'transparent'
                    }}
                  >
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center',
                      color: player.rank === 1 ? 'var(--neon-yellow)' : 'var(--neon-green)'
                    }}>
                      {player.rank === 1 && '👑'} #{player.rank}
                    </td>
                    <td style={{ 
                      padding: '10px',
                      color: player.username === user?.username 
                        ? 'var(--neon-cyan)' 
                        : 'var(--neon-green)'
                    }}>
                      {player.username}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--neon-pink)' }}>
                      {player.level}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--neon-cyan)' }}>
                      {player.xp}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--neon-yellow)' }}>
                      {player.badgeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;