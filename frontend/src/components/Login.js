import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = ({ setAuth, setUserData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const res = await axios.post('/api/auth/login', formData);
            
            localStorage.setItem('token', res.data.token);
            setAuth(true);
            setUserData(res.data.user);
            navigate('/home');
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors.map(error => error.msg));
            } else {
                setErrors(['Login failed. Please try again.']);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="retro-login-box">
                <div className="retro-header">
                    <h1 className="retro-title">IMS AWARENESS TRAINING</h1>
                    <p className="retro-subtitle">from Advanced World Solutions, Inc.</p>
                </div>
                
                <form onSubmit={onSubmit} className="retro-form">
                    <div className="form-group">
                        <label className="retro-label">Username</label>
                        <input
                            type="text"
                            className="retro-input"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="retro-label">Password</label>
                        <input
                            type="password"
                            className="retro-input"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    {errors.length > 0 && (
                        <div className="retro-alert">
                            {errors.map((error, index) => (
                                <p key={index} className="mb-0">⚠️ {error}</p>
                            ))}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="retro-btn"
                        disabled={loading}
                    >
                        {loading ? 'LOADING...' : 'START GAME'}
                    </button>
                </form>
                
                <div className="retro-footer">
                    <p className="mb-2">
                        New Player? <Link to="/register" className="retro-link">Create Account</Link>
                    </p>
                    <p className="small-text">
                        v1.0 | Node v20.17.0
                    </p>
                </div>
            </div>
            
            <div className="retro-terminal">
                <div className="terminal-header">
                    <span className="terminal-dot red"></span>
                    <span className="terminal-dot yellow"></span>
                    <span className="terminal-dot green"></span>
                    <span className="terminal-title">SYSTEM TERMINAL</span>
                </div>
                <div className="terminal-body">
                    <p>Initializing IMS Training System...</p>
                    <p>Loading security protocols...</p>
                    <p>Welcome to Gamified Training v1.0</p>
                    <p>Authentication required...</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
