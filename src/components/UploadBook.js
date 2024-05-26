import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadBook = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [yearPublication, setYearPublication] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload success
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    // Check if the user is an admin
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    setIsAdmin(isAdmin);
  }, []);

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
      const res = await axios.post(`http://localhost:1337/api/books/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to upload book. Please try again.'); // Set error message
    }
  };

  // Render blank page if user is not an admin
  if (!isAdmin) {
    return null;
  }

 

  return (
    <div className="form-container">
      <h2>Book Form</h2>
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
          <label htmlFor="year">Book Year Publication:</label>
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
          <label htmlFor="author">Book Author:</label>
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
          <label htmlFor="publisher">Book Publisher:</label>
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
          <label htmlFor="location">Upload File:</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBook;
