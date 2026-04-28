import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Users, Tag, LogOut, X, Megaphone, Settings, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();

    // Array navLinks yang sudah diperbaiki
    const navLinks = [
        { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard", roles: ['ADMIN', 'ADMINISTRATOR'] },
        { to: "/admin/promo", icon: <Megaphone size={20} />, text: "Promo", roles: ['ADMIN', 'ADMINISTRATOR'] },
        { to: "/admin/berita", icon: <Newspaper size={20} />, text: "Berita", roles: ['ADMIN', 'ADMINISTRATOR'] },
        { to: "/admin/kategori", icon: <Tag size={20} />, text: "Kategori", roles: ['ADMIN', 'ADMINISTRATOR'] },
        { to: "/admin/users", icon: <Users size={20} />, text: "Pengguna", roles: ['ADMINISTRATOR'] },
    ];

    const NavItem = ({ to, icon, text }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex items-center px-4 py-3 mb-1 transition-all duration-200 rounded-lg
                ${isActive 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"}
            `}
            onClick={() => setSidebarOpen(false)}
        >
            {({ isActive }) => (
                <>
                    <div className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
                        {icon}
                    </div>
                    <span className="ml-3 font-medium">{text}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white ml-auto mr-1"></div>}
                </>
            )}
        </NavLink>
    );

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-xl z-30 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                            <Newspaper className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">Jagat Admin</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-5">
                    <NavLink to="/" className={({ isActive }) => `flex items-center px-4 py-2 text-sm ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'} rounded-lg mb-4`}>
                        {({ isActive }) => (
                            <>
                                <Home size={16} className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                                <span className="ml-2">Kembali ke Situs</span>
                            </>
                        )}
                    </NavLink>
                </div>
                
                <nav className="px-4 py-2 flex flex-col justify-between h-[calc(100%-140px)]">
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Menu Utama</h3>
                        <div className="space-y-1">
                            {navLinks.map(link => (
                                link.roles.includes(user?.role) && <NavItem key={link.to} {...link} />
                            ))}
                        </div>
                        
                        <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-8 mb-2">Pengaturan</h3>
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) => `
                                flex items-center px-4 py-3 mb-1 transition-all duration-200 rounded-lg
                                ${isActive 
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" 
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Settings size={20} className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                                    <span className="ml-3 font-medium">Pengaturan</span>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-white ml-auto mr-1"></div>}
                                </>
                            )}
                        </NavLink>
                    </div>
                </nav>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center px-2 py-3">
                        {user && user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        )}
                        <div className="ml-3">
                            <p className="font-medium text-sm text-gray-800 dark:text-white">{user ? user.name : 'Admin'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user ? user.role : 'Administrator'}</p>
                        </div>
                    </div>
                </div>
            </aside>
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"></div>}
        </>
    );
};

export default Sidebar;