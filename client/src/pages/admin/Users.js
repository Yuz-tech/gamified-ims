import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [password, setPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, []);

  useEffect(() => {
  if (searchTerm) {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  } else {
    setFilteredUsers(users);
  }
}, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/admin/pending-users');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleApproveUser = async (userId) => {
    if (!password) {
      alert('Please enter a password');
      return;
    }

    try {
      await api.post(`/admin/approve-user/${userId}`, { password });
      alert('User approved and email sent!');
      setShowApproveModal(null);
      setPassword('');
      fetchUsers();
      fetchPendingUsers();
      
      
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      alert('User created and email sent!');
      setFormData({ username: '', email: '', password: '', role: 'employee' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id}`, editingUser);
      alert('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className="loading neon-text">LOADING USERS...</div>
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
        👥 USER MANAGEMENT
      </motion.h1>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="retro-btn"
        style={{ marginBottom: '30px' }}
      >
        {showCreateForm ? '✖ CANCEL' : '➕ CREATE USER'}
      </button>

      {/* Create User Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card"
          style={{ marginBottom: '40px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--sky-blue)', marginBottom: '20px' }}>
            CREATE NEW USER
          </h3>
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                USERNAME
              </label>
              <input
                type="text"
                className="retro-input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                EMAIL
              </label>
              <input
                type="email"
                className="retro-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                PASSWORD
              </label>
              <input
                type="text"
                className="retro-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                ROLE
              </label>
              <select
                className="retro-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="employee">EMPLOYEE</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
            <button type="submit" className="retro-btn">
              CREATE USER
            </button>
          </form>
        </motion.div>
      )}

      {/* Pending Users */}
      {pendingUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="retro-card"
          style={{ marginBottom: '40px' }}
        >
          <h3 style={{ fontSize: '14px', color: 'var(--sky-blue)', marginBottom: '20px' }}>
            ⏳ PENDING REQUESTS ({pendingUsers.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--orange-accent)' }}>
                  <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>USERNAME</th>
                  <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>EMAIL</th>
                  <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>REQUESTED</th>
                  <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--grid-color)' }}>
                    <td style={{ padding: '10px', color: 'var(--light-blue)' }}>{user.username}</td>
                    <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>{user.email}</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--sky-blue)' }}>
                      {new Date(user.requestedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => setShowApproveModal(user)}
                        className="retro-btn"
                        style={{ fontSize: '8px', padding: '5px 10px' }}
                      >
                        ✓ APPROVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* All Users */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="retro-card"
      >
        <h3 style={{ fontSize: '14px', color: 'var(--sky-blue)', marginBottom: '20px' }}>
          ALL USERS ({users.length})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bright-blue)' }}>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>USERNAME</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)', textAlign: 'left' }}>EMAIL</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>ROLE</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>LEVEL</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>XP</th>
                <th style={{ padding: '10px', color: 'var(--orange-accent)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--grid-color)' }}>
                  <td style={{ padding: '10px', color: 'var(--light-blue)' }}>{user.username}</td>
                  <td style={{ padding: '10px', color: 'var(--bright-blue)' }}>{user.email}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: user.role === 'admin' ? 'var(--orange-accent)' : 'var(--light-blue)' }}>
                    {user.role.toUpperCase()}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--sky-blue)' }}>{user.level}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--light-blue)' }}>{user.xp}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="retro-btn secondary"
                      style={{ fontSize: '8px', padding: '5px 10px', marginRight: '5px' }}
                    >
                      ✎ EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="retro-card pixel-corners" style={{ maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '20px' }}>
              APPROVE USER: {showApproveModal.username}
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                SET PASSWORD
              </label>
              <input
                type="text"
                className="retro-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleApproveUser(showApproveModal._id)}
                className="retro-btn"
                style={{ flex: 1 }}
              >
                ✓ APPROVE & SEND EMAIL
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(null);
                  setPassword('');
                }}
                className="retro-btn secondary"
                style={{ flex: 1 }}
              >
                ✖ CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="retro-card pixel-corners" style={{ maxWidth: '500px', width: '100%', margin: '20px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--orange-accent)', marginBottom: '20px' }}>
              EDIT USER: {editingUser.username}
            </h3>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  USERNAME
                </label>
                <input
                  type="text"
                  className="retro-input"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  className="retro-input"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  ROLE
                </label>
                <select
                  className="retro-input"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="employee">EMPLOYEE</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  XP
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={editingUser.xp}
                  onChange={(e) => setEditingUser({ ...editingUser, xp: parseInt(e.target.value) })}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '10px', color: 'var(--light-blue)' }}>
                  LEVEL
                </label>
                <input
                  type="number"
                  className="retro-input"
                  value={editingUser.level}
                  onChange={(e) => setEditingUser({ ...editingUser, level: parseInt(e.target.value) })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                  💾 SAVE
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="retro-btn secondary"
                  style={{ flex: 1 }}
                >
                  ✖ CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default Users;