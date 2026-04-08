import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Settings = () => {
    const [completionFormUrl, setCompletionFormUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');

            setCompletionFormUrl(response.data.settingValue || '');
        } catch (error) {
            console.error('Error fetching settings: ', error);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            new URL(completionFormUrl);
        } catch (err) {
            setError('Please enter a valid URL');
            setSaving(false);
            return;
        }

        try {
            await api.put('/admin/settings', { completionFormUrl });
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleTestLink = () => {
        if (completionFormUrl) {
            window.open(completionFormUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
                <div className="loading neon-text">Loading...</div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <h1 style={{ fontSize: '28px', color: 'var(--primary-navy)', marginBottom: '40px' }}>
                COMPLETION FORM
            </h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ maxWidth: '800px' }}
            >
                <h3 style={{ fontSize: '14px', color: 'var(--text-medium)', marginBottom: '30px'}}>
                    Completion Form Configuration
                </h3>

                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'var(--text-dark)'
                        }}>
                            Completion Form URL
                        </label>
                        <p style={{
                            fontSize: '10px',
                            color: 'var(--text-medium)',
                            marginBottom: '15px',
                            lineHeight: '1.6'
                        }}>
                            This link will only appear when a user completes all topics.
                        </p>
                        <input 
                            type="url"
                            className="retro-input"
                            value={completionFormUrl}
                            onChange={(e) => setCompletionFormUrl(e.target.value)}
                            placeholder="https://forms.gle/..."
                            required
                            style={{ marginBottom: '15px' }}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={handleTestLink} className="retro-btn secondary" style={{ flex: 1, fontSize: '11px' }} disabled={!completionFormUrl}>
                                Test Link
                            </button>
                            <button type="submit" className="retro-btn" style={{ flex: 1, fontSize: '11px' }} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '15px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '2px solid var(--success-green)',
                                color: 'var(--success-green)',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                marginBottom: '20px'
                            }}
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '15px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '2px solid var(--error-red)',
                                color: 'var(--error-red)',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                marginBottom: '20px'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </form>

            </motion.div>
        </div>
    );
};

export default Settings;