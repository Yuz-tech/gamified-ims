import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
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
        <div className="loading neon-text">LOADING TOPICS...</div>
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
        style={{ 
          fontSize: '28px', 
          marginBottom: '40px',
          textAlign: 'center',
          color: 'var(--orange-accent)'
        }}
      >
        📚 TRAINING TOPICS
      </motion.h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {topics.map((topic, index) => (
          <motion.div
            key={topic._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="retro-card"
            style={{
              cursor: 'pointer',
              position: 'relative',
              opacity: topic.isCompleted ? 0.7 : 1
            }}
            onClick={() => navigate(`/topics/${topic._id}`)}
            whileHover={{ scale: 1.02 }}
          >
            {topic.isCompleted && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'var(--bright-blue)',
                color: 'var(--primary-navy)',
                padding: '5px 10px',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: '0 0 10px var(--bright-blue)'
              }}>
                ✓ COMPLETED
              </div>
            )}

            <div style={{
              width: '100%',
              height: '150px',
              background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--bg-dark) 100%)',
              border: '2px solid var(--bright-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: '20px',
              boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.2)'
            }}>
              {topic.isCompleted ? '✅' : '📖'}
            </div>

            <h3 style={{
              fontSize: '14px',
              color: 'var(--light-blue)',
              marginBottom: '15px',
              textShadow: '0 0 10px var(--light-blue)'
            }}>
              {topic.title}
            </h3>

            <p style={{
              fontSize: '10px',
              color: 'var(--bright-blue)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {topic.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              fontSize: '9px',
              marginTop: '20px'
            }}>
              <div style={{
                padding: '10px',
                border: '1px solid var(--sky-blue)',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--orange-accent)' }}>⭐ XP REWARD</div>
                <div style={{ color: 'var(--sky-blue)', marginTop: '5px', fontSize: '14px' }}>
                  {topic.xpReward}
                </div>
              </div>
              <div style={{
                padding: '10px',
                border: '1px solid var(--light-blue)',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--orange-accent)' }}>🎯 PASSING</div>
                <div style={{ color: 'var(--light-blue)', marginTop: '5px', fontSize: '14px' }}>
                  {topic.passingScore}%
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '10px',
              background: topic.isCompleted 
                ? 'rgba(0, 255, 0, 0.1)' 
                : 'rgba(255, 255, 0, 0.1)',
              border: `2px solid ${topic.isCompleted ? 'var(--bright-blue)' : 'var(--orange-accent)'}`,
              textAlign: 'center',
              fontSize: '10px',
              color: topic.isCompleted ? 'var(--bright-blue)' : 'var(--orange-accent)'
            }}>
              {topic.isCompleted ? '✓ BADGE EARNED' : '🎮 CLICK TO START'}
            </div>
          </motion.div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
          <div style={{ fontSize: '14px', color: 'var(--light-blue)' }}>
            NO TOPICS AVAILABLE YET
          </div>
          <div style={{ fontSize: '10px', color: 'var(--bright-blue)', marginTop: '10px' }}>
            Check back soon for new training content!
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;