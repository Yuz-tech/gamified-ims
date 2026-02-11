import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '🏆',
    topicId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [badgesRes, topicsRes] = await Promise.all([
        api.get('/admin/badges'),
        api.get('/admin/topics')
      ]);
      setBadges(badgesRes.data);
      setTopics(topicsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBadge) {
        await api.put(`/admin/badges/${editingBadge._id}`, formData);
        alert('Badge updated successfully');
      } else {
        await api.post('/admin/badges', formData);
        alert('Badge created successfully');
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving badge');
    }
  };

  const handleDelete = async (badgeId) => {
    if (!window.confirm('Are you sure you want to delete this badge?')) return;

    try {
      await api.delete(`/admin/badges/${badgeId}`);
      alert('Badge deleted successfully');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting badge');
    }
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      imageUrl: badge.imageUrl,
      topicId: badge.topicId._id || badge.topicId
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '🏆',
      topicId: ''
    });
    setEditingBadge(null);
    setShowForm(false);
  };

  const emojiOptions = ['🏆', '🏅', '🥇', '🥈', '🥉', '⭐', '🌟', '💎', '👑', '🎖️', '🛡️', '⚡', '🔥', '🌈', '🎯'];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className="loading neon-text">LOADING BADGES...</div>
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
          color: 'var(--neon-yellow)'
        }}
      >
        🏆 BADGE MANAGEMENT
      </motion.h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="retro-btn"
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✖ CANCEL' : '➕ CREATE BADGE'}
      </button>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '40px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--neon-pink)', marginBottom: '20px' }}>
            {editingBadge ? 'EDIT BADGE' : 'CREATE NEW BADGE'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--neon-cyan)' }}>
                NAME
              </label>
              <input
                type="text"
                className="retro-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--neon-cyan)' }}>
                DESCRIPTION
              </label>
              <textarea
                className="retro-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--neon-cyan)' }}>
                BADGE ICON (Emoji)
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {emojiOptions.map((emoji) => (
                  <div
                    key={emoji}
                    onClick={() => setFormData({ ...formData, imageUrl: emoji })}
                    style={{
                      width: '50px',
                      height: '50px',
                      border: `2px solid ${formData.imageUrl === emoji ? 'var(--neon-cyan)' : 'var(--neon-green)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      cursor: 'pointer',
                      background: formData.imageUrl === emoji ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
                      transition: 'all 0.3s'
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="retro-input"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="Or enter custom emoji/URL"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--neon-cyan)' }}>
                LINKED TOPIC
              </label>
              <select
                className="retro-input"
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                required
              >
                <option value="">SELECT TOPIC</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                💾 {editingBadge ? 'UPDATE BADGE' : 'CREATE BADGE'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="retro-btn secondary"
                style={{ flex: 1 }}
              >
                ✖ CANCEL
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Badges Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px'
      }}>
        {badges.map((badge) => (
          <motion.div
            key={badge._id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="retro-card"
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '15px',
              padding: '20px',
              border: '3px solid var(--neon-yellow)',
              background: 'var(--darker-bg)',
              boxShadow: '0 0 20px var(--neon-yellow)'
            }}>
              {badge.imageUrl}
            </div>

            <h4 style={{
              fontSize: '12px',
              color: 'var(--neon-cyan)',
              marginBottom: '10px'
            }}>
              {badge.name}
            </h4>

            <p style={{
              fontSize: '9px',
              color: 'var(--neon-green)',
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              {badge.description}
            </p>

            <div style={{
              padding: '10px',
              background: 'rgba(0, 255, 0, 0.05)',
              border: '1px solid var(--neon-green)',
              marginBottom: '15px',
              fontSize: '9px',
              color: 'var(--neon-pink)'
            }}>
              TOPIC: {badge.topicId?.title || 'N/A'}
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => handleEdit(badge)}
                className="retro-btn secondary"
                style={{ flex: 1, fontSize: '8px', padding: '8px' }}
              >
                ✎ EDIT
              </button>
              <button
                onClick={() => handleDelete(badge._id)}
                className="retro-btn danger"
                style={{ flex: 1, fontSize: '8px', padding: '8px' }}
              >
                ✖ DELETE
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: 'var(--neon-cyan)' }}>
            NO BADGES YET
          </div>
          <div style={{ fontSize: '10px', color: 'var(--neon-green)', marginTop: '10px' }}>
            Create badges to reward topic completion!
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;