import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Achievements from './pages/Achievements';
import Dashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTopics from './pages/admin/Topics';
import AdminBadges from './pages/admin/Badges';
import './styles/retro.css';
import YearlyReset from './pages/admin/YearlyReset';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="loading neon-text">LOADING...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

const AdminLayout = ({ children }) => {
  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <NavLink to="/admin" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          DASHBOARD
        </NavLink>
        <NavLink to="/admin/users" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          USERS
        </NavLink>
        <NavLink to="/admin/topics" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          TOPICS
        </NavLink>
        <NavLink to="/admin/badges" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          BADGES
        </NavLink>
        <NavLink to="/admin/logs" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          LOGS
        </NavLink>
        <NavLink to="/admin/yearl-reset" className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 15px' }}>
          RESET
        </NavLink>
      </div>
      {children}
    </div>
  );
};

const { NavLink } = require('react-router-dom');

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/topics" 
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/topics/:topicId" 
          element={
            <ProtectedRoute>
              <TopicDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/topics" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminTopics />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/badges" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminBadges />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/yearly-reset"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <YearlyReset />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;