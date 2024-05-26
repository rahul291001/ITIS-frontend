import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './adminHeader';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // State for error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/user/all`, { withCredentials: true });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.'); // Set error message
      }
    };

    fetchData();
  }, []);

  const handleToggleAdmin = async (userId) => {
    // Retrieve isAdmin status from local storage
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    // Check if the user is an admin
    if (!isAdmin) {
      console.error('User is not authorized to perform this action.');
      return;
    }

    setError(null); // Clear any previous error before update
    try {
      // Update user's isAdmin status (optimistic update)
      const updatedUser = { ...users.find(user => user.id === userId), isAdmin: !isAdmin };
      setUsers(users.map(user => (user.id === userId ? updatedUser : user)));

      // Send PUT request to backend API
      await axios.put(`http://localhost:1337/api/user/${userId}`, { isAdmin: !isAdmin }, { withCredentials: true });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError('Failed to update admin status. Please try again.'); // Set error message
    }
  };

  // If user is not an admin, return null to render nothing
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <h2>Admin User List</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message if present */}
      <table>
        <div>
            <Header />
        </div>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
        {users.map(user => (
          <tr key={user._id}> {/* Assuming the user ID property is named "_id" */}
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.isAdmin ? 'Admin' : 'User'}</td>
            <td>
              <button onClick={() => handleToggleAdmin(user._id)}> {/* Pass user._id */}
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
