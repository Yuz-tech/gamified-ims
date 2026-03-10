import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalXP: 0,
        averageLevel: 0,
        completionRate: 0,
        topicStats: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [usersRes, topicsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/topics')
            ]);

            const users = usersRes.data.filter(u => u.role === 'employee');
            const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
            const avgLevel = users.length > 0 ? (users.reduce((sum, u) => sum + (u.level || 1), 0) / users.length).toFixed(1) : 1;

            const topicStats = topicsRes.data.map(topic => {
                const completedCount = users.filter(user => user.completedTopics?.some(ct => ct.topicId?.toString() === topic._id.toString() && ct.mandatoryCompleted)).length;
                return {
                    title: topic.title,
                    completed: completedCount,
                    percentage: users.length > 0 ? ((completedCount / users.length) * 100).toFixed(1) : 0
                };
            });

            setStats({
                totalUsers: users.length,
                activeUsers: users.filter(u => (u.xp || 0) > 0).length,
                totalXP,
                averageLevel: avgLevel,
                completionRate: topicStats.length > 0 
                  ? (topicStats.reduce((sum, t) => sum + parseFloat(t.percentage), 0) / topicStats.length).toFixed(1)
                  : 0,
                  topicStats
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <div style = {{ padding: '40px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '30px', color: 'var(--primary-navy)' }}>
                Analytics
            </h1>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="retro-card"
                  style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                        Total Users
                    </div>
                    <div style={{ fontSize: '36px', color: 'var(--bright-blue)', fontWeight: 'bold' }}>
                        {stats.totalUsers}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="retro-card"
                    style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>Active Users</div>
                        <div style={{ fontSize: '36px', color: 'var(--success-green)', fontWeight: 'bold' }}>{stats.activeUsers}</div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="retro-card"
                      style={{ textAlign: 'center' }}>
                        <div style = {{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>Total XP</div>
                        <div style = {{ fontSize: '36px', color: 'var(--orange-accent)', fontWeight: 'bold' }}>{stats.totalXP}</div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="retro-card"
                        style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>AVG Level</div>
                            <div style={{ fontSize: '36px', color: 'var(--secondary-pink)', fontWeight: 'bold' }}>{stats.averageLevel}</div>
                        </motion.div>
            </div>

            {/* Topic completion stats */}
            <div className="retro-card">
                <h3 style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--secondary-pink)'}}>
                    Topic Completion Rates
                </h3>
                {stats.topicStats.map((topic, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            fontSize: '11px'
                        }}>
                            <span>{topic.title}</span>
                            <span style = {{ fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                                {topic.completed}/{stats.totalUsers}
                                ({topic.percentage}%)
                            </span>
                        </div>
                        <div style={{ width: '100%', height: '20px', background: 'var(--bg-dark)', border: '2px solid var(--border-color)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.percentage}%`}}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              style={{ height: '100%', background: 'var(--bright-blue)' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;