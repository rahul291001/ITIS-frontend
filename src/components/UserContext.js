// UserContext.js
import React, { createContext, useEffect, useState } from 'react';


export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to update user
  const updateUser = (userData) => {
    setUser(userData);
    // Update local storage with new user data
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
