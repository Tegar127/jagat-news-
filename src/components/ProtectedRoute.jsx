// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Jika pengguna tidak login, arahkan ke halaman utama, bukan /login
        return <Navigate to="/" />;
    }

    // Jika sudah login, tampilkan komponen yang diminta
    return children;
};

export default ProtectedRoute;