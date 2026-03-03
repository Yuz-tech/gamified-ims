import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentUrl: '',
    videoUrl: '',
    order: 1,
    questions: [
      //Mandatroy question
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      if(editingTopic) {
        await api.put(`/admin/topics/${editingTopic._id}`, formData);
        alert('Topic updated successfully');
      } else {
        await api.post('/admin/topics', formData);
        alert('Topic created successfully');
      }
      fetchTopics();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving topic');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description,
      documentUrl: topic.documentUrl,
      videoUrl: topic.videoUrl,
      order: topic.order,
      questions: topic.questions.length === 5 ? topic.questions : [
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
      isActive: topic.isActive
    });
    setShowForm(true);
  };

  const handleToggle = async(topicId) => {
    if(window.confirm('Are you sure you want to toggle this topic status?')) {
      try {
        await api.put(`/admin/topics/${topicId}/toggle`);
        fetchTopics();
      } catch (error) {
        alert('Error toggling topic');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      documentUrl: '',
      videoUrl: '',
      order: 1,
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
  };

  if(loading) {
    return <div style = {{
      padding: '40px',
      textAlign: 'center'
    }}>
      Loading...
    </div>
  }

  return (
    <div style = {{ padding: '40px' }}>
      <div style = {{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style = {{
          fontSize: '24px',
          color: 'var(--primary-navy)'
        }}>
          Manage Topics
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="retro-btn">
          {showForm ? 'Cancel' : 'Create Topic'}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial = {{ opacity: 0, y: -20 }}
          animate = {{ opacity: 1, y: 0 }}
          className="retro-card"
          style = {{ marginBottom: '30px' }}
        >
          <h3 style = {{
            fontSize: '14px',
            marginBottom: '20px',
            color: 'var(--secondary-pink)'
          }}>
            {editingTopic ? 'Edit Topic' : 'Create New Topic'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style = {{ marginBottom: '20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                Title
              </label>
              <input 
                type="text"
                className="retro-input"
                value={formData.title}
                onChange={(e) => setFormData({
                  ...formData, title: e.target.value
                })} required />
            </div>

            <div style = {{ marginBottom: '20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                Description
              </label>
              <textarea 
                className="retro-input"
                value={formData.description}
                onChange={(e) => setFormData({
                  ...formData, description: e.target.value
                })}
                rows = "3"
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
              <input 
                type = "text"
                className = "retro-input"
                value = {formData.documentUrl}
                onChange = {(e) => setFormData({
                  ...formData, documentUrl: e.target.value
                })}
                placeholder = "https://reference link here..."
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style = {{
                display: 'block',
                marginBottom: '10px',
                fontSize: '10px',
                color: 'var(--text-medium)'
              }}>
                IMS Video Policy
              </label>
              <input 
                type = "text"
                className = "retro-input"
                value = {formData.videoUrl}
                onChange = {(e) => setFormData({
                  ...formData, videoUrl: e.target.value
                })}
                placeholder="https://video reference link here..."
                required
              />

              <div style = {{ marginBottom: '20px' }}>
                <label style = {{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '10px',
                  color: 'var(--text-medium)'
                }}>
                  Order
                </label>
                <input
                  type = "number"
                  className="retro-input"
                  value = {formData.order}
                  onChange={(e) => setFormData({
                    ...formData, order: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div style = {{
                padding: '15px',
                background: 'rgba(59,130,246,0.1)',
                border: '2px solid var(--bright-blue)',
                marginBottom: '20px',
                fontSize: '10px'
              }}>
                <strong>XP Reward System</strong>
                <div style = {{ marginTop: '10px' }}>
                  MANDATORY Question:
                  <strong>100 XP</strong><br />
                  BONUS Questions:
                  <strong>50 XP each</strong><br />
                  TOTAL Possible:
                  <strong>100-300 XP</strong>
                </div>
              </div>

              {/* Questions Section */}
              <div style = {{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '12px',
                  marginBottom: '15px',
                  color: 'var(--primary-navy)'
                }}>
                  Questions
                </h4>

                {formData.questions.map((question, qIndex) => (
                  <div 
                    key = {qIndex}
                    style = {{
                      marginBottom: '20px',
                      padding: '15px',
                      border: `2px solid ${qIndex === 0 ? 'var(--orange-accent)' : 'var(--border-color)'}`,
                      background: qIndex === 0 ? 'rgba(249,115,22,0.05)' : 'var(--bg-light)'
                    }}
                  >
                    <div style = {{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <h5 style={{
                        fontSize: '11px',
                        color: 'var(--primary-navy)'
                      }}>
                        {qIndex === 0 ? 'Mandatory Question' : `Bonus Question ${qIndex}`}
                        {qIndex === 0 && <span style={{
                          color: 'var(--orange-accent)',
                          marginLeft: '10px'
                        }}>(100 XP)</span>}
                        {qIndex > 0 && <span style={{
                          color: 'var(--success-green)',
                          marginLeft: '10px'
                        }}>(50 XP)</span>}
                      </h5>
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <label style = {{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '9px',
                          color: 'var(--text-medium)'
                        }}>
                          Question Text
                        </label>
                        <input
                          type="text"
                          className="retro-input"
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          required
                        />
                    </div>

                    <div style = {{ marginBottom: '15px' }}>
                        <label style = {{
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
                          <input type = "radio"
                            checked = {question.correctAnswer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)} />
                          <input type = "text"
                            className="retro-input"
                            value = {option}
                            onChange = {(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            required
                            style={{ flex: 1 }}
                          />
                          <span style = {{ fontSize: '8px', color: 'var(--text-light)' }}>
                            {question.correctAnswer === oIndex ? 'Correct' : ''}
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
                        <textarea className="retro-input"
                          value={question.explanation || ''}
                          onChange = {(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                          placeholder="correct answer explanation"
                          rows = "2"
                          style = {{ fontSize: '10px' }}
                        />
                    </div>
                  </div>
                ))}
              </div>

              <button type = "submit" className="retro-btn" style={{ width: '100%' }}>
                {editingTopic ? 'Update Topic' : 'Create Topic' }
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Topics List */}
      <div className = "retro-card">
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
                <tr style={{ borderBottom: '2px solid var(--border-color)'}}>
                  <th style = {{ padding: '10px', textAlign: 'left' }}>
                    Order
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Title
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Questions
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    XP Range
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Status
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key = {topic._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style = {{ padding: '10px' }}>
                      {topic.order}
                    </td>
                    <td style = {{ padding: '10px', fontWeight: 'bold' }}>
                      {topic.title}
                    </td>
                    <td style = {{ padding: '10px' }}>
                      {topic.questions?.length || 0}
                    </td>
                    <td style = {{
                      padding: '10px',
                      color: 'var(--success-green)'
                    }}>
                      100-300 XP
                    </td>
                    <td style = {{ padding: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        background: topic.isActive ? 'var(--success-green)' : 'var(--error-red)',
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 'bold'
                      }}
                      >
                        {topic.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td style = {{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => handleEdit(topic)}
                        className="retro-btn secondary"
                        style={{ 
                          fontSize: '8px',
                          padding: '5px 10px',
                          marginRight: '5px'
                        }}>
                          Edit
                        </button>
                        <button onClick={() => handleToggle(topic._id)}
                          className="retro-btn"
                          style = {{
                            fontSize: '8px',
                            padding: '5px 10px',
                            background: topic.isActive ? 'var(--error-red)' : 'var(--success-green)'
                          }}>
                            {topic.isActive ? 'Disable' : 'Enable'}
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