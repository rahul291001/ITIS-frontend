import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup.js';
import LoginPage from './components/Login.js';
import Dashboard from './components/Dashboard.js';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
