// File: src/layouts/AdminLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Header from '../components/Admin/Header';
import { Moon, Sun } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        // Terapkan tema ke elemen root HTML
        document.documentElement.setAttribute('data-theme', theme);
        // Tambahkan atau hapus class 'dark' pada document.documentElement
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Simulasi loading untuk transisi halus
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <div className="fixed bottom-6 right-6 z-50">
                    <button 
                        onClick={toggleTheme} 
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                        title={theme === 'light' ? 'Aktifkan Dark Mode' : 'Aktifkan Light Mode'}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5 text-gray-800" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                    </button>
                </div>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 pb-16 transition-all duration-300">
                    <div className="max-w-7xl mx-auto w-full animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;