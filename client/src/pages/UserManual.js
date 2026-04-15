import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "../context/AuthContext";

const UserManual = () => {
    const { user } = useAuth();
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
                            Welcome to the gamified IMS Awareness Training {user.username}! This platform was developed to gamify the integrated management system through interactive training modules.
                        </p>
                        <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                            <li>You can start training by either pressing the 始 button or going to the "Training" tab in the Navbar.</li>
                            <li>You can explore other features or you can just focus on your training.</li>
                            <li>The Gamified platform offers XP/levels, ranks, and badges that increases competence among players.</li>
                            <li>Always remember to have fun while training.</li>
                        </ol>
                    </div>
                </section>

                <section style={{ marginBottom: '40px'}}>
                    <h2 style={{ fontSize: '18px', color: '#ff0000', marginBottom: '20px' }}>
                        IMS Awareness Training
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>MECHANICS: </strong>
                        </p>
                            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                                <strong>➤ READ </strong>the IMS Reference manual<br />
                                <strong>➤ WATCH </strong>the IMS Policy Video<br />
                                <strong>➤ CHECK </strong>the confirmation box<br />
                                <strong>➤ ANSWER </strong>the Mandatory question<br />
                                <strong>➤ EARN </strong>100 XP and a badge<br />
                                <p>(OPTIONAL: Bonus round)</p>
                            </ul>
                            <br />
                            <h1 style={{ color: '#ff00cc'}}>IMPORTANT NOTE: </h1>
                            <p>Once you complete ALL topics, a completion form link will appear in the HOME page. <u><strong>DO NOT FORGET</strong></u> to fill this up when you finish the training.</p>
                    </div>
                </section>

                {/* XP & Levels */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: '#00c607', marginBottom: '20px' }}>
                        XP & LEVELS
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>How to earn XP: </strong>
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                            <li>Mandatory Question: 100 XP</li>
                            <li>Bonus Question: 50 XP each</li>
                        </ul>
                        <p style={{ marginBottom: '15px' }}>
                            <strong>Level Thresholds:</strong><br />
                            <p>Each level requires progressively more XP. </p><br />
                            <p>Pre-defined thresholds (1-17): </p>
                            Level 1 ➝ 100 XP <br />
                            Level 2 ➝ 250 XP <br />
                            Level 3 ➝ 450 XP <br />
                            <p>... </p><br />
                            <p>level 17 ➝ 7600 XP</p> <br />
                            <p><strong>Calculation: </strong></p>
                            <p>The last predefined threshold is 7600 XP (level 17). Once you exceed, an increment starts at 1300 and increases by 150 XP per level.</p><br />
                            <p><strong>Formula:</strong> </p>
                            <p>XP = 7600 + (1300 + (currentLevel - 17) * 150)</p>
                            <p>Example: </p>
                            <p>Level 17 ➝ 7600 + {1300 + [(17 - 17) * 150]} = 8900 XP </p>
                            <p>Level 18 ➝ 7600 + {1300 + [(18-17) * 150]} = 9050 XP </p> <br />

                            <p>Levels past the pre-defined thresholds (Lvl 17+) are scalable. This design ensures early levels are easier to achieve, while higher levels become progressively harder, creating a natural difficulty curve</p><br />
                            <p>...for a ✨<i>challenging</i>✨ experience. (¬_¬") </p>
                            
                        </p>
                    </div>
                </section>

                {/* Badges */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: '#6b00f8', marginBottom: '20px' }}>
                        ACHIEVEMENTS
                    </h2>
                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                        <p style={{ marginBottom: '15px' }}>
                            Earn badges simply by completing topics. Each badge tracks how many times you earned it across multiple training cycles.
                        </p>
                        <br />
                        <p>
                            A badge is proof that you have conquered a topic.
                        </p>
                    </div>
                </section>

                {/* Leaderboard */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: '#ccc500', marginBottom: '20px' }}>
                    LEADERBOARD
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p style={{ marginBottom: '15px' }}>
                    Compete with other players! The leaderboard shows:
                    </p>
                    <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li>Top 3 players </li>
                    <li>All players ranked by total XP</li>
                    <li>Player avatars, levels, and badge counts</li>
                    <li>Ranks are given as follows: </li>
                    <ul>
                        <li>Level 1-9 "Noob"</li>
                        <li>Level 10-14 "Elite"</li>
                        <li>Level 15-19 "Cultured"</li>
                        <li>Level 20-24 "Fated"</li>
                        <li>level 25+ "IMS Prime"</li>
                    </ul>
                    </ol>
                </div>
                </section>

                {/* Profile */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: '#027d89', marginBottom: '20px' }}>
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
                    This allows you to retake training annually while tracking your progress over multiple years!
                    </p>
                </div>
                </section>

                {/* Tips */}
                <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    💡 TIPS 
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <ul style={{ marginLeft: '20px' }}>
                    <li>Start with ISO 9001 and ISO 27001 (introductory topics)</li>
                    <li>Actually review the materials! This is for your own good.</li>
                    <li>Complete all bonus questions for maximum XP rewards</li>
                    <li>Check the leaderboard to see your ranking</li>
                    <li>Complete all topics to unlock the completion form</li>
                    <li>Apply what you have learned</li>
                    </ul>
                </div>
                </section>

                {/* Support */}
                <section>
                <h2 style={{ fontSize: '18px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    ❓HELP
                </h2>
                <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                    <p>
                    If you encounter any issues or have questions, please contact your system administrator.
                    </p>
                    <br />
                    <p>
                    Further information can be found at the footer of every page.
                    </p>
                </div>
                </section>
            </motion.div>
        </div>
    );
};

export default UserManual;