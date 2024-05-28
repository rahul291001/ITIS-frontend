import React, { useState } from 'react';
import axios from 'axios'; // for making API requests
import { Link } from 'react-router-dom';
import '../css/forgot-password.css'


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost:1337/api/user/forgot-password`, { email });
      setMessage("Please check your Email to reset your password.");
      setError(null);
    } catch (error) {
      console.error(error);
      setMessage('');
      setError('Error sending request. Please try again.');
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="links">
        <Link to="/">Login?</Link>
        <Link to="/signup">New Customer? Sign Up</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;