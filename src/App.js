import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/resetPassword';
import LoginPage from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import ForgotPassword from './components/forgot-password';
import { UserProvider, UserContext } from './components/UserContext';
import UploadBook from './components/UploadBook';
import AdminUserList from './components/adminUserList';

function App() {
  const { isLoggedIn } = useContext(UserContext);


  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <LoginPage />} />
          <Route path="/upload-book" element={isLoggedIn ? <UploadBook /> : <LoginPage />} />
          <Route path="/all-users" element={isLoggedIn ? <AdminUserList /> : <LoginPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
