import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
import { Link } from 'react-router-dom';


async function fetchUserData(userId) {
  try {
    console.log('Fetching user data for userId:', userId); // Log the userId
    const response = await axios.get(`http://localhost:1337/api/user/data/${userId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const userData = response.data.user;
      return userData;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

async function handleLogout() {
    try {
      const response = await fetch('http://localhost:1337/api/user/logout', {
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
  }
  

function Dashboard() {
    const { user } = useContext(UserContext); // Access user data from context
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
    const [books, setBooks] = useState([]); // State to store books
    const baseURL = process.env.REACT_APP_BASE_URL; // Ensure this is set in your .env file

    useEffect(() => {
      const userId = localStorage.getItem('user'); // Get user ID from local storage
      if (userId) {
        const sanitizedUserId = userId.replace(/"/g, ''); // Remove quotation marks from userId
        fetchUserData(sanitizedUserId)
          .then((data) => {
            setUserData(data);
            setIsAdmin(data.isAdmin); // Set isAdmin state based on user data
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`http://localhost:1337/api/books`, { withCredentials: true });
                setBooks(res.data.books);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBooks();
    }, [baseURL]);

    if (!userData) {
      return null;
    }
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
          
          {isAdmin &&(
            <div>
                <Link to ="/upload-book">Upload a book</Link><br></br>
                <Link to ="/all-users">List of User</Link>
            </div>
            
          )}
          <div className="container">
            <div className="logout-container">
              <button onClick={handleLogout}>Logout</button>
            </div>
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
        </div>
    );
}

export default Dashboard;
