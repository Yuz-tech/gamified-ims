import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../../utils/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics: ', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading Analytics...</div>
            </div>
        );
    }

    const topTopicsData = {
        labels: analytics?.topTopics?.slice(0, 10).map(t => t.title.length > 20 ? t.title.substring(0,20) + '...' : t.title) || [],
        datasets: [
            {
                label: 'Completions',
                data: analytics?.topTopics?.slice(0, 10).map(t => t.completions) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
        ],
    };

    const topUsersXPData = {
        labels: analytics?.topUsers?.slice(0,10).map(u => u.username) || [],
        datasets: [
            {
                label: 'Total XP',
                data: analytics?.topUsers?.slice(0, 10).map(u => u.xp) || [],
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: 'rgba(249, 115, 22, 1)',
                borderWidth: 2,
            },
        ],
    };

    const completionDistributionData = {
        labels: ['High Performers (70%+)', 'Medium (40-69%)', 'Low(<40%)'],
        datasets: [
            {
                data: [
                    analytics?.topUsers?.filter(u => (u.completedTopics / 28) * 100 >= 70).length || 0,
                    analytics?.topUsers?.filter(u => {
                        const pct = (u.completedTopics / 28) * 100;
                        return pct >= 40 && pct < 70;
                    }).length || 0,
                    analytics?.topUsers?.filter(u => (u.completedTopics / 28) * 100 < 40).length || 0,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <h1 style={{ fontSize: '28px', color: 'var(--primary-navy)', marginBottom: '40px' }}>
                Analytics
            </h1>

            {/* Overview Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="retro-card"
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                        AVG COMPLETION RATE
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--success-green)' }}>
                        {analytics?.avgCompletionRate || 0}%
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="retro-card"
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                        AVG XP PER USER
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--bright-blue)' }}>
                        {analytics?.avgXpPerUser || 0}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="retro-card"
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                        AVG LEVEL
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--orange-accent)' }}>
                        {analytics?.avgLevel || 0}
                    </div>
                </motion.div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                {/* Top Topics Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        TOP TOPICS BY COMPLETION
                    </h3>
                    <div style={{ height: '400px' }}>
                        <Bar data = {topTopicsData} options={chartOptions} />
                    </div>
                </motion.div>

                {/* Top Users XP Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                        Top Learners by XP
                    </h3>
                    <div style={{ height: '400px' }}>
                        <Bar data = {topUsersXPData} options={chartOptions} />
                    </div>
                </motion.div>
            </div>

            {/* Completion Distribution Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="retro-card"
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
                    User Performance Distribution
                </h3>
                <div style={{ height: '400px' }}>
                    <Pie data={completionDistributionData} options={pieOptions} />
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;