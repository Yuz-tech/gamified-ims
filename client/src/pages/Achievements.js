import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Achievements = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTopics([]);
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

  const completedTopics = topics.filter(t => t.isCompleted);
  const totalTopics = topics.length;
  const progressPercentage = totalTopics > 0 ? (completedTopics.length / totalTopics) * 100 : 0;
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
        🏆 YOUR ACHIEVEMENTS ({currentYear})
      </motion.h1>

      {/* Progress Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="retro-card pixel-corners"
        style={{ marginBottom: '40px' }}
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px', textAlign: 'center' }}>
          TRAINING PROGRESS
        </h3>

        <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '20px', color: 'var(--bright-blue)' }}>
          {completedTopics.length} / {totalTopics}
        </div>

        <div style={{
          background: 'var(--bg-dark)', border: '3px solid var(--primary-navy)',
          height: '40px', position: 'relative', overflow: 'hidden', marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, var(--bright-blue), var(--light-blue))',
            height: '100%', width: `${progressPercentage}%`,
            transition: 'width 1s ease', boxShadow: '0 0 20px var(--bright-blue)'
          }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--orange-accent)' }}>
          {progressPercentage === 100 
            ? '🎊 ALL TOPICS COMPLETED! 🎊'
            : `${Math.round(progressPercentage)}% COMPLETE`
          }
        </div>
      </motion.div>

      {/* Topics as Badges */}
      {topics.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
          {topics.map((topic, index) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="retro-card"
              style={{
                textAlign: 'center',
                opacity: topic.isCompleted ? 1 : 0.5,
                border: `3px solid ${topic.isCompleted ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                boxShadow: topic.isCompleted ? '4px 4px 0 var(--primary-navy)' : 'none'
              }}
            >
              <div style={{
                width: '120px', height: '120px', margin: '0 auto 20px',
                border: `3px solid ${topic.isCompleted ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: topic.isCompleted ? 'var(--bg-lightest)' : 'var(--bg-medium)',
                fontSize: '48px',
                filter: topic.isCompleted ? 'none' : 'grayscale(100%)'
              }}>
                {topic.isCompleted ? '🏆' : '🔒'}
              </div>

              <h4 style={{
                fontSize: '11px',
                color: topic.isCompleted ? 'var(--primary-navy)' : 'var(--text-light)',
                marginBottom: '10px', fontWeight: 'bold'
              }}>
                {topic.title}
              </h4>

              <div style={{
                fontSize: '9px',
                color: topic.isCompleted ? 'var(--success-green)' : 'var(--error-red)',
                padding: '8px 10px',
                border: `2px solid ${topic.isCompleted ? 'var(--success-green)' : 'var(--error-red)'}`,
                fontWeight: 'bold'
              }}>
                {topic.isCompleted ? '✓ COMPLETED' : '✗ LOCKED'}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: 'var(--bright-blue)' }}>NO TOPICS YET</div>
          <button onClick={fetchData} className="retro-btn" style={{ marginTop: '20px' }}>🔄 REFRESH</button>
        </div>
      )}
    </div>
  );
};

export default Achievements;