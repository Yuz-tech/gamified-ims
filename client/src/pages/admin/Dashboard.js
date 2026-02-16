import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        <div className="loading neon-text">LOADING DASHBOARD...</div>
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
        ⚙️ ADMIN DASHBOARD
      </motion.h1>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
          <div style={{ fontSize: '36px', color: 'var(--light-blue)', marginBottom: '10px' }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--bright-blue)' }}>
            ACTIVE USERS
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
          <div style={{ fontSize: '36px', color: 'var(--orange-accent)', marginBottom: '10px' }}>
            {stats?.pendingUsers || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--bright-blue)' }}>
            PENDING REQUESTS
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
          <div style={{ fontSize: '36px', color: 'var(--sky-blue)', marginBottom: '10px' }}>
            {stats?.totalTopics || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--bright-blue)' }}>
            TOPICS
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="retro-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
          <div style={{ fontSize: '36px', color: 'var(--bright-blue)', marginBottom: '10px' }}>
            {stats?.totalBadges || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--bright-blue)' }}>
            BADGES
          </div>
        </motion.div>
      </div>

      {/* Top Users */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="retro-card"
      >
        <h3 style={{
          fontSize: '16px',
          color: 'var(--sky-blue)',
          marginBottom: '20px'
        }}>
          👑 TOP 10 USERS
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bright-blue)' }}>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>RANK</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>USERNAME</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>EMAIL</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>LEVEL</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>XP</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>BADGES</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topUsers?.map((user, index) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--grid-color)' }}>
                  <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>
                    {index + 1 === 1 && '👑'} #{index + 1}
                  </td>
                  <td style={{ padding: '10px', color: 'var(--light-blue)' }}>
                    {user.username}
                  </td>
                  <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--sky-blue)' }}>
                    {user.level}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--light-blue)' }}>
                    {user.xp}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--orange-accent)' }}>
                    {user.badges?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;