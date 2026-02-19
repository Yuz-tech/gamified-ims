import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        userId: '',
        action: '',
        limit: 100
    });

    const actionTypes = [
        'login',
        'logout',
        'logout_all_devices',
        'password_change',
        'video_watched',
        'quiz_started',
        'quiz_completed',
        'badge_earned',
        'topic_completed',
        'profile_updated',
        'account_request',
        'account_approved'
    ];

    useEffect(() => {
        fetchUsers();
        fetchLogs();
    }, []);

    const fetchUsers = async() => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch(error) {
            console.error('Error fetching users: ', error);
        }
    };

    const fetchLogs = async() => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if(filters.userId) params.append('userId', filters.userId);
            if(filters.action) params.append('action', filters.action);
            params.append('limit', filters.limit);

            const response = await api.get(`/admin/activity-logs?${params}`);
            setLogs(response.data);
        } catch(error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]:value });
    };

    const handleApplyFilters = () => {
        fetchLogs();
    };

    const handleClearFilters = () => {
        setFilters({ userId: '', action: '', limit: 100 });
        setTimeout(() => fetchLogs(), 100);
    };

    const handleExportCSV = () => {
        const csvContent = [
            ['Timestamp', 'User', 'Email',
                'Action', 'IP Address', 'Details'
            ],
            ...logs.map(log=> [
                new Date(log.createdAt).toLocaleString(),
                log.userId?.username || 'N/A',
                log.userId?.email || 'N/A',
                log.action,
                log.ipAddress,
                JSON.stringify(log.details || {})
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getActivityIcon = (action) => {
    const icons = {
      login: '🔐',
      logout: '🚪',
      logout_all_devices: '🚪🚪',
      password_change: '🔑',
      video_watched: '📺',
      quiz_started: '📝',
      quiz_completed: '✅',
      badge_earned: '🏆',
      topic_completed: '🎯',
      profile_updated: '👤',
      account_request: '📬',
      account_approved: '✅'
    };
    return icons[action] || '📌';
  };

  const getActivityColor = (action) => {
    const colors = {
        login: 'var(--bright-blue)',
        logout: 'var(--error-red)',
        logout_all_devices: 'var(--error-red)',
        password_change: 'var(--warning-yellow)',
        video_watched: 'var(--light-blue)',
        quiz_completed: 'var(--success-green)',
        badge_earned: 'var(--orange-accent)',
        topic_completed: 'var(--sucess-green)'
    };
    return colors[action] || 'var(--text-medium)';
  };

  return (
    <div style = {{ paddingTop: '0' }}>
        <div className = "scanlines">
            <motion.h1
              initial = {{ y:-50, opacity:0 }}
              animate = {{ y:0, opacity:1 }}
              className = "neon-text"
              style = {{
                fontSize: '28px',
                marginBottom: '40px',
                textAlign: 'center',
                color: 'var(--primary-navy)'
              }}>
                ACTIVITY LOGS
              </motion.h1>

              <motion.div
                initial = {{ opacity: 0, y: -20 }}
                animate = {{ opacity: 1, y: 0 }}
                className = "retro-card"
                style = {{
                    marginBottom: '30px'
                }}>
                    <h3 style = {{
                        fontSize: '14px',
                        color: 'var(--secondary-pink)',
                        marginBottom: '20px'
                    }}>
                        FILTERS
                    </h3>
                    <div style = {{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '10px',
                                fontSize: '10px',
                                color: 'var(--text-medium)'
                            }}>
                                USER
                            </label>
                            <select className = "retro-input" 
                                value={filters.userId}
                                onChange={(e) => handleFilterChange('userId', e.target.value)}>
                                    <option value="">ALL USERS</option>
                                    {users.map((user) => (
                                        <option key = {user._id} value = {user._id}>
                                            {user.username}
                                            ({user.email})
                                        </option>
                                    ))}
                                </select>
                        </div>
                        <div>
                            <label style = {{
                                display: 'block',
                                marginBottom: '10px',
                                fontSize: '10px',
                                color: 'var(--text-medium)'
                            }}>
                                ACTION TYPE
                            </label>
                            <select className = "retro-input" value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)}>
                                <option value = "">ALL ACTIONS</option>
                                {actionTypes.map((action) => (
                                    <option key = {action} value={action}>
                                        {action.replace(/ _/g,' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style = {{
                                display: 'block',
                                marginBottom: '10px',
                                fontSize: '10px',
                                color: 'var(--text-medium)'
                            }}>
                                LIMIT
                            </label>
                            <select className="retro-input" value={filters.limit} onChange={(e) => handleFilterChange('limit', e.target.value)}>
                                <option value="50">50 RECORDS</option>
                                <option value="100">100 RECORDS</option>
                                <option value="200">200 RECORDS</option>
                                <option value="500">500 RECORDS</option>
                                <option value="1000">1000 RECORDS</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick = {handleApplyFilters}
                                className="retro-btn"
                                style={{ flex: 1, minWidth: '150px' }}>
                                    APPLY FILTERS
                                </button>
                                <button onClick={handleClearFilters}
                                        className="retro-btn secondary"
                                        style={{ flex: 1, minWidth: '150px' }}>
                                            CLEAR
                                        </button>
                                        <button onClick={handleExportCSV}
                                                className="retro-btn"
                                                style={{
                                                    background: 'var(--success-green)',
                                                    borderColor: '#059669',
                                                    flex: 1,
                                                    minWidth: '150px'
                                                }}
                                                disabled={logs.length === 0}>
                                                    EXPORT CSV
                                                </button>
                    </div>
                </motion.div>

                {/* LOGS */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="retro-card">
                        <h3 style={{
                            fontSize: '14px',
                            color: 'var(--secondary-pink)',
                            marginBottom: '20px'
                        }}>
                            ACTIVITY RECORDS
                            ({logs.length})
                        </h3>

                        {loading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: 'var(--bright-blue)',
                                fontSize: '14px'
                            }}>
                                <div className="loading">
                                    LOADING LOGS...
                                </div>
                            </div>
                        ) : logs.length > 0 ? (
                            <div className="table-container">
                                <table style={{
                                    width: '100%',
                                    fontSize: '10px'
                                }}>
                                    <thead>
                                        <tr style={{
                                            borderBottom: '2px solid var(--primary-navy)'
                                        }}>
                                            <th style={{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}></th>
                                            <th style={{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}>ACTION</th>
                                            <th style={{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}>USER</th>
                                            <th style={{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}>IP ADDRESS</th>
                                            <th style={{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}>TIMESTAMP</th>
                                            <th style = {{
                                                padding: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                background: 'var(--primary-navy)'
                                            }}>DETAILS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log,index) => (
                                            <motion.tr
                                                key={log._id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1}}
                                                transition={{ delay: index*0.02}}
                                                style={{
                                                    borderBottom: '1px solid var(--border-color)'
                                                }}>
                                                    <td style={{
                                                        padding: '10px',
                                                        fontSize: '16px'
                                                    }}>
                                                        {getActivityIcon(log.action)}
                                                    </td>
                                                    <td style={{
                                                        padding: '10px',
                                                        color: getActivityColor(log.action),
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {log.action.replace(/ _/g,' ').toUpperCase()}
                                                    </td>
                                                    <td style={{
                                                        padding: '10px',
                                                        color: 'var(--bright-blue)'
                                                    }}>
                                                        {log.userId?.username || 'N/A'}
                                                        <br />
                                                        <span style={{
                                                            fontSize: '8px',
                                                            color: 'var(--text-light)'
                                                        }}>
                                                            {log.userId?.email || ''}
                                                        </span>
                                                    </td>
                                                    <td style = {{
                                                        padding: '10px',
                                                        color: 'var(--text-medium)'
                                                    }}>
                                                        {log.ipAddress}
                                                    </td>
                                                    <td style={{
                                                        padding: '10px',
                                                        color: 'var(--text-dark)'
                                                    }}>
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                    <td style={{
                                                        padding: '10px',
                                                        color: 'var(--text-light)',
                                                        fontSize: '8px'
                                                    }}>
                                                        {log.details && Object.keys(log.details).length > 0 ? JSON.stringify(log.details, null, 0).substring(0,100) : '-'}
                                                    </td>
                                                </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: 'var(--text-light)',
                                fontSize: '12px'
                            }}>
                                NO LOGS FOUND
                                <br />
                                <span style={{
                                    fontSize: '10px',
                                    color: 'var(--text-lighter)',
                                    marginTop: '10px'
                                }}>
                                    Try adjusting your filters
                                </span>
                            </div>
                        )}
                    </motion.div>
        </div>
    </div>
  );
};

export default ActivityLogs;