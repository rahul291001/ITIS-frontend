import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Dashboard.css'

import Header from './adminHeader';

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAdmin(userData.isAdmin);
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`https://localhost:1337/api/books`, { withCredentials: true });
        setBooks(res.data.books);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) => {
      return (
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`https://localhost:1337/api/books/${bookId}`, { withCredentials: true });
      setBooks(books.filter((book) => book._id !== bookId));
      alert('Book deleted successfully');
    } catch (err) {
      console.error('Failed to delete book:', err);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="dashboard">
      <Header isAdmin={isAdmin} />
      <h2 className="dashboard-header">Welcome to the Dashboard</h2>
      <input
        type="text"
        placeholder="Search books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Publication Date</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Description</th>
            <th>Download</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr key={book._id}>
              <td>{index + 1}</td>
              <td>{book.bookTitle}</td>
              <td>{book.yearPublication}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.description}</td>
              <td>
                <a href={`${process.env.REACT_APP_BASE_URL}/api/books/download/${book._id}`}>Download {book.file}</a>
              </td>
              {isAdmin && (
                <td>
                  <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

