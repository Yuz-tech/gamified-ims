import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('badge', file);

      const response = await api.post('/upload/badge', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.url;
      setFormData({ ...formData, imageUrl: imageUrl });
      setImagePreview(`http://localhost:5000${imageUrl}`);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      alert('Please upload a badge image');
      return;
    }

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
    
    // Set preview if it's a server path
    if (badge.imageUrl.startsWith('/uploads/')) {
      setImagePreview(`http://localhost:5000${badge.imageUrl}`);
    } else {
      setImagePreview(badge.imageUrl);
    }
    
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      topicId: ''
    });
    setEditingBadge(null);
    setShowForm(false);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        BADGE MANAGEMENT
      </motion.h1>

      <button onClick={() => setShowForm(!showForm)} className="retro-btn" style={{ marginBottom: '30px' }}>
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
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            {editingBadge ? 'EDIT BADGE' : 'CREATE NEW BADGE'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
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
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
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
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
                BADGE IMAGE (PNG)
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div style={{
                  marginBottom: '15px',
                  padding: '20px',
                  border: '3px solid var(--orange-accent)',
                  background: 'var(--bg-lightest)',
                  textAlign: 'center',
                  boxShadow: '3px 3px 0 var(--primary-navy)'
                }}>
                  <img 
                    src={imagePreview} 
                    alt="Badge preview" 
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'contain',
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
              )}

              {/* Upload Button */}
              <input
                type="file"
                id="badge-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="badge-upload">
                <div
                  className="retro-btn"
                  style={{
                    display: 'inline-block',
                    cursor: 'pointer',
                    opacity: uploading ? 0.5 : 1
                  }}
                >
                  {uploading ? '⏳ UPLOADING...' : '📁 UPLOAD IMAGE'}
                </div>
              </label>

              <div style={{
                marginTop: '10px',
                padding: '10px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--bright-blue)',
                fontSize: '8px',
                color: 'var(--text-medium)'
              }}>
                ℹ️ Recommended: 256x256px or 512x512px PNG with transparent background. Max 5MB.
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
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

            <div style={{ marginBottom:'20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                YEAR
              </label>
              <input 
                type="number"
                className="retro-input"
                value={formData.year}
                onChange={(e) => setFormData({
                  ...formData, year:parseInt(e.target.value)
                })}
                min="2026"
                max="2099"
                required
                />
                <div style = {{
                  marginTop: '5px',
                  fontSize: '8px',
                  color: 'var(--text-light)'
                }}>
                  Set the training year for this badge (e.g., 2027, 2028, 2029)
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                className="retro-btn" 
                style={{ flex: 1 }}
                disabled={uploading || !formData.imageUrl}
              >
                💾 {editingBadge ? 'UPDATE BADGE' : 'CREATE BADGE'}
              </button>
              <button type="button" onClick={resetForm} className="retro-btn secondary" style={{ flex: 1 }}>
                ✖ CANCEL
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
        {badges.map((badge) => {
          const imageUrl = badge.imageUrl.startsWith('/uploads/') 
            ? `http://localhost:5000${badge.imageUrl}` 
            : badge.imageUrl;
          
          return (
            <motion.div
              key={badge._id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="retro-card"
              style={{ textAlign: 'center' }}
            >
              <div style={{
                padding: '20px',
                border: '3px solid var(--orange-accent)',
                background: 'var(--bg-lightest)',
                boxShadow: '3px 3px 0 var(--primary-navy)',
                marginBottom: '15px',
                minHeight: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={imageUrl} 
                  alt={badge.name}
                  style={{
                    maxWidth: '100px',
                    maxHeight: '100px',
                    objectFit: 'contain',
                    imageRendering: 'pixelated'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="font-size: 48px;">🏆</div>';
                  }}
                />
              </div>

              <h4 style={{ fontSize: '12px', color: 'var(--primary-navy)', marginBottom: '10px' }}>
                {badge.name}
              </h4>

              <p style={{ fontSize: '9px', color: 'var(--text-medium)', marginBottom: '15px', lineHeight: '1.5' }}>
                {badge.description}
              </p>

              <div style={{
                padding: '10px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid var(--success-green)',
                marginBottom: '15px',
                fontSize: '9px',
                color: 'var(--text-dark)'
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
          );
        })}
      </div>

      {badges.length === 0 && (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: 'var(--bright-blue)' }}>NO BADGES YET</div>
          <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '10px' }}>
            Create badges to reward topic completion!
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;