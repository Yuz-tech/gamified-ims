import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { getImageUrl } from "../utils/getImageUrl";

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllTopics();
  }, []);

  const fetchAllTopics = async () => {
    try {
      const response = await api.get('/topics');
      setAllTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeBorderColor = (count) => {
    if (count >=5 ) return '#9333ea';
    if (count === 4) return '#06b6d4';
    if (count === 3) return '#FDD017';
    if (count === 2) return '#A8A9AD';
    return '#CD7F32';
  };

  const getBadgeBorderName = (count) => {
    if (count >=5 ) return 'PRIME';
    if (count === 4) return 'PLATINUM';
    if (count === 3) return 'GOLD';
    if (count === 2) return 'SILVER';
    return 'BRONZE';
  };

  const badges = allTopics.map(topic => {
    const userBadge = user?.badges?.find(b => b.topicId === topic._id);
    const badgeCount = userBadge?.badgeCount || 0;
    const isCompleted = user?.completedTopics?.some(ct => ct.topicId === topic._id);
    // const isEarned = userBadge?.earnedAt && new Date(userBadge.earnedAt).getFullYear === currentYear;
    const isEarned = userBadge; // old one

    return {
      topicId: topic._id,
      name: topic.badgeName,
      image: topic.badgeImage,
      description: topic.description,
      isEarned,
      badgeCount,
      isCompleted,
      earnedAt: userBadge?.earnedAt,
      borderColor: getBadgeBorderColor(badgeCount),
      borderName: getBadgeBorderName(badgeCount)
    };
  });

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.isEarned;
    if (filter === 'locked') return !badge.isEarned;
    return true;
  });

  const earnedCount = badges.filter(b => b.isEarned).length;
  const totalCount = badges.length;
  const completionPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const completedTopicsCount = user?.completedTopics?.length || 0;
  const topicProgressPercentage = totalCount > 0 ? Math.round((completedTopicsCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)'}}>
          Achievements
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                Badges Earned
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                {earnedCount} / {totalCount}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                COMPLETION
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--success-green)' }}>
                {completionPercentage}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                CURRENT PROGRESS
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--orange-accent)'}}>
                {completedTopicsCount} / {totalCount}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '8px' }}>
              Training Progress
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              background: 'var(--bg-medium)',
              border: '2px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topicProgressPercentage}%`}}
                transition={{ duration: 1, ease: 'easeOut'}}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--success-green), var(--bright-blue))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'white' }}>
                  {topicProgressPercentage}%
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacit: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'retro-btn' : 'retro-btn secondary'} style={{ fontSize: '11px', padding: '10px 20px' }}>
              ALL ({totalCount})
            </button>
            <button onClick={() => setFilter('earned')} className={filter === 'earned' ? 'retro-btn' : 'retro-btn secondary'} style={{ fontSize: '11px', padding: '10px 20px'}}>
              EARNED ({earnedCount})
            </button>
            <button onClick={() => setFilter('locked')} className={filter === 'locked' ? 'retro-btn' : 'retro-btn secondary'} style={{ fontSize: '11px', padding: '10px 20px' }}>
              LOCKED ({totalCount - earnedCount})
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', color: 'var(--text-medium)' }}>
            Note: Tiers are increased each time you complete your annual IMS awareness training.
          </div>
        </motion.div>

        {/* Badges Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {filteredBadges.map((badges, index) => (
            <motion.div
              key={badges.topicId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`retro-card ${badges.borderColor === '#9333ea' ? 'retro-card--fiery' : ''}`}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                opacity: badges.isEarned ? 1 : 0.5,
                position: 'relative',
                border: `4px solid ${badges.borderColor}`,
                background: badges.isEarned ? 'white' : 'var(--bg-light)'
              }}
              onClick={() => navigate(`/topics/${badges.topicId}`)}
            >
              {/* Badge count indicator */}
              {badges.badgeCount > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '100%',
                  height: '30px',
                  background: badges.borderColor,
                  border: '3px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {badges.borderName} TIER
                </div>
              )}

              {/* Badge Image */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + index * 0.1, type: 'pulse' }}
                title={badges.name}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '20px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-lightest)'
                  }}>
                    {badges.isEarned && badges.isCompleted ? (
                  <img src={getImageUrl(badges.image)}
                    alt={badges.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'linear-gradient(45deg, transparent 30% rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                      animation: 'shine 3s infinite'
                    }}
                    onError={(e) => {
                      e.target.src = '/uploads/badges/default.png';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--bg-medium)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: 'var(--text-light)'
                  }}>
                    🔒︎
                  </div>
                )}
                  </div>
              </motion.div>

              {/* BadgeName */}
              <h3 style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: badges.isEarned ? 'var(--text-medium)' : 'var(--text-light)',
                marginBottom: '10px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px',
                lineHeight: '20px'
              }}>
                {badges.name}
              </h3>

              {/* Status */}
              <div style={{
                fontSize: '9px',
                color: badges.isCompleted ? 'var(--success-green)' : 'var(--text-light)',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {badges.isEarned ? (badges.isCompleted ? 'COMPLETED' : '') : 'LOCKED'}
              </div>
            </motion.div>
          ))}
        </div>
    </div>
  );
};

export default Achievements;