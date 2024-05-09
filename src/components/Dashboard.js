import React, { useEffect } from 'react';

import axios from 'axios';

async function handleLogout() {
    try {
        await axios.post('http://localhost:1337/api/user/logout');
        
        window.location.href = '/login';
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
}

function Dashboard() {
    useEffect(() => {
        const accessToken = document.cookie.indexOf('accessToken');
        if (!accessToken) {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
