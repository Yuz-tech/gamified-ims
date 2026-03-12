import React, { useState } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Settings = () => {
    const [confirmCode, setConfirmCode] = useState('');
    const [resetting, setResetting] = useState(false);

    const handleYearlyReset = async (e) => {
        e.preventDefault();

        if (!window.confirm('This will reset all players topic progress! Are you sure to continue?')) {
            return;
        }

        if (!window.confirm('Final Warning: This will clear all topic completions, BUT preserve/retain XP and levels. Continue?')) {
            return;
        }

        setResetting(true);

        try {
            const response = await api.post('/admin/yearly-reset', { confirmCode });
            alert(`Reset complete! ${response.data.usersReset} users reset (topics only - XP/Levels retained).`);
            setConfirmCode('');
        } catch (error) {
            alert(error.response?.data?.message || 'Reset failed');
        } finally {
            setResetting(false);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '30px' }}>
                System Settings
            </h1>

            {/* Yearly Reset */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="retro-card"
              style={{ maxWidth: '600px', border: '3px solid var(--error-red)' }}
            >
                <div style={{
                    padding: '15px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid var(--error-red)',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--error-red)', marginBottom: '10px', fontWeight: 'bold' }}>
                        Warning Zone
                    </h3>
                    <p style={{ fontSize: '10px', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                        This action will reset ALL players topic progress. XP and Levels are preserved.
                    </p>
                </div>

                <h3 style={{ fontSize: '14px', color: 'var(--error-red)', marginBottom: '20px' }}>
                    Yearly Reset
                </h3>

                <form onSubmit={handleYearlyReset}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
                            Confirmation Code *
                        </label>
                        <input type="text" className="retro-input" value={confirmCode} onChange={(e) => setConfirmCode(e.target.value)} placeholder="Type: RESET_DATA" required />
                        <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>
                            Type <strong>"RESET_DATA"</strong> to confirm
                        </div>
                    </div>

                    <button type="submit" className="retro-btn" style={{
                        width: '100%',
                        background: 'var(--error-red)',
                        opacity: confirmCode === 'RESET_DATA' ? 1 : 0.5
                    }}
                    disabled={confirmCode !== 'RESET_DATA' || resetting}
                    >
                        {resetting ? 'Resetting...' : 'Execute reset order'}
                    </button>
                </form>

                <div style = {{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '2px solid var(--bright-blue)',
                    fontSize: '9px',
                    lineHeight: '1.6'
                }}>
                    <strong>What gets reset:</strong><br />
                    - ALL Employee topic progress cleared <br />
                    - ALL quiz progress from IMS Awareness topics <br />
                    - ALL activity logs deleted <br />
                    <br />
                    <strong>What gets preserved:</strong><br />
                    - Employee XP and Levels <br />
                    - Topics and user configurations <br />
                    <br />
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;