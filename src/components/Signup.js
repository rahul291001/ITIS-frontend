import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const secretKey = '7a8e0b7d5f6c3a919a8b7c8f4a9d3b0e1f2a7c6d8b9e0f1a3c4d6b8e7f0a9c5'; // Use the same key as on the backend
      const encryptedPassword = CryptoJS.AES.encrypt(formData.password, secretKey).toString();

     
      const encryptedFormData = {
        ...formData,
        password: encryptedPassword,
      };


      
      const response = await axios.post("http://localhost:1337/api/user/register", encryptedFormData, {
        withCredentials: true,
      });

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
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Signup</button>
      </form>
      <Link to="/">Login</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;
