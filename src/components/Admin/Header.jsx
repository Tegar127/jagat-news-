// tegar127/jagat-news/jagat-news-484ca85cf68061a08fe7435d5b0a49863b94f172/src/components/Admin/Header.jsx

import React, { useState } from 'react';
import { Menu, Bell, UserCircle, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none lg:hidden">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-4 hidden sm:block">Jagat News Admin</h1>
            </div>

            <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input type="text" placeholder="Cari..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                    <Bell size={20} />
                </button>
                
                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center">
                            {user && user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-blue-500" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            )}
                            <div className="ml-2 text-left hidden sm:block">
                                <p className="font-medium text-sm text-gray-800 dark:text-white">{user ? user.name : 'Admin'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user ? user.role : 'Administrator'}</p>
                            </div>
                            <ChevronDown size={16} className="ml-1 text-gray-500 dark:text-gray-400" />
                        </div>
                    </button>
                    
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                            <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <UserCircle size={16} className="mr-2" />
                                Profil
                            </Link>
                            <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Settings size={16} className="mr-2" />
                                Pengaturan
                            </Link>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <LogOut size={16} className="mr-2" />
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;