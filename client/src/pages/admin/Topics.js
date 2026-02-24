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
    videoUrl: '',
    videoDuration: 0,
    order: 1,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 10
      }
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
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least 1 question
    if (formData.questions.length === 0) {
      alert('Topic must have at least one question');
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
      resetForm();
      fetchTopics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving topic');
    }
  };

  const handleToggleActive = async (topicId) => {
    try {
      await api.put(`/admin/topics/${topicId}/toggle`);
      fetchTopics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error toggling topic status');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description,
      videoUrl: topic.videoUrl,
      videoDuration: topic.videoDuration,
      order: topic.order,
      questions: topic.questions,
      isActive: topic.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      videoDuration: 0,
      order: 1,
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 10
        }
      ],
      isActive: true
    });
    setEditingTopic(null);
    setShowForm(false);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 10
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      alert('Topic must have at least one question');
      return;
    }
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">LOADING TOPICS...</div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '0' }}>
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neon-text"
        style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-navy)' }}
      >
        📚 TOPIC MANAGEMENT
      </motion.h1>

      <button onClick={() => setShowForm(!showForm)} className="retro-btn" style={{ marginBottom: '30px' }}>
        {showForm ? 'CANCEL' : 'CREATE TOPIC'}
      </button>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="retro-card" style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--secondary-pink)', marginBottom: '20px' }}>
            {editingTopic ? 'EDIT TOPIC' : 'CREATE NEW TOPIC'}
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>TITLE</label>
              <input type="text" className="retro-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>DESCRIPTION</label>
              <textarea className="retro-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" required />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>VIDEO URL (YouTube Embed)</label>
              <input type="text" className="retro-input" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>VIDEO DURATION (seconds)</label>
                <input type="number" className="retro-input" value={formData.videoDuration} onChange={(e) => setFormData({ ...formData, videoDuration: parseInt(e.target.value) })} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--text-medium)' }}>ORDER</label>
                <input type="number" className="retro-input" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} required />
              </div>
            </div>

            {/* Fixed Values Display */}
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid var(--bright-blue)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                FIXED VALUES (Cannot be changed):
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary-navy)' }}>
                <strong>XP Reward:</strong> 100 XP | <strong>Passing Score:</strong> 70%
              </div>
            </div>

            {/* Questions */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-medium)' }}>QUESTIONS (minimum 1 required)</label>
                <button type="button" onClick={addQuestion} className="retro-btn" style={{ fontSize: '9px', padding: '6px 12px' }}>
                  ➕ ADD QUESTION
                </button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} style={{ marginBottom: '20px', padding: '15px', border: '2px solid var(--border-color)', background: 'var(--bg-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--primary-navy)' }}>QUESTION {qIndex + 1}</h4>
                    <button type="button" onClick={() => removeQuestion(qIndex)} className="retro-btn danger" style={{ fontSize: '8px', padding: '5px 10px' }}>
                      ✖ DELETE
                    </button>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '9px', color: 'var(--text-medium)' }}>QUESTION TEXT</label>
                    <input type="text" className="retro-input" value={question.question} onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)} required />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '9px', color: 'var(--text-medium)' }}>OPTIONS</label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="radio" checked={question.correctAnswer === oIndex} onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)} />
                        <input type="text" className="retro-input" value={option} onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} required style={{ flex: 1 }} />
                        <span style={{ fontSize: '8px', color: 'var(--text-light)' }}>{question.correctAnswer === oIndex ? '✓ CORRECT' : ''}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '9px', color: 'var(--text-medium)' }}>POINTS</label>
                    <input type="number" className="retro-input" value={question.points} onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))} min="1" required />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="retro-btn" style={{ flex: 1 }}>{editingTopic ? 'UPDATE TOPIC' : 'CREATE TOPIC'}</button>
              <button type="button" onClick={resetForm} className="retro-btn secondary" style={{ flex: 1 }}>✖ CANCEL</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Topics List */}
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--primary-navy)' }}>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>ORDER</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>TITLE</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>XP</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>PASS %</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>QUESTIONS</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>STATUS</th>
              <th style={{ padding: '10px', color: 'white', background: 'var(--primary-navy)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic._id} style={{ borderBottom: '1px solid var(--border-color)', opacity: topic.isActive ? 1 : 0.5 }}>
                <td style={{ padding: '10px' }}>{topic.order}</td>
                <td style={{ padding: '10px', color: 'var(--primary-navy)', fontWeight: 'bold' }}>{topic.title}</td>
                <td style={{ padding: '10px', color: 'var(--orange-accent)' }}>{topic.xpReward}</td>
                <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>{topic.passingScore}%</td>
                <td style={{ padding: '10px' }}>{topic.questions.length}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '5px 10px',
                    background: topic.isActive ? 'var(--success-green)' : 'var(--error-red)',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    borderRadius: '2px'
                  }}>
                    {topic.isActive ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleEdit(topic)} className="retro-btn secondary" style={{ fontSize: '8px', padding: '5px 10px' }}>✎ EDIT</button>
                    <button onClick={() => handleToggleActive(topic._id)} className="retro-btn" style={{
                      fontSize: '8px',
                      padding: '5px 10px',
                      background: topic.isActive ? 'var(--error-red)' : 'var(--success-green)',
                      borderColor: topic.isActive ? '#DC2626' : '#059669'
                    }}>
                      {topic.isActive ? 'DISABLE' : 'ENABLE'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Topics;