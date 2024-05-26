// UserContext.js
import React, { createContext, useEffect, useState } from 'react';
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true); // Set login status to true if user data exists
    }
  }, []);

  // Function to update user
  const updateUser = (userData) => {
    setUser(userData);
    // Update local storage with new user data
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true); // Set login status to true after updating user
  };

  // Function to logout user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsLoggedIn(false); // Set login status to false after logout
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoggedIn, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
