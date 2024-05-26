import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const secretKey = "7a8e0b7d5f6c3a919a8b7c8f4a9d3b0e1f2a7c6d8b9e0f1a3c4d6b8e7f0a9c5";

const Cypher = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    lowercase: false,
    uppercase: false,
    digit: false,
    specialChar: false,
    length: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
      updatePasswordStrength(value);
    } else if (name === 'verifyPassword') {
      setVerifyPassword(value);
    }
  };

  const updatePasswordStrength = (password) => {
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const digit = /\d/.test(password);
    const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const length = password.length >= 8;

    setPasswordStrength({
      lowercase,
      uppercase,
      digit,
      specialChar,
      length,
    });
  };

  const isAllRequirementsMet = () => {
    return (
      Object.values(passwordStrength).every((value) => value) && password === verifyPassword
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('Invalid or missing token');
      return;
    }
    try {
      const encryptedPassword = Cypher(password);
      const response = await axios.post(`http://localhost:1337/api/user/reset-password`, {
        token: token,
        password: encryptedPassword 
      });

      if (response.ok) {
        setMessage(response.data.message);
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message);
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h1>Reset Your Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          <label htmlFor="verifyPassword">Verify Password</label>
          <input
            type="password"
            id="verifyPassword"
            name="verifyPassword"
            value={verifyPassword}
            onChange={handleChange}
            required
          />
          <div>
            <p>Password Strength:</p>
            <ul>
              <li style={{ color: passwordStrength.lowercase ? 'green' : 'red' }}>It should contain atleast one lowercase</li>
              <li style={{ color: passwordStrength.uppercase ? 'green' : 'red' }}>It should contain atleast one uppercase</li>
              <li style={{ color: passwordStrength.digit ? 'green' : 'red' }}>It should contain atleast one digit</li>
              <li style={{ color: passwordStrength.specialChar ? 'green' : 'red' }}>It should contain atleast one special character</li>
              <li style={{ color: passwordStrength.length ? 'green' : 'red' }}>Minimum length (8 characters)</li>
            </ul>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" disabled={!isAllRequirementsMet()}>Reset Password</button>
        </div>
        
      </form>
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ResetPassword;
