import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAdmin }) => {
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

  return (
    <header>
      {isAdmin && (
        <div>
          <Link to="/dashboard">Dashboard</Link><br />
          <Link to="/upload-book">Upload a book</Link><br />
          <Link to="/all-users">List of Users</Link>
        </div>
      )}
      <div className="container">
        <div className="logout-container">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
