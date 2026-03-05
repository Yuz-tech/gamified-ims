import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [userRes, sessionRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/auth/sessions')
            ]);

            setAvatarPreview(userRes.data.avatar);
            setSessions(sessionRes.data);
        } catch(error) {
            console.error('Error fetching profile: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert ('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        setUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const uploadRes = await api.post('/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data'}
            });

            // Update user avatar
            await api.put('/auth/update-profile', { avatar: uploadRes.data.url });

            setAvatarPreview(uploadRes.data.url);
                checkAuth();
                alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Upload error: ', error);
            alert('Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 3) {
            alert('Password must be at least 3 characters');
            return;
        }

        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            alert('Password changed successfully!');
            setShowPasswordChange(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert (error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleLogoutSession = async(sessionId) => {
        if (!window.confirm('Are you sure you want to logout?')) return;
        try {
            await api.delete(`/auth/sessions/${sessionId}`);
            fetchProfileData();
        } catch(error) {
            alert('Failed to logout session');
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm('Are you sure you want to logout all other sessions? ')) return;
        try {
            await api.post('/auth/logout-all');
            fetchProfileData();
            alert('All other sessions logged out successfully');
        } catch (error) {
            alert('Failed to logout sessions');
        }
    };

    if (loading) {
        return (
            <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    const avatarUrl = avatarPreview?.startsWith('/uploads/')
    ? `http://localhost:5000${avatarPreview}`
    : avatarPreview;

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <div className="scanlines"></div>

            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="neon-text"
              style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}>
                My Profile
              </motion.h1>

            <div style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        Profile Information
                    </h3>

                    <div style = {{ textAlign: 'center', marginBottom: '20px' }}>
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
                            justifyContent: 'center'
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style ="font-size: 48px;">👤</div>';
                                  }}
                                />
                            ) : (
                                <div style = {{ fontSize: '48px' }}>👤</div>
                            )}
                        </div>

                        <input type = "file" accept="image/*" onChange={handleAvatarUpload} 
                          style={{ display: 'none' }}
                          id="avatar-upload"
                          disabled={uploadingAvatar}
                        />
                        <label htmlFor="avatar-upload" className="retro-btn secondary" style={{ cursor: 'pointer', fontSize: '10px' }}>
                            {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                        </label>
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <div style = {{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>Username</div>
                        <div style = {{ fontSize: '12px', color: 'var(--text-dark)', fontWeight: 'bold' }}>{user?.username}</div>
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <div style = {{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>Email</div>
                        <div style = {{ fontSize: '12px', color: 'var(--text-dark)' }}>{user?.email}</div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '5px' }}>Role</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>{user?.role}</div>
                    </div>

                    <div style = {{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                        <div style = {{ padding: '10px', border: '2px solid var(--bright-blue)', textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                                LEVEL
                            </div>
                            <div style = {{ fontSize: '18px', color: 'var(--bright-blue)', marginTop: '5px' }}>
                                {user?.level || 1}
                            </div>
                        </div>
                        <div style = {{ padding: '10px', border: '2px solid var(--orange-accent)', textAlign: 'center' }}>
                            <div style = {{ fontSize: '9px', color: 'var(--text-medium)' }}>
                                XP
                            </div>
                            <div style = {{ fontSize: '18px', color: 'var(--orange-accent)', marginTop: '5px' }}>
                                {user?.xp || 0}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="retro-card"
                >
                    <h3 style = {{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        SECURITY
                    </h3>

                    {!showPasswordChange ? (
                        <button onClick={() => setShowPasswordChange(true)}
                          className="retro-btn"
                          style={{width: '100%', marginBottom: '20px'}}>
                          CHANGE PASSWORD
                          </button>
                    ) : (
                        <form onSubmit={handlePasswordChange} style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                    Current Password
                                </label>
                                <input type = "password" className="retro-input"
                                  value={passwordData.currentPassword} onChange={(e) => setPasswordData({
                                    ...passwordData, currentPassword: e.target.value
                                  })}
                                  required
                                />
                            </div>

                            <div style = {{ marginBottom: '15px' }}>
                                <label style = {{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                    New Password
                                </label>
                                <input type="password" className = "retro-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({
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
                                    SAVE
                                </button>
                                <button type = "button" onClick={() => {
                                    setShowPasswordChange(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                 className="retro-btn secondary"
                                 style={{ flex: 1 }}
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    )}

                    <h4 style = {{ fontSize: '12px', color: 'var(--primary-navy)', marginBottom: '15px' }}>
                        Active Sessions ({sessions.length})
                    </h4>

                    <div style = {{ maxHeight: '300px', overflowY: 'auto' }}>
                        {sessions.map((session, index) => (
                            <div key = {session._id} style={{
                                padding: '10px',
                                border: '2px solid var(--border-color)',
                                marginBottom: '10px',
                                background: 'var(--bg-light)'
                            }}>
                                <div style = {{ fontSize: '10px', color: 'var(--text-dark)', marginBottom: '5px' }}>
                                    {session.deviceInfo?.deviceType || 'Unknown'} • {session.deviceInfo?.browser || 'Unknown' }
                                </div>
                                <div style = {{ fontSize: '8px', color: 'var(--text-light)', marginBottom: '8px' }}>
                                    {new Date(session.lastActivity).toLocaleString()}
                                </div>
                                {index !== 0 && (
                                    <button onClick={() => handleLogoutSession(session._id)} 
                                      className="retro-btn secondary"
                                      style={{ fontSize: '8px', padding: '5px 10px' }}>
                                        LOGOUT
                                      </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {sessions.length > 1 && (
                        <button onClick = {handleLogoutAll} className="retro-btn" style={{ width: '100%', marginTop: '15px', background: 'var(--error-red)' }}>
                            LOGOUT all other sessions
                        </button>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;