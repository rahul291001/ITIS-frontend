import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Cypher = (password) => {
  // Implement your encryption logic here
  return CryptoJS.AES.encrypt(password, 'secretKey').toString();
};

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: encryptedPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setError('');
        setTimeout(() => {
          navigate('/login'); // Redirect to login after 3 seconds
        }, 3000);
      } else {
        setError(result.message);
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Reset Password</button>
        </div>
      </form>
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ResetPassword;
