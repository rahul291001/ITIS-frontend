import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './adminHeader';

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAdmin(userData.isAdmin);
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:1337/api/books', { withCredentials: true });
        setBooks(res.data.books);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:1337/api/books/${bookId}`, { withCredentials: true });
      setBooks(books.filter(book => book._id !== bookId));
      alert('Book deleted successfully');
    } catch (err) {
      console.error('Failed to delete book:', err);
      alert('Failed to delete book');
    }
  };

  return (
    <div>
      <Header isAdmin={isAdmin} />
      <h2 className="dashboard-header">Welcome to the Dashboard</h2>
      
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Publication Date</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publisher</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id}>
              <td>{index + 1}</td>
              <td>{book.bookTitle}</td>
              <td>{book.yearPublication}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.description}</td>
              <td>
                <a href={`http://localhost:1337/api/books/download/${book._id}`}>Download {book.file}</a>
              </td>
              <td>
                {isAdmin && (
                  <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
