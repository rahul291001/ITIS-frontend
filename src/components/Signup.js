import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import '../css/Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    lowercase: false,
    uppercase: false,
    digit: false,
    specialChar: false,
    length: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      updatePasswordStrength(value);
    }
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const secretKey =
        "7a8e0b7d5f6c3a919a8b7c8f4a9d3b0e1f2a7c6d8b9e0f1a3c4d6b8e7f0a9c5";
      const encryptedPassword = CryptoJS.AES.encrypt(
        formData.password,
        secretKey
      ).toString();

      const encryptedFormData = {
        ...formData,
        password: encryptedPassword,
      };

      const response = await axios.post(
        "https://localhost:1337/api/user/register",
        encryptedFormData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("Registration successful");
        window.location.href = "/";
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="signup-form">
      <h2>Signup</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <ul className="password-strength">
            <li style={{ color: passwordStrength.lowercase ? 'green' : 'red' }}>
              Contains at least one lowercase letter
            </li>
            <li style={{ color: passwordStrength.uppercase ? 'green' : 'red' }}>
              Contains at least one uppercase letter
            </li>
            <li style={{ color: passwordStrength.digit ? 'green' : 'red' }}>
              Contains at least one digit
            </li>
            <li style={{ color: passwordStrength.specialChar ? 'green' : 'red' }}>
              Contains at least one special character
            </li>
            <li style={{ color: passwordStrength.length ? 'green' : 'red' }}>
              Is at least 8 characters long
            </li>
          </ul>
        </div>
        <button type="submit" disabled={!Object.values(passwordStrength).every(val => val)}>
          Signup
        </button>
      </form>
      <Link className="link" to="/">Login</Link>
    </div>
  );
};

export default Signup;