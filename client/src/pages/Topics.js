import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [searchTerm, filterStatus, Topics]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
      setFilteredTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics: ', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = [...topics];

    if(searchTerm) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if(filterStatus === 'completed') {
      filtered = filtered.filter(topic => topic.isCompleted);
    } else if (filterStatus === 'incomplete') {
      filtered = filtered.filter(topic => !topic.isCompleted);
    }
    setFilteredTopics(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  if(loading) {
    return (
      <div style = {{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div className="loading neon-text">
          Loading Topics...
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container" style = {{ paddingTop: '40px' }}>
      <div className="scanlines"></div>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{
          fontSize: '28px',
          marginBottom: '40px',
          textAlign: 'center',
          color: 'var(--primary-navy)'
        }}>
          IMS Awareness Topics
        </motion.h1>

        {/*Search and Filter*/}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
          >
            <h3 style = {{
              fontSize: '14px',
              color: 'var(--secondary-pink)',
              marginBottom: '20px'
            }}>
              Search and Filter
            </h3>

            <div style = {{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              {/*Search input*/}
              <div>
                <label style = {{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Search by Title or Description
                </label>
                <input 
                  type="text"
                  className="retro-input"
                  placeholder="Type to search..."
                  value = {searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/*Status filter*/}
              <div>
                <label style = {{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Filter by Status
                </label>
                <select 
                  className="retro-input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value = "all">All Topics</option>
                  <option value = "completed">Completed Topics</option>
                  <option value = "incomplete">Incomplete Topics</option>
                </select>
              </div>
            </div>

            {/* Results counter and clear button */}
            <div style = {{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style = {{ fontSize: '10px', color: 'var(--success-green)' }}>
                Showing {filteredTopics.length} of {topics.length} topics
              </div>
              {(searchTerm || filterStatus !== 'all') && (
                <button 
                  onClick={handleClearFilters}
                  className="retro-btn secondary"
                  style={{ fontSize: '10px', padding: '8px 15px' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>

          {/* Topics Grid */}
          {filteredTopics.length > 0 ? (
            <div style = {{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {filteredTopics.map((topic, index) => (
                <motion.div 
                  key = {topic._id}
                  initial = {{ opacity: 0, y: 50 }}
                  animate = {{ opacity: 1, y: 0 }}
                  transition = {{ delay: index * 0.1 }}
                  className="retro-card"
                  style = {{
                    cursor: 'pointer',
                    position: 'relative',
                    opacity: topic.isCompleted ? 0.85 : 1
                  }}
                  onClick = {() => navigate(`/topics/${topic._id}`)}
                  whileHover = {{ scale: 1.02 }}
                  >
                    {topic.isCompleted && (
                      <div style = {{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'var(--success-green)',
                        color: 'white',
                        padding: '5px 10px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 0 var(--primary-navy)',
                        zIndex: 1
                      }}>
                        Completed
                      </div>
                    )}

                    <div style = {{
                      width: '100%',
                      height: '150px',
                      background: 'linear-gradient(135deg, var(--bg-medium) 0%, var(--bg-dark) 100%)',
                      border: '2px solid var(--bright-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      marginBottom: '20px',
                      boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.2)'
                    }}>
                      {topic.isCompleted ? '✅' : '📖'}
                    </div>

                    <h3 style = {{
                      fontSize: '14px',
                      color: 'var(--primary-navy)',
                      marginBottom: '15px',
                      fontWeight: 'bold'
                    }}>
                      {topic.title}
                    </h3>

                    <p style = {{
                      fontSize: '10px',
                      color: 'var(--text-medium)',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {topic.description}
                    </p>

                    <div style = {{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      fontSize: '9px',
                      marginTop: '20px'
                    }}>
                      <div style = {{
                        padding: '10px',
                        border: '2px solid var(--orange-accent)',
                        textAlign: 'center',
                        boxShadow: '2px 2px 0 var(--primary-navy)'
                      }}>
                        <div style = {{ color: 'var(--text-medium)'}}>
                          XP Reward
                        </div>
                        <div style = {{
                          color: 'var(--orange-accent)',
                          marginTop: '5px',
                          fontSize: '14px'
                        }}>
                          {topic.xpReward}
                        </div>
                      </div>
                      <div style = {{
                        padding: '10px',
                        border: '2px solid var(--bright-blue)',
                        textAlign: 'center',
                        boxShadow: '2px 2px 0 var(--primary-navy)'
                      }}>
                        <div style = {{ color: 'var(--text-medium)'}}>
                          Passing
                        </div>
                        <div style = {{ color: 'var(--bright-blue)', marginTop: '5px', fontSize: '14px' }}>
                          {topic.passingScore}%
                        </div>
                      </div>
                    </div>

                    <div style = {{
                      marginTop: '20px',
                      padding: '10px',
                      background: topic.isCompleted
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(249, 115, 22, 0.1)',
                      border: `2px solid ${topic.isCompleted ? 'var(--success-green)' : 'var(--orange-accent)'}`,
                      textAlign: 'center',
                      fontSize: '10px',
                      color: topic.isCompleted ? 'var(--success-green)' : 'var(--orange-accent)',
                      fontWeight: 'bold'
                    }}>
                      {topic.isCompleted ? 'Badge Earned' : 'Start Topic' }
                    </div>
                  </motion.div>
              ))}
            </div>
          ) : (
            <div className="retro-card" style={{ textAlign: 'center', padding: '60px' }}>
              <div style = {{ fontSize: '48px', marginBottom: '20px' }}>
                {topics.length === 0}
              </div>
              <div style = {{ fontSize: '14px', color: 'var(--bright-blue)' }}>
                {topics.length === 0 ? 'No topics available' : 'No topics found'}
              </div>
              <div style = {{
                fontSize: '10px',
                color: 'var(--text-light)',
                marginTop: '10px'
              }}>
                {topics.length === 0 ? 'Check back soon!' : 'Try adjusting your filters'}
              </div>
              {topics.length === 0 ? (
                <button 
                  onClick={fetchTopics}
                  className="retro-btn"
                  style={{ marginTop: '20px' }}
                >
                  Refresh
                </button>
              ) : (
                <button
                  onClick={handleClearFilters}
                  className="retro-btn"
                  style = {{ marginTop: '20px' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
    </div>
  );
};

export default Topics;