import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);
    return (
        <footer style={{
            marginTop: '80px',
            padding: '40px 20px',
            background: 'var(--primary-navy)',
            borderTop: '3px solid var(--bright-blue)',
            textAlign: 'center'
        }}>
            <div className="retro-container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '30px',
                    marginBottom: '30px'
                }}>
                    {/* About */}
                    <div>
                        <h4 style={{ fontSize: '12px', color: '#FFFFFF', marginBottom: '15px' }}>
                            ABOUT
                        </h4>
                        <p style={{ fontSize: '10px', color: '#55e8f2', lineHeight: '1.6' }}>
                            IMS Awareness Training for Advanced World Solutions | Systems, Inc.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '12px', color: '#FFFFFF', marginBottom: '15px' }}>
                            QUICK LINKS
                        </h4>
                        <div style={{ fontSize: '10px', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <a href="/" style={{ color: '#55e8f2', textDecoration: 'none' }}>Home</a>
                            <a href="/topics" style={{ color: '#55e8f2', textDecoration: 'none' }}>Training</a>
                            <a href="/achievements" style={{ color: '#55e8f2', textDecoration: 'none' }}>Achievements</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '12px', color: '#FFFFFF', marginBottom: '15px' }}>
                            CONTACTS
                        </h4>
                        <p style={{ fontSize: '10px', color: '#55e8f2', lineHeight: '1.6' }}>qec.common@awsys-i.com</p>
                        <br />
                        <a href="https://www.awsys-i.com/en/home.php" style={{ fontSize: '10px', color: '#55e8f2', lineHeight: '1.6' }}>AWS Website</a>
                        <br />
                        <a href="https://sites.google.com/awsys-i.com/ims-portal/home" style={{ fontSize: '10px', color: '#55e8f2', lineHeight: '1.6' }}>IMS Portal</a>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '9px',
                    color: '#55e8f2'
                }}>
                    <div style={{ marginBottom: '10px', lineHeight: '1.7' }}>
                        © {new Date().getFullYear()} Advanced World Solutions, Inc. All rights reserved.
                    </div>
                    <div>
                        Version 1.0 developed by Yuz the Intern
                    </div>
                </div>
            </div>
            <div onClick={() => {
                        const newCount = clickCount + 1;
                        setClickCount(newCount);
                        if (newCount === 7) {
                          navigate('/驚き');
                          setClickCount(0);
                          window.scrollTo({
                            top: 0
                          })
                        }
                    }}
                    style={{ marginTop: '20px', textAlign: 'right', opacity: '35%' }}
                    >
                        🥚
                    </div>
        </footer>
    );
};

export default Footer;