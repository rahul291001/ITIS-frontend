import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/resetPassword';
import LoginPage from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup'; 
import ForgotPassword from './components/forgot-password';
import { UserProvider } from './components/UserContext';
import UploadBook from './components/UploadBook';
import AdminUserList from './components/adminUserList';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 
          
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/upload-book" element={<UploadBook />} />
          <Route path="/all-users" element={<AdminUserList />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
