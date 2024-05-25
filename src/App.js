// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/resetPassword';
import LoginPage from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

import ForgotPassword from './components/forgot-password';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/"  element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<ResetPassword />}/>
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </Router>
   
  );
}

export default App;
