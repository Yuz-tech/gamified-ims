import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import api from '../utils/api';

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('xp');

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        filterAndSortPlayers();
    }, [players, searchTerm, sortBy]);

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/leaderboard?limit=1000');
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players: ', error);
            alert('Failed to load players');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPlayers = () => {
        let filtered = [...players];

        if (searchTerm) {
            filtered = filtered.filter(player => player.username.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'xp':
                    return b.xp - a.xp;
                case 'level':
                    return b.level - a.level || b.xp - a.xp;
                case 'badges':
                    return (b.badges?.length || 0) - (a.badges?.length || 0);
                default:
                    return b.xp - a.xp;
            }
        });

        setFilteredPlayers(filtered);
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'var(--orange-accent)';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return 'var(--text-medium)';
    };

    const getRankIcon = (rank) => {
         if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (loading) {
        return (
            <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="loading neon-text">Loading Players...</div>
            </div>
        );
    }

    return (
        <div className="retro-container" style={{ paddingTop: '40px' }}>
            <div className="scanlines"></div>

            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="neon-text"
              style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}>
                Players Leaderboard
              </motion.h1>

              {/* Search & Sort */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card"
                style={{ marginBottom: '30px' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Search Players
                            </label>
                            <input type="text" className="retro-input" placeholder="Search by username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
                                Sort by
                            </label>
                            <select className="retro-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%' }}>
                                <option value="xp">Total XP</option>
                                <option value="level">Level</option>
                                <option value="badges">Badges</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
                        Showing {filteredPlayers.length} of {players.length} players
                    </div>
                </motion.div>

                {/* top 3 podium */}
                {filteredPlayers.length >= 3 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="retro-card"
                          style={{
                            textAlign: 'center',
                            border: '3px solid #C0C0C0',
                            background: 'linear gradient(135deg, rgba(192, 192, 192, 0.1) 0%, var(--bg-light) 100%',
                            marginTop: '20px'
                          }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🥈</div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '5px' }}>
                                {filteredPlayers[1].username}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                                Level {filteredPlayers[1].level}
                            </div>
                            <div style={{ fontSize: '14px', color: '#C0C0C0', fontWeight: 'bold' }}>
                                {filteredPlayers[1].xp} XP
                            </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="retro-card"
                          style={{
                            textAlign: 'center',
                            border: '3px solid var(--orange-accent)',
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, var(--bg-light) 100%'
                          }}
                        >
                            <div style={{ fontSize: '64px', marginBottom: '10px' }}>🥇</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '5px' }}>
                                {filteredPlayers[0].username}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                                Level {filteredPlayers[0].level}
                            </div>
                            <div style={{ fontSize: '18px', color: 'var(--orange-accent)', fontWeight: 'bold' }}>
                                {filteredPlayers[0].xp} XP
                            </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="retro-card"
                          style={{
                            textAlign: 'center',
                            border: '3px solid #CD7F32',
                            background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.1) 0%, var(--bg-light) 100%',
                            marginTop: '40px'
                          }}
                        >
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🥉</div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '5px' }}>
                                {filteredPlayers[2].username}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                                Level {filteredPlayers[2].level}
                            </div>
                            <div style={{ fontSize: '14px', color: '#CD7F32', fontWeight: 'bold' }}>
                                {filteredPlayers[2].xp} XP
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Full table */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="retro-card"
                >
                    <h3 style={{ fontSize: '14px', color: 'var(--secondry-pink)', marginBottom: '20px' }}>
                        Full Rankings
                    </h3>

                    {filteredPlayers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-medium)' }}>
                            No Players Found
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary-navy)' }}>
                                        <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '10px', color: 'var(--text-medium)' }}>
                                            Rank
                                        </th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '10px', color: 'var(--text-medium)' }}>
                                            Player
                                        </th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '10px', color: 'var(--text-medium)' }}>
                                            Level
                                        </th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '10px', color: 'var(--text-medium)' }}>
                                            XP
                                        </th>
                                        <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '10px', color: 'var(--text-medium)' }}>
                                            Badges
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlayers.map((player, index) => (
                                        <motion.tr
                                          key={player._id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.02}}
                                          style={{
                                            borderBottom: '1px solid var(--border-color)',
                                            background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
                                          }}
                                        >
                                            <td style={{ padding: '15px 10px', fontSize: '14px', fontWeight: 'bold', color: getRankColor(index + 1) }}>
                                                {getRankIcon(index + 1)}
                                            </td>
                                            <td style={{ padding: '15px 10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        border: '2px solid var(--bright-blue)',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'var(--bg-medium)'
                                                    }}>
                                                        {player.avatar ? (
                                                            <img src = {player.avatar.startsWith('/uploads/')
                                                                ? `http://localhost:5000${player.avatar}`
                                                                : player.avatar}
                                                            alt={player.username}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = '<div style="font-size: 20px;">👤</div>';
                                                            }}
                                                            />
                                                        ) : (
                                                            <div style={{ fontSize: '20px' }}>👤</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>
                                                            {player.username}
                                                        </div>
                                                        <div style={{ fontSize: '9px', color: 'var(--text-medium)' }}>
                                                            {player.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '5px 12px',
                                                    background: 'var(--bright-blue)',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {player.level}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px 10px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--orange-accent)' }}>
                                                {player.xp.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '15px 10px', textAlign: 'center', fontSize: '12px' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '5px 12px',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    border: '2px solid var(--success-green)',
                                                    color: 'var(--success-green)',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {player.badges?.length || 0}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
        </div>
    );
};

export default Players;