import React, { useState } from 'react';
import axios from 'axios'; // for making API requests
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:1337/api/user/forgot-password`, { email });
      setMessage(response.data.message);
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
    <div>
        <Link to ="/">Login?</Link>
        <Link to ="/signup">New Cistomer? SignUp</Link>
    </div>
  </div>
  );
};

export default ForgotPassword;
