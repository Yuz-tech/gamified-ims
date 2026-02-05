import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setisAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const setAuth = (boolean) => {
    setisAuthenticated(boolean);
  };

  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return(
    <Router>
      <div className="App retro-bg">
        <Routes>
          <Route path = "/" element = { isAuthenticated ? <Navigate to="/home" /> : <Navigate to = "/login" /> } />
          <Route path = "/login" element = {
            <Login setAuth={setAuth}
            setUserData={setUserData}
            />
          }
          />
          <Route path = "/register" element={
            <Register setAuth={setAuth} 
            setUserData={setUserData} 
            />
          }
          />
          <Route path = "/home" element={
            isAuthenticated ? (
              <div className="container mt-5">
                <h1>Konnichiwa, {user?.username}!</h1>
                <p>Your XP: {user?.xp} | Level: {user?.level} </p>
                <button className = "btn btn-warning" onClick={() =>{
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setisAuthenticated(false);
                  setUser(null);
                }}>Logout</button>
              </div>
            ) : (
              <Navigate to="/login"></Navigate>
            )
          }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;