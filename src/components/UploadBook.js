import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./adminHeader";
import '../css/UploadBook.css'
const UploadBook = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [yearPublication, setYearPublication] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // Ensure file is null initially
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload success
  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    // Check if the user is an admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log("User found in local storage:", user); // Debugging log
      setIsAdmin(user.isAdmin);
    } else {
      console.log("No user found in local storage");
      setIsAdmin(false); // Explicitly set to false if no user is found
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://localhost:1337/api/user/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Logged out successfully');
        // Clear user data from localStorage
        localStorage.removeItem('user');
        
        // Redirect to the home page
        window.location.href = '/';
        
        // Close WebSocket connection if it exists
        if (window.webSocketConnection) {
          window.webSocketConnection.close();
          console.log('WebSocket connection closed');
        }
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bookTitle", bookTitle);
    formData.append("yearPublication", yearPublication);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await axios.post(`https://localhost:1337/api/books/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      setUploadSuccess(true);
      setError(""); // Clear error message on successful upload
    } catch (err) {
      console.error(err);
      setError('Failed to upload book. Please try again.'); // Set error message
    }
  };

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show a loading indicator while checking admin status
  }

  // Render message if user is not an admin
  if (!isAdmin) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="form-container">
      <Header isAdmin={isAdmin} handleLogout={handleLogout} />
      <h2>Upload Book</h2>
      {uploadSuccess && <div className="success-message">Book uploaded successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      <form id="bookForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Book Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year of Publication:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={yearPublication}
            onChange={(e) => setYearPublication(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="publisher">Publisher:</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Description:</label>
          <textarea
            id="desc"
            name="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload File:</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBook;