import React from "react";

const Footer = () => {
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
                        <h4 style={{ fontSize: '12px', color: 'var(--bright-blue)', marginBottom: '15px' }}>
                            ABOUT
                        </h4>
                        <p style={{ fontSize: '10px', color: 'var(--text-light)', lineHeight: '1.6' }}>
                            IMS Awareness Training for Advanced World Solutions, Inc.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--bright-blue)', marginBottom: '15px' }}>
                            QUICK LINKS
                        </h4>
                        <div style={{ fontSize: '10px', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <a href="/" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Home</a>
                            <a href="/topics" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Training</a>
                            <a href="/achievements" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Achievements</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '12px', color: 'var(--bright-blue)', marginBottom: '15px' }}>
                            CONTACT
                        </h4>
                        <p style={{ fontSize: '10px', color: 'var(--text-light)', lineHeight: '1.6' }}>
                            <a href="https://www.awsys-i.com/en/home.php">Offical Site</a>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '9px',
                    color: 'var(--text-light)'
                }}>
                    <div style={{ marginBottom: '10px' }}>
                        © {new Date().getFullYear()} Advanced World Solutions, Inc. All rights reserved.
                    </div>
                    <div>
                        Version 1.0 developed by Yuz the Intern
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;