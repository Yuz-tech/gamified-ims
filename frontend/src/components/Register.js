import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Register = ({ setAuth, setUserData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee'
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {username, email, password, confirmPassword, role} = formData;
    const onChange = e => setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== confirmPassword)
        {
            setErrors(['Passwords do not match']);
            return;
        }

        setLoading(true);
        setErrors([]);

        try {
            const res = await axios.post('/api/auth/register', {
                username, 
                email, 
                password, 
                role
            });

            localStorage.setItem('token', res.data.token);
            setAuth(true);
            setUserData(res.data.user);
            navigate('/home');

        } catch(err) {
            setLoading(false);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors.map(error => error.msg));
            } else {
                setErrors(['Registration failed. Please try again.']);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="retro-login-box">
                <div className = "retro-header">
                    <h1 className="retro-title">CREATE ACCOUNT</h1>
                    <p className="retro-subtitle">Join the IMS Awareness Training</p>
                </div>

                <form onSubmit={onSubmit} className="retro-form">
                    <div className="form-group">
                        <label className="retro-label">Username</label>
                        <input type="text" className="retro-input" name="username" value={username} onChange={onChange} required placeholder="Choose a username" />
                    </div>
                    <div className = "form-group">
                        <label className = "retro-label">Email</label>
                        <input type="email" className="retro-input" name="email" value={email} onChange={onChange} required placeholder="Enter your email" />
                    </div>
                    <div className = "form-group">
                        <label className = "retro-label">Password (minimum of 3 characters)</label>
                        <input type = "password" className="retro-input" name="password" value={password} onChange={onChange} required minLength="3" placeholder="Enter password" />
                    </div>
                    <div className = "form-group">
                        <label className = "retro-label">Confirm Password</label>
                        <input type = "password" className="retro-input" name="confirmPassword" value={confirmPassword} onChange={onChange} required placeholder="Confirm password" />
                    </div>
                    
                    <div className="form-group">
                        <label className="retro-label">Role</label>
                        <select className="retro-input" name="role" value={role} onChange={onChange}>
                            <option value="employee">Employee</option>
                            {/* <option value="admin">Admin</option> */}
                        </select>
                    </div>
                    {errors.length > 0 && (
                        <div className="retro-alert">
                            {errors.map((error, index) => (
                                <p key={index} className="mb-0">!!!{error}</p>
                            ))}
                        </div>
                    )}
                    <button type="submit" className="retro-btn" disabled={loading}>{loading ? 'CREATING...' : 'CREATE ACCOUNT' }</button>
                </form>
                <div className="retro-footer">
                    <p className="mb-2">Already have an account? <Link to="/login" className="retro-link">Login</Link></p>
                    <p className="small-text">Employee Role</p>
                </div>
            </div>
            <div className="retro-terminal">
                <div className="terminal-header">
                    <span className="terminal-dot red"></span>
                    <span className="terminal-dot yellow"></span>
                    <span className="terminal-dot green"></span>
                    <span className="terminal-title">REGISTRATION TERMINAL</span>
                </div>
                <div className="terminal-body">
                    <p>New Registration</p>
                </div>
            </div>
        </div>
    );
};

export default Register;