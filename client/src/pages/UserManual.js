import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserManual = () => {
    const navigate = useNavigate();

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <button onClick={() => navigate('/')} className="retro-btn secondary" style={{ marginBottom: '20px' }}>
                Back to Home
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
            >
                <h1 style={{ fontSize: '28px', color: 'var(--primary-navy)', marginBottom: '30px' }}>
                    USER MANUAL & INSTRUCTIONS
                </h1>

                {/* GETTING STARTED */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                        GETTING STARTED
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            Welcome to the gamified IMS Awareness Training! This platform helps you learn and review the integrated management system through interactive training modules and games.
                        </p>
                        <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                            <li>Start with priority topics: ISO 9001 and ISO 27001</li>
                            <li>Complete Mandatory Questions to earn 100 XP and unlock badges</li>
                            <li>Answer bonus questions for additional XP</li>
                            <li>Play games to reinforce your knowledge and earn more rewards</li>
                        </ol>
                    </div>
                </section>

                <section style={{ marginBottom: '40px'}}>
                    <h2 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '20px' }}>
                        Topics & Training
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>Each topic includes: </strong>
                        </p>
                            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                                <li><strong>IMS Reference manual and IMS Policy Video </strong></li>
                                <li><strong>Mandatory question worth 100 XP + Badge</strong></li>
                                <li><strong>4 bonus questions that grants 50XP per correct answer</strong></li>
                            </ul>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>How to complete a topic: </strong>
                            </p>
                            <ol style={{ marginLeft: '20px' }}>
                                <li>Review the reference materials (manual & video)</li>
                                <li>Check the confirmation box</li>
                                <li>Answer the mandatory question correctly</li>
                                <li>Optional but recommended: complete bonus questions for extra XP</li>
                            </ol>
                    </div>
                </section>

                {/* XP & Levels */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                        XP & LEVELS
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>How to earn XP: </strong>
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                            <li>Mandatory Question: 100 XP</li>
                            <li>Bonus Question: 50 XP</li>
                        </ul>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>Leveling Up:</strong>
                            As you earn XP, you will level up automatically. Each level requires progressively more XP. You level is displayed on your profile and leaderboards.
                        </p>
                    </div>
                </section>

                {/* Badges */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                        ACHIEVEMENTS
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            Earn badges by completing topics. Each badge tracks how many times you earned it across multiple training cycles:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                            <li><strong>Gray Border:</strong> Earned once (Badge Count: 1)</li>
                            <li><strong>Silver Border:</strong> Earned twice (Badge Count: 2)</li>
                            <li><strong>Gold Border:</strong> Earned three times (Badge Count: 3)</li>
                            <li><strong>Platinum Border:</strong> Earned four times (Badge Count: 4)</li>
                            <li><strong>Ultra Border:</strong> Earned five or more times (Badge Count: 5+)</li>
                        </ul>
                    </div>
                </section>

                {/* Leaderboard */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    LEADERBOARD
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p style={{ marginBottom: '15px' }}>
                    Compete with your colleagues! The leaderboard shows:
                    </p>
                    <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li>Top 3 players on podium </li>
                    <li>All players ranked by total XP</li>
                    <li>Player avatars, levels, and badge counts</li>
                    <li>Special titles for top performers</li>
                    </ul>
                </div>
                </section>

                {/* Profile */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    PROFILE MANAGEMENT
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p style={{ marginBottom: '15px' }}>
                    Customize your profile:
                    </p>
                    <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li><strong>Avatar:</strong> Choose from pre-made avatars</li>
                    <li><strong>Password:</strong> Change your password anytime</li>
                    <li><strong>Sessions:</strong> View and manage active login sessions</li>
                    <li><strong>Stats:</strong> Track your progress, badges, and completed topics</li>
                    </ul>
                </div>
                </section>

                {/* Yearly Reset */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    YEARLY RESET
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p style={{ marginBottom: '15px' }}>
                    At the end of each training cycle, the system resets:
                    </p>
                    <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li><strong>Cleared:</strong> Topic completion status</li>
                    <li><strong>Preserved:</strong> Total XP, levels, badge counts</li>
                    </ul>
                    <p>
                    This allows you to retake training annually while tracking your progress over multiple years through badge counts!
                    </p>
                </div>
                </section>

                {/* Tips */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    TIPS FOR SUCCESS
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <ul style={{ marginLeft: '20px' }}>
                    <li>Start with ISO 9001 and ISO 27001 (priority topics)</li>
                    <li>Actually review the materials - it helps you answer correctly!</li>
                    <li>Complete all bonus questions for maximum XP</li>
                    <li>Play games to reinforce what you've learned</li>
                    <li>Check the leaderboard to see your ranking</li>
                    <li>Complete all topics to unlock the completion form</li>
                    </ul>
                </div>
                </section>

                {/* Support */}
                <section>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    ❓ NEED HELP?
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p>
                    If you encounter any issues or have questions, please contact your system administrator.
                    </p>
                </div>
                </section>
            </motion.div>
        </div>
    );
};

export default UserManual;