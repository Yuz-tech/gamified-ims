import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const [session, setSessions] = useState([]);
const [sessionsLoading, setSessionsLoading] = useState(false);

useEffect(() => {
    fetchSessions();
}, []);

const fetchSessions = async() => {
    try {
        setSessionsLoading(true);
        const response = await api.get('/auth/sessions');
        setSessions(response.data);
    } catch(error) {
        console.error('Error fetching sessions:', error);
    } finally {
        setSessionsLoading(false);
    }
};

const handleRevokeSession = async(sessionId) => {
    if(!window.confirm('Are you sure you want to log out this device?')) return;
    try {
        await api.delete(`/auth/sessions/${sessionId}`);
        alert('Session revoked successfully');
        fetchSessions();
    } catch(error) {
        alert(error.response?.data?.message || 'Error revoking session');
    }
};

const handleLogoutAllDevices = async () => {
    if (!window.confirm('This will log you out from ALL devices. Continue?')) return;
    try {
        await api.post('/auth/logout-all');
        alert('Logged out from all devices');
        window.location.href = '/login';
    } catch(error) {
        alert(error.response?.data?.message || 'Error logging out');
    }
};

{/* Active Sessions */}
<motion.div
   initial={{ opacity: 0, y:20 }}
   animate={{ opacity: 1, y:0 }}
   transition={{ delay: 0.2 }}
   className="retro-card"
   style={{ marginBottom: '30px' }}
   >
    <div style = {{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
    }}>
        <h3 style={{
            fontSize: '14px',
            color: 'var(--secondary-pink)'
        }}>
            ACTIVE SESSIONS
        </h3>
        {sessions.length > 1 && (
            <button onClick={handleLogoutAllDevices} 
            className="retro-btn danger" 
            style={{ 
                fontSize: '9px',
                padding: '8px 15px'
            }}>LOGOUT ALL DEVICES</button>
        )}
    </div>
    
    {sessionsLoading ? (
        <div style={{
            textAlign: 'center',
            padding: '20px'
        }}>
            <div className = "loading">
                LOADING SESSIONS...
            </div>
        </div>
    ) : sessions.length > 0 ? (
        <div style={{ display: 'grid', gap: '15px' }}>
            {sessions.map((session) => (
                <motion.div 
                  key={session._id}
                  initial={{ x: -20, opacity: 0}}
                  animate={{ x: 0, opacity: 1}}
                  style = {{
                    padding: '15px',
                    border: `3px solid ${session.isCurrent ? 'var(--bright-blue)' : 'var(--border-color'}`,
                    background: session.isCurrent ? 'rgba(59,130,246,0.05)' : 'var(--bg-lightest)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    boxShadow: session.isCurrent ? '3px 3px 0 var(--bright-blue)' : 'none'
                  }}
                  >
                    <div style = {{ flex: 1, minWidth: '200px' }}>
                        <div style = {{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px'
                        }} >
                            <div style = {{
                                fontSize: '24px'
                            }}>
                                {session.deviceType === 'mobile'}
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--primary-navy)',
                                    fontWeight: 'bold'
                                }}>
                                    {session.browser} on {session.os}
                                    {session.isCurrent && (
                                        <span style = {{
                                            marginLeft: '10px',
                                            padding: '2px 8px',
                                            background: 'var(--bright-blue)',
                                            color: 'white',
                                            fontSize: '8px',
                                            borderRadius: '2px'
                                        }}>
                                            CURRENT
                                        </span>
                                    )}
                                </div>
                                <div style={{
                                    fontSize: '9px',
                                    color: 'var(--text-light)',
                                    marginTop: '5px'
                                }}>
                                    IP:
                                </div>
                            </div>
                        </div>
                        <div style = {{
                            fontSize: '9px',
                            color: 'var(--text-medium)'
                        }}>
                            Last active: {new Date(session.lastActivity).toLocaleString()}
                        </div>
                        <div style={{
                            fontSize: '9px',
                            color: 'var(--text-light)'
                        }}>
                            Logged in: {new Date(session.createdAt).toLocaleString()}
                        </div>
                    </div>

                    {!session.isCurrent && (
                        <button onClick={() => handleRevokeSession(session._id)}
                         className="retro-btn danger"
                         style={{
                            fontSize: '9px',
                            padding: '8px 15px'
                         }}>
                            REVOKE
                         </button>
                    )}
                  </motion.div>
            ))}
        </div>
    ): (
        <div style = {{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-light)',
            fontSize: '12px'
        }}>
            No Active Sessions
        </div>
    )}
   </motion.div>