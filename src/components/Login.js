import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";
import { UserContext } from './UserContext'; 
import '../css/Login.css';
function LoginPage() {
  const { updateUser } = useContext(UserContext); 

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

      const secretKey = '7a8e0b7d5f6c3a919a8b7c8f4a9d3b0e1f2a7c6d8b9e0f1a3c4d6b8e7f0a9c5'; 
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/login`,
        { username, password: encryptedPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data.user;
        const userToStore = {
          userId: userData._id, 
          isAdmin: userData.isAdmin
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        updateUser(userToStore);
        
        window.location.href = '/dashboard';
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred.';
      setError(errorMessage);
    }
  };

  return (
    <div className="login-form">
    <h2>Login Form</h2>
    {error && <div className="error-message">{error}</div>}
    <div className="form-group">
      <label>Username:</label>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
      />
    </div>
    <div className="form-group">
      <label>Password:</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
    </div>
    <div className="space-below">
      <ReCAPTCHA
        sitekey="6LeBu9IpAAAAAK1WnYGciKqBRDPVW_GRp0blwf5X"
        onChange={onChange}
      />
    </div>
    <div>
      <button onClick={handleLogin} disabled={!captchaVerified}>Login</button>
    </div>
    <Link className="link" to="/signup">Sign Up</Link> <br />
    <Link className="link" to="/forgot">Forgot Password?</Link>
  </div>
  );
}

export default LoginPage;