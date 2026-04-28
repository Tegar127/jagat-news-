import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Newspaper, UserCircle, LogOut, User, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user, logout, openModal } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setIsMenuOpen(false); // Tutup menu mobile setelah search
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
    };

    const renderProfileDropdown = () => (
        <div className="relative">
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center focus:outline-none">
                {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <UserCircle className="w-8 h-8 text-gray-600 hover:text-blue-600" />
                )}
            </button>
            {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {(user?.role === 'ADMIN' || user?.role === 'ADMINISTRATOR') && (
                        <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    )}
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Kelola Profil
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                    </button>
                </div>
            )}
        </div>
    );

    const renderAuthButtons = () => (
        <>
            <button onClick={() => openModal('login')} className="px-5 py-2 rounded-full font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                Masuk
            </button>
            <button onClick={() => openModal('register')} className="px-5 py-2 rounded-full font-bold text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                Daftar
            </button>
        </>
    );

    return (
        <header className="bg-card border-b border-custom shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <Newspaper className="w-8 h-8 text-blue-700" />
                        <span className="text-2xl font-bold text-gray-900">Jagat News</span>
                    </Link>
                    <nav className="flex items-center gap-x-6 text-sm text-gray-600 font-medium">
                        <Link to="/" className="hover:text-blue-600">Beranda</Link>
                        <Link to="/berita" className="hover:text-blue-600">Berita</Link>
                        <Link to="/tentang" className="hover:text-blue-600">Tentang Kami</Link>
                        <Link to="/kontak" className="hover:text-blue-600">Kontak</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-input border border-custom rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>

                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {user ? renderProfileDropdown() : renderAuthButtons()}
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <Newspaper className="w-8 h-8 text-blue-700" />
                        <span className="text-xl font-bold text-card-foreground">Jagat News</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        {user && renderProfileDropdown()}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-4 pb-2">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>
                    </div>
                    <nav className="flex flex-col gap-1 px-4 py-2">
                        <Link to="/" className="text-gray-700 font-medium p-3 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
                        <Link to="/berita" className="text-gray-700 font-medium p-3 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Berita</Link>
                        <Link to="/tentang" className="text-gray-700 font-medium p-3 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
                        <Link to="/kontak" className="text-gray-700 font-medium p-3 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Kontak</Link>
                        {!user && (
                            <div className="pt-4 mt-2 border-t border-gray-200 flex gap-4">
                                <button onClick={() => { openModal('login'); setIsMenuOpen(false); }} className="flex-1 text-center px-5 py-2.5 rounded-lg font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100">
                                    Masuk
                                </button>
                                <button onClick={() => { openModal('register'); setIsMenuOpen(false); }} className="flex-1 text-center px-5 py-2.5 rounded-lg font-bold text-sm bg-blue-500 text-white hover:bg-blue-600">
                                    Daftar
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;