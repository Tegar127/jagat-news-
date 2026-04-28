// src/components/LoginModal.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Komponen helper untuk ikon Google
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 6.58C34.566 2.734 29.636 0 24 0C10.745 0 0 10.745 0 24s10.745 24 24 24s24-10.745 24-24c0-1.631-.144-3.211-.409-4.755z"></path>
        <path fill="#FF3D00" d="M6.306 14.691c-1.219 2.355-1.921 5.019-1.921 7.809s.702 5.454 1.921 7.809L.894 35.09C.299 32.887 0 30.51 0 28s.299-4.887 .894-7.091l5.412-2.399z"></path>
        <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.438C29.211 39.426 26.714 40 24 40c-4.446 0-8.281-2.274-10.438-5.631l-5.642 5.034C10.183 44.382 16.57 48 24 48z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.438C44.636 36.218 48 31.026 48 24c0-1.631-.144-3.211-.409-4.755z"></path>
    </svg>
);

const SignInForm = ({ onSwitch }) => {
    const { login, loginWithGoogle, closeModal } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Modal akan ditutup oleh fungsi login jika berhasil
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang!</h1>
            <p className="text-gray-600">
                Belum punya akun?{' '}
                <button onClick={onSwitch} className="font-semibold text-blue-600 hover:underline">
                    Daftar
                </button>
            </p>
            <div className="flex justify-center my-6">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <GoogleIcon />
                    <span className="font-semibold text-gray-700">Masuk dengan Google</span>
                </button>
            </div>
            <div className="flex items-center my-4">
                <hr className="flex-grow" /><span className="mx-4 text-gray-500 text-sm">atau</span><hr className="flex-grow" />
            </div>
            <form onSubmit={handleLogin}>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    {loading ? 'Memproses...' : 'Masuk'}
                </button>
            </form>
        </div>
    );
};

const SignUpForm = ({ onSwitch }) => {
    const { register, loginWithGoogle } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            // Notifikasi dan penutupan modal ditangani oleh fungsi register
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
            <p className="text-gray-600">
                Sudah punya akun?{' '}
                <button onClick={onSwitch} className="font-semibold text-blue-600 hover:underline">
                    Masuk
                </button>
            </p>
            <div className="flex justify-center my-6">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <GoogleIcon />
                    <span className="font-semibold text-gray-700">Daftar dengan Google</span>
                </button>
            </div>
            <div className="flex items-center my-4"><hr className="flex-grow" /><span className="mx-4 text-gray-500 text-sm">atau</span><hr className="flex-grow" /></div>
            <form onSubmit={handleSignUp}>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nama Lengkap</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-email">Email</label>
                    <input id="signup-email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">Password</label>
                    <input id="signup-password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    {loading ? 'Memproses...' : 'Daftar'}
                </button>
            </form>
        </div>
    );
};


const LoginModal = () => {
    const { isModalOpen, modalType, closeModal } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        setIsLogin(modalType === 'login');
    }, [modalType]);

    const handleSwitch = () => {
        setIsLogin(!isLogin);
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-12">
                <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-6 h-6 text-gray-500" />
                </button>
                {isLogin ? <SignInForm onSwitch={handleSwitch} /> : <SignUpForm onSwitch={handleSwitch} />}
            </div>
        </div>
    );
};

export default LoginModal;