import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const YearlyReset = () => {
    const [confirmCode, setConfirmCode] = useState('');
    const [resetting, setResetting] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/users');
            const employees = response.data.filter(u => u.role === 'employee');
            const totalEmployees = employees.length;
            const employeesWithTopics = employees.filter(u => u.completedTopics?.length > 0).length;
            const employeesWithBadges = employees.filter(u => u.badges?.length > 0).length;

            const totalTopicsCompleted = employees.reduce((sum, u) => sum + (u.completedTopics?.length || 0), 0);
            const totalBadgesEarned = employees.reduce((sum, u) => sum + (u.badges?.length || 0), 0);

            setStats({
                totalEmployees,
                employeesWithTopics,
                employeesWithBadges,
                totalTopicsCompleted,
                totalBadgesEarned
            });
        } catch (error) {
            console.error('Error fetching stats: ', error);
        }
    };

    const handleYearlyReset = async (e) => {
        e.preventDefault();

        if (!window.confirm('Warning: This will reset employee topic progress')) {
            return;
        }

        if (!window.confirm('Final warning: This action cannot be undone!')) {
            return;
        }

        setResetting(true);

        try {
            const response = await api.post('/admin/yearly-reset', { confirmCode });
            
            alert(`Reset complete!`);
            setConfirmCode('');
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Reset failed');
            console.error('Reset error: ', error);
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <div className="scanlines"></div>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="neon-text"
              style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--error-red)' }}>
                Yearly Reset
              </motion.h1>

              {/* Current Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="retro-card"
                  style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
                        Current Stats
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--bg-light)', border: '2px solid var(--border-color)' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                                {stats.totalEmployees}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginTop: '5px' }}>
                                Total Employees
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--bg-light)', border: '2px solid var(--border-color)' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-green)' }}>
                                {stats.totalTopicsCompleted}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginTop: '5px' }}>
                                Total Topics Completed
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--bg-light)', border: '2px solid var(--border-color)' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--orange-accent)' }}>
                                {stats.totalBadgesEarned}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginTop: '5px' }}>
                                Total Badges Earned
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--bg-light)', border: '2px solid var(--border-color)' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary-pink)' }}>
                                {stats.employeesWithTopics}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginTop: '5px' }}>
                                Employees with Progress
                            </div>
                        </div>
                    </div>
                  </motion.div>
              )}

              {/* Warning Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    padding: '20px',
                    marginBottom: '30px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '3px solid var(--error-red)',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--error-red)', marginBottom: '15px', fontWeight: 'bold' }}>
                        Read Carefully
                    </h3>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', marginBottom: '15px' }}>
                        <strong>This action will: </strong>
                        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                            <li>Clear ALL employee topic completions for the year</li>
                            <li>Retain user XP and Levels</li>
                            <li>Preserve badges</li>
                        </ul>
                    </div>

                    <div style={{
                        padding: '15px',
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '2px solid var(--orange-accent)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'var(--orange-accent)',
                        marginTop: '15px'
                    }}>
                        This action cannot be undone! Use this at the start of a new training year.
                    </div>
                </motion.div>

                {/* Reset form */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  className="retro-card"
                  style={{ maxWidth: '600px', margin: '0 auto', border: '3px solid var(--error-red)' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--error-red)', marginBottom: '20px' }}>
                        Execute Yearly Reset
                    </h3>

                    <form onSubmit={handleYearlyReset}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                                Confirmation Code
                            </label>
                            <input type="text" className="retro-input" value={confirmCode} onChange={(e) => setConfirmCode(e.target.value.toUpperCase())} placeholder="Type: RESET_DATA" required style={{
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                letterSpacing: '1px'
                            }}
                            />
                            <div style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '8px' }}>
                                Type <strong style={{ color: 'var(--error-red)' }}> RESET_DATA </strong>
                            </div>
                        </div>

                        <button type="submit" className="retro-btn" style={{
                            width: '100%',
                            background: confirmCode === 'RESET_DATA' ? 'var(--error-red)' : 'var(--text-medium)',
                            opacity: confirmCode === 'RESET_DATA' ? 1 : 0.5,
                            cursor: confirmCode === 'RESET_DATA' ? 'pointer' : 'not-allowed',
                            fontSize: '12px',
                            padding: '15px'
                        }}
                        disabled={confirmCode !== 'RESET_DATA' || resetting}>
                            {resetting ? 'Resetting...' : 'Execute Yearly Reset'}
                        </button>
                    </form>

                    {confirmCode === 'RESET_DATA' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '2px solid var(--error-red)',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: 'var(--error-red)',
                            textAlign: 'center'
                          }}
                          >
                            Code verified! You will be asked to confirm twice.
                          </motion.div>
                    )}
                  </motion.div>

                  <div style={{
                    marginTop: '40px',
                    padding: '20px', 
                    textAlign: 'center',
                    fontSize: '10px',
                    color: 'var(--text-light)',
                    lineHeight: '1.6'
                  }}>
                    <strong>This feature should only be used once per training year.</strong>
                  </div>
        </div>
    );
};

export default YearlyReset;