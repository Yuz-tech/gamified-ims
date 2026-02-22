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
      setTopics(response.data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        📚 TRAINING TOPICS
      </motion.h1>

      {topics.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {topics.map((topic, index) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="retro-card"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/topics/${topic._id}`)}
            >
              {topic.isCompleted && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'var(--success-green)', color: 'white',
                  padding: '5px 10px', fontSize: '10px', fontWeight: 'bold',
                  boxShadow: '2px 2px 0 var(--primary-navy)'
                }}>
                  ✓ COMPLETED
                </div>
              )}

              <div style={{
                width: '100%', height: '150px',
                background: 'linear-gradient(135deg, var(--bg-medium) 0%, var(--bg-dark) 100%)',
                border: '2px solid var(--bright-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '48px', marginBottom: '20px'
              }}>
                {topic.isCompleted ? '✅' : '📖'}
              </div>

              <h3 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '15px', fontWeight: 'bold' }}>
                {topic.title}
              </h3>

              <p style={{ fontSize: '10px', color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '20px' }}>
                {topic.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '20px' }}>
                <div style={{ padding: '10px', border: '2px solid var(--orange-accent)', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-medium)', fontSize: '9px' }}>⭐ XP</div>
                  <div style={{ color: 'var(--orange-accent)', marginTop: '5px', fontSize: '14px' }}>{topic.xpReward}</div>
                </div>
                <div style={{ padding: '10px', border: '2px solid var(--bright-blue)', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-medium)', fontSize: '9px' }}>🎯 PASS</div>
                  <div style={{ color: 'var(--bright-blue)', marginTop: '5px', fontSize: '14px' }}>{topic.passingScore}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
          <div style={{ fontSize: '14px', color: 'var(--bright-blue)' }}>NO TOPICS AVAILABLE YET</div>
          <button onClick={fetchTopics} className="retro-btn" style={{ marginTop: '20px' }}>🔄 REFRESH</button>
        </div>
      )}
    </div>
  );
};

export default Topics;