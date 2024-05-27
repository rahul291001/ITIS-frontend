import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/adminHeader.css'

const Header = ({ isAdmin }) => {
  useEffect(() => {
    // Check if the user is an admin
    if (isAdmin) {
      console.log('User is an admin');
      // You can perform any admin-related actions here
    }
  }, [isAdmin]); // Run the effect whenever isAdmin changes

  async function handleLogout() {
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
  }

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="nav-links">
          {isAdmin && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/upload-book">Upload a book</Link>
              <Link to="/all-users">List of Users</Link>
            </>
          )}
        </div>
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
