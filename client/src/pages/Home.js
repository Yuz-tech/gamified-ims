import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/getImageUrl';
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
  const [completionFormUrl, setCompletionFormUrl] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
  {
    title: "IMS Awareness Training",
    description: "Play while learning! The gamified IMS Awareness training offers interactive quizzes and rewards.",
    color: "var(--bright-blue)"
  },
  {
    title: "Earn XP and Level Up",
    description: "Complete topics to gain XP and advance your rank",
    icon: "",
    color: 'var(--orange-accent)'
  },
  {
    title: "Unlock Badges",
    description: "Collect badges through completing training topics",
    icon: "",
    color: "var(--success-green)"
  },
  {
    title: "Play Games",
    description: "Test your IMS knowledge with word game demos",
    icon: "",
    color: "var(--primary-navy)"
  }
];

  useEffect(() => {
    fetchData();
    fetchCompletionFormUrl();
    const interval = setInterval(() => {
    setCurrentSlide(prev => (prev+1)%carouselSlides.length);
  }, 4000);

  return () => clearInterval(interval);
  }, [user]);

  const fetchCompletionFormUrl = async () => {
    try {
      const response = await api.get('/admin/settings/public');

      setCompletionFormUrl(response.data.settingValue);
    } catch (error) {
      console.error('Error fetching form URL: ', error);
      setCompletionFormUrl('https://forms.gle/your-form-id');
    }
  };

 const fetchData = async () => {
  try {    
    const [leaderboardRes, userRes, topicsRes] = await Promise.all([
      api.get('/leaderboard?limit=5'),
      api.get('/auth/me'),
      api.get('/topics')
    ]);

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

// Frontend: add inside component scope
const handleFinishClick = () => {
  api.post('/auth/finish');
};

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      {/* Finish Training Button */}
      {allTopicsCompleted && completionFormUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='retro-card'
          style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--success-green)', marginTop: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--success-green)', marginBottom: '20px', lineHeight: '52px' }}>
              .✦ ݁˖⋆✴︎˚｡⋆.✦ ݁˖
              <br />
              TRAINING COMPLETED!
            </h3>
            <p style={{ fontSize: '11px', marginBottom: '20px', lineHeight: '1.6' }}>
              You have completed the IMS Awareness Training and collected all badges! 
              <br />
              Don't forget to fill out the completion form.
            </p>

            <a href={completionFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className='retro-btn'
              style={{ display: 'inline-block', textDecoration: 'none', width: '100%', textAlign: 'center', backgroundColor: '#36f805' }}
              onClick={handleFinishClick}  
            >
                Fill out completion form
              </a>
          </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <h1 className="neon-text" style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--primary-navy)' }}>
          {/* <strong style = {{ fontSize: '52px'}}>こんにちは</strong> */}
          <strong style = {{ fontSize: '52px'}}>Welcome</strong>
          , {user?.username}!
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-light)' }}>
          Press the button below to start training
        </p>
        <br />

        <button className='retro-btn' style={{ width: '80px', height: '80px', background: '#24a600', borderRadius: '70%', fontSize: '35px', color: 'white', padding: '12px' }} onClick={(e) => {
          e.stopPropagation();
          navigate('/topics');
        }}>
          始
        </button>
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

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='retro-card'
        style={{
          marginBottom: '40px',
          padding: '0',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '300px'
        }}
      >
        {carouselSlides.map((slide, index) => (
          <div key={index} style={{
            display: index === currentSlide ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            background: `linear-gradient(135deg, ${slide.color} 0%, var(--primary-navy) 100%)`,
            color: 'white',
            textAlign: 'center',
            minHeight: '300px'
          }}
          >
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>
              {slide.icon}
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '15px', fontWeight: 'bold' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: '14px', opacity: 0.9, maxWidth: '500px' }}>
              {slide.description}
            </p>
          </div>
        ))}

        {/* Controls */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px'
        }}>
          {carouselSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            />
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="retro-card"
      >
        <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          TOP ACTIVE PLAYERS
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
                  border: index === 0 ? '3px solid #ffd700' : '2px solid var(--border-color)',
                  background: index === 0 ? 'rgba(249, 115, 22, 0.05)' : 'var(--bg-light)',
                  boxShadow: index === 0 ? '3px 3px 0 var(--primary-navy)' : 'none'
                }}
              >
                <div style={{ fontSize: '15px', marginRight: '15px', minWidth: '30px', textAlign: 'center' }}>
                  {index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : `${index + 1}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: index === 0 ? '3px solid var(--warning-yellow)' : '2px solid var(--bright-blue)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'var(--bg-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {player.avatar ? (
                    <img src={getImageUrl(player.avatar)} alt={player.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="font-size: 24px;">👤</div>';
                    }}
                    />
                  ) : (
                    <div style={{ fontSize: '24px' }}>👤</div>
                  )}
                </div>

                <div style = {{ flex: 1 }}>
                  <div style = {{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold', paddingLeft: '15px' }}>
                    {player.username}
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
                  Level {player.level}
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