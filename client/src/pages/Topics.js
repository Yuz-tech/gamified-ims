import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Topics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [topics, searchTerm, filterStatus]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      alert('Error loading topics');
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = [...topics];

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus === 'completed') {
      filtered = filtered.filter(topic => topic.mandatoryCompleted);
    } else if (filterStatus === 'incomplete') {
      filtered = filtered.filter(topic => !topic.mandatoryCompleted);
    }

    setFilteredTopics(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING...</div>
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
        style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        IMS Awareness Training Topics
      </motion.h1>

      {/* XP Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, var(--bg-light) 100%)' }}
      >
        <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
          XP Reward System
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '15px', border: '2px solid var(--orange-accent)', background: 'rgba(249, 115, 22, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>MANDATORY QUESTION</div>
            <div style={{ fontSize: '24px', color: 'var(--orange-accent)', fontWeight: 'bold' }}>100 XP</div>
            <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>1 Question • Pass to Unlock Badge</div>
          </div>
          <div style={{ padding: '15px', border: '2px solid var(--bright-blue)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>BONUS QUESTIONS</div>
            <div style={{ fontSize: '24px', color: 'var(--bright-blue)', fontWeight: 'bold' }}>50 XP EACH</div>
            <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>4 Questions • Optional • 0-200 XP Total</div>
          </div>
          <div style={{ padding: '15px', border: '2px solid var(--success-green)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '5px' }}>TOTAL POSSIBLE</div>
            <div style={{ fontSize: '24px', color: 'var(--success-green)', fontWeight: 'bold' }}>100-300 XP</div>
            <div style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '5px' }}>Per Topic • Badge Included</div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-card"
        style={{ marginBottom: '30px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
              Search
            </label>
            <input
              type="text"
              className="retro-input"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', color: 'var(--text-medium)' }}>
              Filter
            </label>
            <select
              className="retro-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="all">All Topics</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-medium)' }}>
          <div>Showing {filteredTopics.length} of {topics.length} topics</div>
          {(searchTerm || filterStatus !== 'all') && (
            <button onClick={handleClearFilters} className="retro-btn secondary" style={{ fontSize: '9px', padding: '5px 10px' }}>
              CLEAR
            </button>
          )}
        </div>
      </motion.div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="retro-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-medium)' }}>No Topics Found</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="retro-card"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                background: topic.mandatoryCompleted 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-light) 100%)' 
                  : 'var(--bg-light)',
                borderColor: topic.mandatoryCompleted ? 'var(--success-green)' : 'var(--border-color)',
                borderWidth: topic.mandatoryCompleted ? '3px' : '2px'
              }}
              onClick={() => navigate(`/topics/${topic._id}`)}
            >
              {/* Title */}
              <h3 style={{
                fontSize: '14px',
                color: 'var(--primary-navy)',
                marginBottom: '20px',
                fontWeight: 'bold',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {topic.title}
              </h3>

              {/* Status Badge */}
              {topic.mandatoryCompleted ? (
                <div style={{
                  padding: '10px',
                  background: topic.bonusCompleted 
                    ? 'var(--success-green)' 
                    : 'rgba(16, 185, 129, 0.2)',
                  color: topic.bonusCompleted ? 'white' : 'var(--success-green)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  border: `2px solid var(--success-green)`
                }}>
                  {topic.bonusCompleted ? 'COMPLETED' : 'PASSED'}
                </div>
              ) : (
                <div style={{
                  padding: '10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--bright-blue)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  border: '2px solid var(--bright-blue)'
                }}>
                  Not Started
                </div>
              )}

              {/* Button */}
              <button
                className="retro-btn"
                style={{
                  width: '100%',
                  background: topic.mandatoryCompleted 
                    ? (topic.bonusCompleted ? 'var(--success-green)' : 'var(--bright-blue)')
                    : 'var(--orange-accent)',
                  fontSize: '11px',
                  padding: '12px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/topics/${topic._id}`);
                }}
              >
                {topic.mandatoryCompleted 
                  ? (topic.bonusCompleted ? 'View Topic' : 'Continue')
                  : 'Start Topic'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .retro-card:hover {
          transform: translateY(-5px);
          box-shadow: 5px 5px 0 var(--primary-navy);
        }
      `}</style>
    </div>
  );
};

export default Topics;