import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Achievements from './pages/Achievements';
import Players from './pages/Players';
import Games from './pages/Games';
import GameRouter from './pages/games/GameRouter';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTopics from './pages/admin/Topics';
import ActivityLogs from './pages/admin/ActivityLogs';
import Analytics from './pages/admin/Analytics';
import YearlyReset from './pages/admin/YearlyReset';
import Tamago from './pages/Tamago';
import './styles/retro.css';

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
        <NavLink to="/admin" end style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              DASHBOARD
            </button>
          )}
        </NavLink>
        
        <NavLink to="/admin/users" style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              USERS
            </button>
          )}
        </NavLink>
        
        <NavLink to="/admin/topics" style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              TOPICS
            </button>
          )}
        </NavLink>
        
        <NavLink to="/admin/logs" style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              LOGS
            </button>
          )}
        </NavLink>

        <NavLink to="/admin/Analytics" style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              ANALYTICS
            </button>
          )}
        </NavLink>
        
        <NavLink to="/admin/yearly-reset" style={({ isActive }) => ({ textDecoration: 'none' })}>
          {({ isActive }) => (
            <button className={isActive ? "retro-btn" : "retro-btn secondary"} style={{ fontSize: '10px', padding: '8px 15px' }}>
              RESET
            </button>
          )}
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
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
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
        <Route
          path="/games/:gameId"
          element={
            <ProtectedRoute>
              <GameRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
                <Games />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players"
          element={
            <ProtectedRoute>
                <Players />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/驚き"
          element={
            <ProtectedRoute>
              <Tamago />
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
          path="/admin/logs" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <ActivityLogs />
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
        <Route
          path="/admin/Analytics"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />        
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ProtectedRoute>
        <Footer />
      </ProtectedRoute>
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