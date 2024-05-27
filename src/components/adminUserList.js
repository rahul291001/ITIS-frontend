import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './adminHeader';
import '../css/adminUserList.css'
function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // State for error message
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    // Retrieve isAdmin status from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAdmin(userData.isAdmin); // Set isAdmin state based on local storage
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:1337/api/user/all`, { withCredentials: true });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.'); // Set error message
      }
    };

    fetchData();
  }, []);

  const handleToggleAdmin = async (userId) => {
    if (!isAdmin) {
      console.error('User is not authorized to perform this action.');
      return;
    }
  
    setError(null); // Clear any previous error before update
    try {
      // Update user's isAdmin status (optimistic update)
      const updatedUser = { ...users.find(user => user._id === userId), isAdmin: !isAdmin };
      setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
  
      // Send PUT request to backend API
      await axios.put(`https://localhost:1337/api/user/${userId}`, { isAdmin: !isAdmin }, { withCredentials: true });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError('Failed to update admin status. Please try again.'); // Set error message
    }
  };

  return (
    <div className="admin-user-list">
      <Header isAdmin={isAdmin} /> {/* Pass isAdmin prop to Header component */}
      <h2>Admin User List</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message if present */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}> {/* Assuming the user ID property is named "_id" */}
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Admin' : 'User'}</td>
              <td>
                <button onClick={() => handleToggleAdmin(user._id, user.isAdmin)}>
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserList;
