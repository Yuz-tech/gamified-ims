import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Auto-login after successful registration
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retro-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="scanlines"></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="retro-card"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <h1 className="neon-text" style={{ 
          fontSize: '32px', 
          textAlign: 'center', 
          marginBottom: '30px',
          color: 'var(--primary-navy)'
        }}>
          🎮 CREATE ACCOUNT
        </h1>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '15px',
              marginBottom: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid var(--error-red)',
              color: 'var(--error-red)',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '11px',
              color: 'var(--text-medium)'
            }}>
              USERNAME *
            </label>
            <input
              type="text"
              name="username"
              className="retro-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '11px',
              color: 'var(--text-medium)'
            }}>
              EMAIL *
            </label>
            <input
              type="email"
              name="email"
              className="retro-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '11px',
              color: 'var(--text-medium)'
            }}>
              PASSWORD *
            </label>
            <input
              type="password"
              name="password"
              className="retro-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '11px',
              color: 'var(--text-medium)'
            }}>
              CONFIRM PASSWORD *
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="retro-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="retro-btn"
            style={{ width: '100%', fontSize: '14px', padding: '15px' }}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : '🚀 CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-medium)'
        }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bright-blue)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          >
            LOGIN HERE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;