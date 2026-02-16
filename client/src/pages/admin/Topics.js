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
    order: 0,
    xpReward: 100,
    passingScore: 70,
    questions: [],
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

  const handleDelete = async (topicId) => {
    if (!window.confirm('Are you sure? This will also delete the associated badge!')) return;

    try {
      await api.delete(`/admin/topics/${topicId}`);
      alert('Topic deleted successfully');
      fetchTopics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting topic');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData(topic);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      videoDuration: 0,
      order: 0,
      xpReward: 100,
      passingScore: 70,
      questions: [],
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

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className="loading neon-text">LOADING TOPICS...</div>
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
        style={{ 
          fontSize: '28px', 
          marginBottom: '40px',
          textAlign: 'center',
          color: 'var(--orange-accent)'
        }}
      >
        📚 TOPIC MANAGEMENT
      </motion.h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="retro-btn"
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✖ CANCEL' : '➕ CREATE TOPIC'}
      </button>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '40px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--sky-blue)', marginBottom: '20px' }}>
            {editingTopic ? 'EDIT TOPIC' : 'CREATE NEW TOPIC'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                TITLE
              </label>
              <input
                type="text"
                className="retro-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                DESCRIPTION
              </label>
              <textarea
                className="retro-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  VIDEO URL (YouTube Embed)
                </label>
                <input
                  type="text"
                  className="retro-input"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  VIDEO DURATION (seconds)
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={formData.videoDuration}
                  onChange={(e) => setFormData({ ...formData, videoDuration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  ORDER
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  XP REWARD
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  PASSING SCORE (%)
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  ACTIVE
                </label>
                <select
                  className="retro-input"
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">YES</option>
                  <option value="false">NO</option>
                </select>
              </div>
            </div>

            {/* Questions */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '10px', color: 'var(--light-blue)' }}>
                  QUIZ QUESTIONS
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="retro-btn secondary"
                  style={{ fontSize: '8px', padding: '5px 10px' }}
                >
                  ➕ ADD QUESTION
                </button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    padding: '15px',
                    border: '2px solid var(--bright-blue)',
                    marginBottom: '15px',
                    background: 'rgba(0, 255, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--orange-accent)' }}>
                      QUESTION {qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="retro-btn danger"
                      style={{ fontSize: '8px', padding: '3px 8px' }}
                    >
                      ✖ REMOVE
                    </button>
                  </div>

                  <input
                    type="text"
                    className="retro-input"
                    placeholder="Question text"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    style={{ marginBottom: '10px' }}
                    required
                  />

                  <div style={{ marginBottom: '10px' }}>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} style={{ marginBottom: '5px' }}>
                        <input
                          type="text"
                          className="retro-input"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '8px', color: 'var(--light-blue)' }}>
                        CORRECT ANSWER (0-3)
                      </label>
                      <input
                        type="number"
                        className="retro-input"
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', parseInt(e.target.value))}
                        min="0"
                        max="3"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '8px', color: 'var(--light-blue)' }}>
                        POINTS
                      </label>
                      <input
                        type="number"
                        className="retro-input"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                💾 {editingTopic ? 'UPDATE TOPIC' : 'CREATE TOPIC'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="retro-btn secondary"
                style={{ flex: 1 }}
              >
                ✖ CANCEL
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Topics List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
      >
        <h3 style={{ fontSize: '14px', color: 'var(--sky-blue)', marginBottom: '20px' }}>
          ALL TOPICS ({topics.length})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bright-blue)' }}>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>ORDER</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>TITLE</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>XP</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>PASSING</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>QUESTIONS</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>ACTIVE</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic._id} style={{ borderBottom: '1px solid var(--grid-color)' }}>
                  <td style={{ padding: '10px', color: 'var(--light-blue)' }}>{topic.order}</td>
                  <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>{topic.title}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--sky-blue)' }}>{topic.xpReward}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--light-blue)' }}>{topic.passingScore}%</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--orange-accent)' }}>{topic.questions.length}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: topic.isActive ? 'var(--bright-blue)' : 'var(--error-red)' }}>
                    {topic.isActive ? '✓' : '✗'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(topic)}
                      className="retro-btn secondary"
                      style={{ fontSize: '8px', padding: '5px 10px', marginRight: '5px' }}
                    >
                      ✎ EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="retro-btn danger"
                      style={{ fontSize: '8px', padding: '5px 10px' }}
                    >
                      ✖ DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Topics;