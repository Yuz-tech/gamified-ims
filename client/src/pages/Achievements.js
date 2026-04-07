import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../utils/api';
import { getImageUrl } from '../utils/getImageUrl';

const Achievements = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const topicRes = await api.get('/topics');
      const userRes = await api.get('/auth/me');

      const earnedBadgeTopicIds = (userRes.data.badges || []).map(b => b.topicId?.toString());

      const topicsWithBadges = topicRes.data.map(topic => ({
        ...topic, earned: earnedBadgeTopicIds.includes(topic._id.toString())
      }));

      setTopics(topicsWithBadges);
    } catch (error) {
      console.error('Error fetching achievements:', error);
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

  const earnedCount = topics.filter(t => t.earned).length;
  const totalCount = topics.length;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div className="scanlines"></div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        Achievements
      </motion.h1>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          Your Progress
        </h3>

        <div style={{ fontSize: '48px', color: 'var(--bright-blue)', marginBottom: '20px', fontWeight: 'bold' }}>
          {earnedCount} / {totalCount}
        </div>

        <div style = {{
          width: '100%',
          height: '30px',
          background: 'var(--bg-dark)',
          border: '3px solid var(--primary-navy)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--success-green), var(--bright-blue))'
            }}
          />
        </div>

        <div style = {{ fontSize: '12px', color: 'var(--text-medium)' }}>
          {Math.round(progress)}% Complete
        </div>
      </motion.div>

      {/* Badges */}
      <div style = {{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        {topics.map((topic, index) => {
          const imageUrl = topic.badgeImage?.startsWith('/uploads/')
            ? <img src={getImageUrl(topic.badgeImage)} alt={topic.badgeName}
                          style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<div style="font-size: 48px;">🏆</div>';
                          }}
                        />
            : topic.badgeImage;
            
            return (
              <motion.div
                key={topic._id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="retro-card"
                style={{
                  textAlign: 'center',
                  opacity: topic.earned ? 1 : 0.4,
                  filter: topic.earned ? 'none' : 'grayscale(100%)',
                  position: 'relative'
                }}
              >

                <div style = {{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 15px',
                  border: `4px solid ${topic.earned ? 'var(--bg-dark)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: topic.earned ? 'var(--bg-lightest)' : 'var(--bg-medium)',
                  boxShadow: topic.earned ? '3px 3px 0 var(--primary-navy)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '50%'
                }}>
                  {topic.earned ? (
                    imageUrl ? (
                      <>
                        <img src={getImageUrl(topic.badgeImage)} alt={topic.badgeName}
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<div style="font-size: 48px;">🏆</div>';
                          }}
                        />
                        <div style = {{
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
                      <div style = {{ fontSize: '48px' }}>🏆</div>
                    )
                  ) : (
                    <div style = {{ fontSize: '48px', color: 'var(--text-lighter)' }}>🔒</div>
                  )}
                </div>

                <h4 style={{ 
                  fontSize: '12px',
                  color: topic.earned ? 'var(--primary-navy)' : 'var(--text-light)',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  {topic.badgeName || topic.title}
                </h4>
              </motion.div>
            );
        })}
      </div>

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

export default Achievements;