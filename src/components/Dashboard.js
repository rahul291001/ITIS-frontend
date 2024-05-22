import React, { useEffect } from 'react';


async function handleLogout() {
  try {
    const response = await fetch('http://localhost:1337/api/user/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    window.location.href = '/';
    
    if (response.ok) {
      console.log('Logged out successfully');
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


//   useEffect(() => {
//     if (!user) {
//       console.log('Debug mode: Skipping redirection to login page.');
//       window.location.href = '/'; // Redirect to login page if user data is not available
//     } else {
//       console.log('Debug mode: User data available:', user);
//     }
//   }, [user]);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
