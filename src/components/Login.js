import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const onChange = (value) => {
    setCaptchaVerified(true); 
  };

  const handleLogin = async () => {
    try {
      if (!captchaVerified) {
        setError('Please verify the reCAPTCHA.');
        return;
      }

      const secretKey = '7a8e0b7d5f6c3a919a8b7c8f4a9d3b0e1f2a7c6d8b9e0f1a3c4d6b8e7f0a9c5'; // Use the same key for encryption
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      const response = await axios.post(
        'http://localhost:1337/api/user/login',
        { username, password: encryptedPassword },
        { withCredentials: true }
      );
      console.log("Data sent to backend:", { username, password: encryptedPassword });
      console.log(response)
      
      if (response.status !== 200) {
        throw new Error('Login failed. Please check your credentials.');
      }

      

      
      window.location.href = '/dashboard';
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred.';
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      <div>
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <ReCAPTCHA
        sitekey="6LeBu9IpAAAAAK1WnYGciKqBRDPVW_GRp0blwf5X"
        onChange={onChange}
      />
      <div>
        <button onClick={handleLogin} disabled={!captchaVerified}>Login</button>
      </div>
      <Link to="/signup">Sign Up</Link> 
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default LoginPage;
