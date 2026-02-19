import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";

const YearlyReset = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newYear, setNewYear] = useState(new Date().getFullYear() + 1);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async() => {
        try {
            const response = await api.get('/admin/training-year');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetYear = async () => {
        const confirmed = window.confirm(
            `WARNING: This will: \n\n` + 
            `1. Archive ${stats?.totalUsers || 0} users' current progress \n` +
            `2. Reset all topic completions \n` +
            `3. Reset all video watch status \n` +
            `4. Clear current year badges \n` +
            `5. Users will keep their XP and levels \n\n` +
            `Are you sure you want to reset to year ${newYear}?` 
        );

        if(!confirmed) return;

        const doubleConfirm = window.confirm(
            `FINAL CONFIRMATION\n\nType "RESET" in the next prompt to proceed.`
        );

        if (!doubleConfirm) return;

        const typed = prompt('Type "RESET" to confirm:');
        if(typed !== 'RESET') {
            alert('Reset cancelled');
            return;
        }

        setResetting(true);

        try {
            const response = await api.post('/admin/reset-training-year', { newYear });
            alert(`${response.data.message}\n\nArchived: ${response.data.archivedUsers} users`);
            fetchStats();
        } catch(error) {
            alert(error.response?.data?.message || 'Error resetting year');
        } finally {
            setResetting(false);
        }
    };

    if(loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <div className="loading neon-text">LOADING...</div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '0' }}>
            <motion.h1
              initial={{ y:-50, opacity: 0 }}
              animate={{ y:0, opacity: 1 }}
              className="neon-text"
              style={{
                fontSize: '28px',
                marginBottom: '40px',
                textAlign: 'center',
                color: 'var(--primary-navy)'
              }}>
                YEARLY RESET
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        color: 'var(--secondary-pink)',
                        marginBottom: '20px'
                    }}>
                        CURRENT TRAINING YEAR: {stats?.currentYear}
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                    }}>
                        <div style={{
                            padding: '20px',
                            border: '3px solid var(--bright-blue)',
                            textAlign: 'center',
                            boxShadow: '3px 3px 0 var(--primary-navy)'
                        }}>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--text-medium)',
                                marginBottom: '10px'
                            }}>
                                TOTAL USERS
                            </div>
                            <div style = {{
                                fontSize: '36px',
                                color: 'var(--bright-blue)'
                            }}>
                                {stats?.totalUsers || 0}
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            border: '3px solid var(--success-green)',
                            textAlign: 'center',
                            boxShadow: '3px 3px 0 var(--primary-navy)'
                        }}>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--text-medium)',
                                marginBottom: '10px'
                            }}>
                                COMPLETED TRAINING
                            </div>
                            <div style={{
                                fontSize: '36px',
                                color: 'var(--success-green)'
                            }}>
                                {stats?.usersCompleted || 0}
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            border: '3px solid var(--orange-accent)',
                            textAlign: 'center',
                            boxShadow: '3px 3px 0 var(--primary-navy)'
                        }}>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--text-medium)',
                                marginBottom: '10px'
                            }}>
                                COMPLETION RATE
                            </div>
                            <div style = {{
                                fontSize: '36px',
                                color: 'var(--orange-accent)'
                            }}>
                                {stats?.completionRate || 0}%
                            </div>
                        </div>

                        <div style = {{
                            padding: '20px',
                            border: '3px solid var(--light-blue)',
                            textAlign: 'center',
                            boxShadow: '3px 3px 0 var(--primary-navy)'
                        }}>
                            <div style = {{
                                fontSize: '10px',
                                color: 'var(--text-medium)',
                                marginBottom: '10px'
                            }}>
                                ACTIVE BADGES
                            </div>
                            <div style = {{
                                fontSize: '36px',
                                color: 'var(--light-blue)'
                            }}>
                                {stats?.totalBadges || 0}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: 0.1 }}
                  className="retro-card"
                  style = {{
                    border: '3px solid var(--error-red)',
                    background: 'rgba(239, 68, 68, 0.05)'
                  }}>
                    <h3 style = {{
                        fontSize: '14px',
                        color: 'var(--error-red)',
                        marginBottom: '20px'
                    }}>RESET TRAINING YEAR</h3>

                    <div style = {{
                        padding: '20px',
                        background: 'var(--bg-lightest)',
                        border: '2px solid var(--border-color)',
                        marginBottom: '20px'
                    }}>
                        <p style = {{
                            fontSize: '10px',
                            lineHeight: '1.8',
                            marginBottom: '15px'
                        }}>
                            <strong>What happens when you reset:</strong>
                        </p>
                        <ul style = {{
                            fontSize: '9px',
                            lineHeight: '2',
                            paddingLeft: '20px'
                        }}>
                            <li>Current Year data is archived for all users</li>
                            <li>Topic completion is reset</li>
                            <li>Video watch status is reset</li>
                            <li>Current year badges are cleared</li>
                            <li>Users can retake all quizzes</li>
                            <li>Activity logs and data is maintained</li>
                        </ul>
                    </div>

                    <div style = {{ marginBottom: '20px' }}>
                        <label style = {{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '10px',
                            color: 'var(--text-medium)'
                        }}>
                            NEW TRAININ YEAR
                        </label>
                        <input 
                          type = "number"
                          className="retro-input"
                          value={newYear}
                          onChange={(e) => setNewYear(parseInt(e.target.value))}
                          min={stats?.currentYear + 1}
                          max="2099"
                          />
                    </div>

                    <button 
                      onClick={handleResetYear}
                      className = "retro-btn danger"
                      style = {{
                        width: '100%',
                        padding: '15px'
                      }}
                      disabled={resetting || newYear <= stats?.currentYear } >
                        {resetting ? 'RESETTING...' : `RESET TO YEAR ${newYear}`}
                      </button>

                      <div style = {{
                        marginTop: '15px',
                        padding: '10px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '2px solid var(--error-red)',
                        fontSize: '9px',
                        color: 'var(--error-red)',
                        textAlign: 'center'
                      }}>
                        NOTE: This action cannot be undone!
                      </div>
                  </motion.div>
        </div>
    );
};

export default YearlyReset;