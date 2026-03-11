import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email
            });

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="auth-card"
                >
                    <div style = {{ textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '20px',
                            color: 'var(--success-green)'
                        }}>
                            Registration Successful!
                        </h2>
                        <p style = {{ fontSize: '12px', color: 'var(--text-medium)' }}>
                            Your account is now pending admin approval.
                            <br />
                            You will be redirected to login...
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="auth-card"
            >
                <h1 className="neon-text"
                  style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Request an Account
                </h1>

                <form onSubmit = {handleSubmit}>
                    <div style = {{ marginBottom: '20px' }}>
                        <label style = {{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '10px'
                        }}>
                            USERNAME
                        </label>
                        <input 
                          type="text"
                          className="retro-input"
                          value={formData.username}
                          onChange={(e) => setFormData({
                            ...formData, username: e.target.value
                          })}
                          required
                          autoFocus
                        />
                    </div>

                    <div style = {{ marginBottom: '20px' }}>
                        <label style = {{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '10px'
                        }}>
                            PASSWORD
                        </label>
                        <input type="password" className="retro-input" value={formData.password} onChange = {(e) =>
                            setFormData({
                                ...formData, password: e.target.value
                            })
                        }
                        required
                        />
                    </div>

                    <div style = {{ marginBottom: '20px' }}>
                        <label style = {{ 
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '10px'
                        }}>
                            Confirm Password
                        </label>
                        <input type="password"
                          className="retro-input"
                          value={formData.confirmPassword} onChange={(e) =>
                            setFormData({ 
                                ...formData, confirmPassword: e.target.value
                            })}
                          required
                        />
                    </div>

                    {error && (
                        <div style = {{
                            padding: '10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '2px solid var(--error-red)',
                            marginBottom: '20px',
                            fontSize: '10px',
                            color: 'var(--error-red)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type = "submit" className="retro-btn" style={{
                        width: '100%',
                        marginBottom: '20px'
                    }}>
                        Request Account
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '10px' }}>
                        Already have an account?{''}
                        <Link to="/login" style={{ color: 'var(--bright-blue)' }}>
                            Login here
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;