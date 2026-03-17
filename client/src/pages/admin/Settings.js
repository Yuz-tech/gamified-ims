import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Settings = () => {
    const [confirmCode, setConfirmCode] = useState('');
    const [resetting, setResetting] = useState(false);
    const [formUrl, setFormUrl] = useState('');
    const [savingUrl, setSavingUrl] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            setFormUrl(response.data.completionFormUrl);
        } catch (error) {
            console.error('Error fetching settings: ', error);
        }
    };

    const handleSaveFormUrl = async (e) => {
        e.preventDefault();
        setSavingUrl(true);

        try {
            await api.put('/admin/settings', { completionFormUrl: formUrl });
            alert('Completion from URL updated!');
        } catch (error) {
            alert('Failed to update form URL');
        } finally {
            setSavingUrl(false);
        }
    };

    const handleYearlyReset = async (e) => {
        e.preventDefault();

        if (!window.confirm('This will reset all employee topic progress')) {
            return;
        }

        if (!window.confirm('Final warning: This will clear all topic completions for the year.')) {
            return;
        }

        setResetting(true);

        try {
            const response = await api.post('/admin/yearly-reset', { confirmCode });
            alert(`Reset complete! ${response.data.usersReset} users reset`);
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

            {/* Completion form URL */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="retro-card"
              style={{ maxWidth: '600px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--bright-blue)', marginBottom: '20px' }}>
                    Completion Form URL
                </h3>

                <form onSubmit={handleSaveFormUrl}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>
                            FORM URL
                        </label>
                        <input type="url" className="retro-input" value={formUrl} onChange={(e) => setFormUrl(e.target.value)}
                            placeholder="https://your-forms-link-here..."
                            required
                        />
                        <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>
                            This URL is show to users when they complete all topics
                        </div>
                    </div>

                    <button type="submit" className="retro-btn" style={{ width: '100%'}} disabled={savingUrl}>
                        {savingUrl ? 'Saving...' : 'Save Form URL'}
                    </button>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="retro-card"
                style={{ maxWidth: '600px', border: '3px solid var(--error-red)' }}>

                </motion.div>
        </div>
    );
};

export default Settings;