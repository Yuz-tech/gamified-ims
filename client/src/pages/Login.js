import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/retro.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, requestAccount } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        navigate('/');
      } else {
        await requestAccount(formData.username, formData.email);
        setSuccess('Account request submitted! Wait for admin approval.');
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="scanlines"></div>
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <div>
          <h1 className="neon-text2"
            style = {{
            textAlign:'center',
            marginBottom: '0px'
          }}>
            IMS AWARENESS TRAINING
          </h1>
          <br />
          <p style = {{
            textAlign:'center',
            marginBottom: '26px'
          }}>Advanced World Solutions, Inc.</p>
        </div>

        <div className="retro-card pixel-corners">
          <h1 
            className="neon-text" 
            style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              fontSize: '24px',
              color: 'var(--orange-accent)'
            }}
          >
            {isLogin ? 'はじめ' : 'はいる'}
          </h1>

          {error && (
            <motion.div
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              style={{
                padding: '15px',
                marginBottom: '20px',
                border: '2px solid var(--error-red)',
                color: 'var(--error-red)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                fontSize: '10px'
              }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              style={{
                padding: '15px',
                marginBottom: '20px',
                border: '2px solid var(--bright-blue)',
                color: 'var(--bright-blue)',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                fontSize: '10px'
              }}
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '12px',
                color: 'var(--light-blue)'
              }}>
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="retro-input"
                placeholder="username"
                autoComplete='off'
                required
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontSize: '12px',
                  color: 'var(--light-blue)'
                }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="retro-input"
                  placeholder="use company email"
                  autoComplete='off'
                  required
                />
              </div>
            )}

            {isLogin && (
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontSize: '12px',
                  color: 'var(--light-blue)'
                }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="retro-input"
                  placeholder="******"
                  required
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="retro-btn"
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? 'LOADING...' : (isLogin ? 'LOG IN' : 'SUBMIT REQUEST')}
            </motion.button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="retro-btn secondary"
                style={{ fontSize: '10px', color: 'black' }}
              >
                {isLogin ? 'REQUEST NEW ACCOUNT' : 'BACK TO LOGIN'}
              </button>
            </div>
          </form>

          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            fontSize: '8px',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            v1.0 by Julius Galejo and Jose Dante Chan
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;