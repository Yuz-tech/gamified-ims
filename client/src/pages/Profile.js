import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Icon from "../components/Icon";

const Profile = () => {
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const avatarOptions = [
        '/avatars/bumblebee.png',
        '/avatars/optimum pride.png',
        '/avatars/luffy.jpg',
        '/avatars/goku.jpg',
        '/avatars/pikachu.png',
        '/avatars/baymax.png',
        '/avatars/charm.jpg',
        '/avatars/bulb.jpg',
        '/avatars/squirtle.png',
        '/avatars/jake.png',
        '/avatars/yoshi.png',
        '/avatars/stitch.png'
    ];

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async() => {
        try {
            const [userRes, sessionsRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/auth/sessions')
            ]);

            setSelectedAvatar(userRes.data.avatar);
            setSessions(sessionsRes.data);
        } catch (error) {
            console.error('Error fetching profile: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAvatar = async (avatarUrl) => {
        try {
            await api.put('/auth/update-profile', { avatar: avatarUrl });
            setSelectedAvatar(avatarUrl);
            setShowAvatarSelector(false);
            checkAuth();
            alert('Avatar Updated!');
        } catch (error) {
            alert('Failed to update avatar');
        } 
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if(passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 3) {
            alert('Password must at least be 3 characters');
            return;
        }

        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            alert('Password changed successfully!');
            setShowPasswordChange(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: ''});
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleLogoutSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to logout this session?')) return;

        try {
            await api.delete(`/auth/sessions/${sessionId}`);
            fetchProfileData();
        } catch (error) {
            alert('Failed to logout session');
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm('Are you sure you want to logout all other sessions?')) return;

        try {
            await api.post('/auth/logout-all');
            fetchProfileData();
            alert('All other sessions logged out successfully');
        } catch (error) {
            alert ('Failed to logout sessions');
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
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    const avatarUrl = selectedAvatar?.startsWith('/uploads/')
      ? `http://localhost:5000${selectedAvatar}`
      : selectedAvatar;

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
                color: 'var(--primary-navy)'
              }}>
                <Icon name = "account_circle" size = {32} />
                My Profile
              </motion.h1>

              <div style = {{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px'
              }}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        Profile Information
                    </h3>

                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style = {{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 15px',
                            border: '3px solid var(--bright-blue)',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: 'var(--bg-medium)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onClick={() => setShowAvatarSelector(true)}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span class = "material-symbols-outlined" style="font-size: 48px;">person</span>';
                                }}
                                />
                            ) : (
                                <Icon name = "person" size={48} />
                            )}
                            <div style = {{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '5px',
                                fontSize: '8px'
                            }}>
                                Click to Change
                            </div>
                        </div>
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <div style = {{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                            <Icon name = "person" size={14} />
                        </div>
                        <div style = {{ fontSize: '12px', color: 'var(--text-dark)', fontWeight: 'bold' }}>
                            {user?.username}
                        </div>
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <div style = {{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                            <Icon name="email" size = {14} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>
                            {user?.email}
                        </div>

                        <div style = {{ marginBottom: '15px', paddingTop: '15px' }}>
                            <div style = {{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>
                                <Icon name = "admin_panel_settings" size={14} />
                            </div>
                            <div style = {{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>
                                {user?.role}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                            <div style={{ padding: '10px', border: '2px solid var(--bright-blue)', textAlign: 'center' }}>
                                <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                                    Level
                                </div>
                                <div style = {{ fontSize: '18px', paddingBottom: '10px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                                    {user?.level || 1}
                                </div>
                                <div style={{ padding: '10px', border: '2px solid var(--orange-accent)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
                                        {user?.xp || 0} XP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        <Icon name="lock" size={18} />
                        Security
                    </h3>

                    {!showPasswordChange ? (
                        <button onClick={() => setShowPasswordChange(true)} className="retro-btn" style={{ width: '100%', marginBottom: '20px' }}>
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handlePasswordChange} style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                    Current Password
                                </label>
                                <input type = "password" className="retro-input" value={passwordData.currentPassword} onChange={(e) => setPasswordData({
                                    ...passwordData, currentPassword: e.target.value
                                })}
                                required />
                            </div>

                            <div style = {{ marginBottom: '15px' }}>
                                <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                    New Password
                                </label>
                                <input type = "password" className="retro-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({
                                    ...passwordData, newPassword: e.target.value
                                })}
                                required
                                minLength="3"
                                />
                            </div>

                            <div style = {{ marginBottom: '15px' }}>
                                <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                    Confirm New Password
                                </label>
                                <input type = "password" className="retro-input" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({
                                    ...passwordData, confirmPassword: e.target.value 
                                })} 
                                required
                                minLength="3"
                                />
                            </div>

                            <div style = {{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                                    Save
                                </button>
                                <button type="button" onClick={() => {
                                    setShowPasswordChange(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="retro-btn secondary"
                                style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <h4 style = {{ fontSize: '12px', color: 'var(--primary-navy)', marginBottom: '15px' }}>
                        Active Sessions ({sessions.length})
                    </h4>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {sessions.map((session, index) => (
                            <div key = {session._id} style={{
                                padding: '10px',
                                border: '2px solid var(--border-color)',
                                marginBottom: '10px',
                                background: 'var(--bg-light)'
                            }}
                            >
                                <div style = {{ fontSize: '10px', color: 'var(--text-dark)', marginBottom: '5px' }}>
                                    <Icon name = {session.deviceInfo?.deviceType === 'mobile' ? 'smartphone' : 'computer'} size={14} />
                                    {' '}
                                    {session.deviceInfo?.deviceType || 'Unknown'} • {session.deviceInfo?.browser || 'Unknown'}
                                </div>
                                <div style={{ fontSize: '8px', color: 'var(--text-light)', marginBottom: '8px' }}>
                                    <Icon name = "schedule" size={12} />
                                    {new Date(session.lastActivity).toLocaleString()}
                                </div>
                                {index !== 0 && (
                                    <button onClick={() => handleLogoutSession(session._id)} className="retro-btn secondary" style={{ fontSize: '8px', padding: '5px 10px' }}>
                                        <Icon name = "logout" size={12} />
                                        Logout
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {sessions.length > 1 && (
                        <button onClick={handleLogoutAll} className="retro-btn" style={{ width: '100%', marginTop: '15px', background: 'var(--error-red)' }}>
                            <Icon name = "logout" size={18} />
                            Logout all other sessions
                        </button>
                    )}
                </motion.div>
              </div>

              {/* Avatar Selector Modal */}
              <AnimatePresence>
                {showAvatarSelector && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                      }}
                      onClick={() => setShowAvatarSelector(false)}
                    >
                        <motion.div
                          initial={{ scale: 0.8, y: 50 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.8, y: 50 }}
                          className="retro-card"
                          style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                                <Icon name="face" size={18} />
                                Choose your avatar
                            </h3>

                            <div style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                {avatarOptions.map((avatar, index) => (
                                    <div key={index} onClick={() => handleSelectAvatar(avatar)}
                                      style={{
                                        width: '100px',
                                        height: '100px',
                                        border: selectedAvatar === avatar ? '3px solid var(--bright-blue)' : '2px solid var(--border-color)',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        background: 'var(--bg-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      className="avatar-option"
                                      >
                                        <img src={avatar} alt={`Avatar ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<span class="material-symbols-outlined" style="font-size: 48px;">person</span>`;
                                        }}
                                        />
                                      </div>
                                ))}
                            </div>

                            <button onClick={() => setShowAvatarSelector(false)} className="retro-btn secondary" style={{ width: '100%' }}>
                                <Icon name="close" size={18} />
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
              </AnimatePresence>

              <style>{`
                .avatar-option:hover{
                    transform: scale(1.1);
                    border-color: var(--bright-blue) !important;
                }
              `}</style>
        </div>
    );
};

export default Profile;