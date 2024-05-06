import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      const response = await axios.post("http://localhost:1337/api/user/register", formData, {
        withCredentials: true, 
      });
      if (response.data.success) {
       
        console.log("Registration successful");
       
        window.location.href = "/login";
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
      <Link to="/login">Login</Link> 
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;
