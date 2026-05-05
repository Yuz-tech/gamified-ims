import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import getImageUrl from '../../utils/getImageUrl';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [badgePreview, setBadgePreview] = useState(null);
  const [uploadingBadge, setUploadingBadge] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentUrl: '',
    videoUrl: '',
    badgeImage: '',
    badgeName: '',
    badgeDescription: '',
    questions: [
      // Required/Mandatory Question
      {
        question: '',
        options: ['','','',''],
        correctAnswer: 0,
        explanation: '',
        isMandatory: true
      },
      // Bonus Questions (4)
      ...Array(4).fill(null).map(() => ({
        question: '',
        options: ['','','',''],
        correctAnswer: 0,
        explanation: '',
        isMandatory: false
      }))
    ],
    isActive: true
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/admin/topics');
      setTopics(response.data);
    } catch (error) {
      alert('Error fetching topics');
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingBadge(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('badge', file);

      const response = await api.post('/upload/badge', formDataUpload, {
        headers: { 'Content-Type': 'mutlipart/form-data' }
      });

      setFormData({
        ...formData, badgeImage: response.data.url
      });
      setBadgePreview(response.data.url);
      alert('Badge uploaded successfully!');
    } catch (error) {
      console.error('Upload error: ', error);
      alert ('Failed to upload badge');
    } finally {
      setUploadingBadge(false);
    }
  };

  const updateQuestion = (qIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      [field]: value
    };
    setFormData({
      ...formData, questions: updatedQuestions
    });
  };

  const updateQuestionOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setFormData({
      ...formData, questions: updatedQuestions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.badgeImage) {
      alert('Please upload a badge image');
      return;
    }

    try {
      if (editingTopic) {
        await api.put(`/admin/topics/${editingTopic._id}`, formData);
        alert('Topic updated successfully');
      } else {
        await api.post('/admin/topics', formData);
        alert('Topic created successfully');
      }
      fetchTopics();
      resetForm();
    } catch (error) {
      alert (error.response?.data?.message || 'Error saving topic');
    }
  };

  const handleEdit = (topic) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description,
      documentUrl: topic.documentUrl,
      videoUrl: topic.videoUrl,
      badgeImage: topic.badgeImage || '',
      badgeName: topic.badgeName || '',
      badgeDescription: topic.badgeDescription || '',
      questions: topic.questions.length === 5 ? topic.questions : [{
        question: '',
        options: ['','','',''],
        correctAnswer: 0,
        explanation: '',
        isMandatory: true
      },
      ...Array(4).fill(null).map(() => ({
        question: '',
        options: ['','','',''],
        correctAnswer: 0,
        explanation: '',
        isMandatory: false
      }))
    ],
    isActive: topic.isActive
    });
    setBadgePreview(topic.badgeImage || null);
    setShowForm(true);
  };

  const handleToggle = async (topicId) => {
    if(window.confirm('Are you sure you want to toggle this topic status?')) {
      try {
        await api.put(`/admin/topics/${topicId}/toggle`);
        fetchTopics();
      } catch(error) {
        alert ('Error toggling topic');
      }
    }
  };

  const handleEnableAll = async () => {
    if (!window.confirm('Enable all topics?')) return;

    try {
      await api.put('/admin/topics/toggle-all', { isActive: true });
      alert('All topics enabled!');
      fetchTopics();
    } catch (error) {
      alert('Failed to enable all topics');
    }
  };

  const handleDisableAll = async () => {
    if (!window.confirm('Disable all topics?')) return;

    try {
      await api.put('/admin/topics/toggle-all', { isActive: false });
      fetchTopics();
    } catch (error) {
      alert('Failed to disable all topics');
    }
  };

  const handleToggleNew = async (topicId, currentStatus) => {
    try {
      const response = await api.patch(`/admin/topics/${topicId}/toggle-new`);

      fetchTopics();

      alert(response.data.message);
    } catch (error) {
      console.error('Error toggling new status: ', error);
      alert('Error updating topic');
    }
  };



  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      documentUrl: '',
      videoUrl: '',
      badgeImage: '',
      badgeName: '',
      badgeDescription: '',
      questions: [
        {
          question: '',
          options: ['','','',''],
          correctAnswer: 0,
          explanation: '',
          isMandatory: true
        },
        ...Array(4).fill(null).map(() => ({
          question: '',
          options: ['','','',''],
          correctAnswer: 0,
          explanation: '',
          isMandatory: false
        }))
      ],
      isActive: true
    });
    setEditingTopic(null);
    setShowForm(false);
    setBadgePreview(null);
  };

  if(loading) {
    return <div style = {{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style = {{ padding: '40px' }}>
      <div style = {{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="neon-text"
                style={{ 
                  fontSize: '28px', 
                  marginBottom: '40px',
                  textAlign: 'center',
                  color: 'var(--orange-accent)'
                }}
              >
                TOPIC MANAGEMENT
              </motion.h1>
        <button onClick = {() => setShowForm(!showForm)} className="retro-btn" style={{ backgroundColor: '#e7fb07'}}>
            {showForm ? 'Cancel' : '+ ADD NEW TOPIC'}
          </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '30px' }}
        >
          <h3 style={{
            fontSize: '14px',
            marginBottom: '20px',
            color: 'var(--secondary-pink)'
          }}>
            {editingTopic ? 'Edit Topic' : 'Create New Topic'}
          </h3>

          <form onSubmit = {handleSubmit}>
            <div style = {{ marginBottom: '20px' }}>
              <label style = {{ 
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                TITLE
              </label>
              <input 
                type="text"
                className="retro-input"
                value={formData.title}
                onChange={(e) => setFormData({
                  ...formData, title: e.target.value
                })}
                required
                />
            </div>

            <div style = {{ marginBottom: '20px'}}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                DESCRIPTION
              </label>
              <textarea className="retro-input" value={formData.description}
                onChange={(e) => setFormData({
                  ...formData, description: e.target.value
                })}
                rows="3"
                required
              />
            </div>

            <div style = {{ marginBottom: '20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                IMS Manual Reference
              </label>
              <input type = "text"
                className="retro-input"
                value={formData.documentUrl} onChange={(e) => setFormData({
                  ...formData, documentUrl: e.target.value
                })}
                placeholder="https://place link here..."
                required
              />
            </div>

            <div style = {{ marginBottom: '20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                IMS Policy Video
              </label>
              <input type = "text" className="retro-input" value={formData.videoUrl} onChange={(e) => setFormData({
                ...formData, videoUrl: e.target.value
              })}
                placeholder="https://video link here..."
                required
              />
            </div>

            {/* Badge Section */}
            <div style = {{
              padding: '20px',
              background: 'rgba(249, 115, 22, 0.05)',
              border: '2px solid var(--orange-accent)',
              marginBottom: '20px'
            }}>
              <h4 style = {{
                fontSize: '12px',
                marginBottom: '15px',
                color: 'var(--orange-accent)'
              }}>
                Badge Configuration
              </h4>

              <div style = {{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Badge Name
                </label>
                <input type = "text" className="retro-input"
                  value = {formData.badgeName} onChange={(e) => setFormData({
                    ...formData, badgeName: e.target.value
                  })}
                  placeholder = "Suggested: YEAR-Topic Name"
                  required
                />
              </div>

              <div style = {{ marginBottom: '15px' }}>
                <label style = {{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Badge Description
                </label>
                <textarea className="retro-input" value={formData.badgeDescription} onChange={(e) => setFormData({
                  ...formData, badgeDescription: e.target.value
                })}
                  placeholder="description here..."
                  rows = "2"
                />
              </div>

              <div style = {{ marginBottom: '15px' }}>
                <label style = {{ 
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Badge Image (PNG, max 5MB)
                </label>
                <input type = "file" accept="image/*"
                  onChange={handleBadgeUpload}
                  style={{ marginBottom: '10px' }}
                  disabled={uploadingBadge}
                />
                {uploadingBadge && (
                  <div style = {{ fontSize: '10px', color: 'var(--bright-blue)' }}>
                    Uploading...
                  </div>
                )}
                {badgePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src = {badgePreview.startsWith('/uploads')
                      ? `http://localhost:5000${badgePreview}` //change to actual IP
                      : badgePreview}
                      alt="Badge preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        border: '2px solid var(--border-color)',
                        padding: '10px',
                        background: 'white'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* XP Infor */}
            <div style = {{
              padding: '15px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid var(--bright-blue)',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <strong>XP Reward System</strong>
              <div style = {{ marginTop: '10px' }}>
                Mandatory Question: <strong>100 XP and Badge</strong>
                Bonus Questions: <strong>50 XP each</strong>
                Total Possible: <strong>100-300 XP</strong>
              </div>
            </div>

            {/* Questions section */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '12px',
                marginBottom: '15px',
                color: 'var(--primary-navy)'
              }}>
                Questions
              </h4>

              {formData.questions.map((question, qIndex) => (
                <div key = {qIndex}
                  style={{
                    marginBottom: '20px',
                    padding: '15px',
                    border: `2px solid ${qIndex === 0 ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                    background: qIndex === 0 ? 'rgba(249, 115, 22, 0.05)' : 'var(--bg-light)'
                  }}
                >
                  <div style = {{ marginBottom: '15px' }}>
                    <h5 style={{ fontSize: '11px', color: 'var(--primary-navy)' }}>
                      {qIndex === 0 ? 'Mandatory Question' : `Bonus Question ${qIndex}`}
                      {qIndex === 0 && <span style = {{ color: 'var(--orange-accent)', marginLeft: '10px' }}>100 XP</span>}
                      {qIndex > 0 && <span style = {{ color: 'var(--success-green)', marginLeft: '10px' }}>50 XP</span>}
                    </h5>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '9px',
                      color: 'var(--text-medium)'
                    }}>
                      Question Text
                    </label>
                    <input type = "text" className="retro-input" value={question.question} onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)} required />
                  </div>

                  <div style = {{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '9px',
                      color: 'var(--text-medium)'
                    }}>
                      Options
                    </label>

                    {question.options.map((option, oIndex) => (
                      <div key = {oIndex} style = {{
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <input type = "radio" checked = {question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)} />
                          <input type = "text" className="retro-input" value={option} onChange={(e) =>
                            updateQuestionOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex} + 1`}
                            required
                            style={{ flex: 1 }} />
                            <span style={{
                              fontSize: '8px', 
                              color: 'var(--text-light)',
                              minWidth: '60px'
                            }}>
                              {question.correctAnswer === oIndex ? 'Correct': ''}
                            </span>
                      </div>
                    ))}
                  </div>

                  <div style = {{ marginBottom: '15px' }}>
                    <label style = {{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '9px',
                      color: 'var(--text-medium)'
                    }}>
                      Explanation
                    </label>
                    <textarea className="retro-input" value={question.explanation || ''} onChange={(e) =>
                      updateQuestion(qIndex, 'explanation', e.target.value)
                    }
                    placeholder="Explain why this is the correct answer..."
                    rows="2"
                    style={{ fontSize: '10px' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type = "submit" className="retro-btn" style = {{ width: '100%' }} disabled={uploadingBadge}>
              {editingTopic ? 'Update Topic' : 'Create Topic'}
            </button>
          </form>
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleEnableAll} className='retro-btn' style={{ background: 'var(--success-green)' }}>
          Enable All
        </button>
        <button onClick={handleDisableAll} className='retro-btn' style={{ background: 'var(--error-red)' }}>
          Disable All
        </button>
      </div>

      {/* Topics List */}
      <div className="retro-card">
        <h3 style = {{ 
          fontSize: '14px',
          marginBottom: '20px',
          color: 'var(--secondary-pink)'
        }}>
          All Topics
        </h3>

        {topics.length === 0 ? (
          <div style = {{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-light)'
          }}>
            No topics yet.
          </div>
        ) : (
          <div style = {{ overflowX: 'auto' }}>
            <table style = {{
              width: '100%',
              fontSize: '10px',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style = {{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style = {{ padding: '15px', textAlign: 'left' }}>TITLE</th>
                  <th style = {{ padding: '15px', textAlign: 'center' }}>BADGE</th>
                  <th style = {{ padding: '15px', textAlign: 'center' }}>STATUS</th>
                  <th style = {{ padding: '15px', textAlign: 'center' }}>CONDITION</th>
                  <th style = {{ padding: '15px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key = {topic._id} style={{ borderBottom: '1px solid var(--border-color)'}}>
                    <td style = {{ padding: '10px', fontWeight: 'bold' }}>
                      {topic.title}
                    </td>
                    <td style = {{ padding: '10px', textAlign: 'center' }}>
                      {topic.badgeImage && (
                        <img src={getImageUrl(topic.badgeImage)}
                          alt={topic.badgeImage.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.src = '/uploads/badges/default.png';
                          }}
                        />
                      )}
                    </td>
                    <td style = {{ padding: '10px', textAlign: 'center' }}>
                      <span style = {{ 
                        padding: '3px 8px',
                        background: topic.isActive ? 'var(--success-green)' : 'var(--error-red)',
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 'bold'
                      }}>
                        {topic.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {topic.isNew && (
                        <span style = {{ 
                        padding: '3px 8px',
                        background: topic.isNew ? 'var(--success-green)' : 'var(--error-red)',
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 'bold'
                      }}>
                        {topic.isNew ? 'NEW' : 'OLD'}
                      </span>
                      )}
                    </td>

                    <td style = {{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => handleEdit(topic)} className="retro-btn secondary" style = {{
                        fontSize: '8px',
                        padding: '5px 10px',
                        marginRight: '5px'
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleToggle(topic._id)} className="retro-btn" style = {{
                        fontSize: '8px',
                        padding: '5px 10px',
                        marginRight: '5px',
                        background: topic.isActive ? 'var(--error-red)' : 'var(--success-green)'
                      }}>
                        {topic.isActive ? 'DISABLE' : 'ENABLE'}
                      </button>
                      
                      <button onClick={() => handleToggleNew(topic._id)} className='retro-btn' style={{ 
                        fontSize: '8px',
                        padding: '5px 10px',
                        marginRight: '5px',
                        background: topic.isNew ? 'red' : 'green',
                        color: '#ffffff',
                        border: topic.isNew ? '2px solid #ef4444' : undefined
                      }}
                      title={topic.isNew ? 'Mark as NOT new' : 'Mark As New'}
                      >
                        NEW
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;