// src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
// HAPUS: import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HAPUS WRAPPER GoogleOAuthProvider */}
    <App />
  </React.StrictMode>,
);