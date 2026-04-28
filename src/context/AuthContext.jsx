import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('login');

   useEffect(() => {
    const handleAuthStateChange = async (session) => {
        if (session?.user) {
            const { data: profile, error } = await supabase
                .from('User')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // Abaikan error "No rows found"
                console.error('Gagal mengambil profil pengguna:', error);
            }

            setUser({
                ...session.user,
                ...(profile || {}) // Selalu gabungkan, bahkan jika profil null
            });
        } else {
            setUser(null);
        }
        setLoading(false);
    };

        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await handleAuthStateChange(session);
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthStateChange(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const openModal = (type = 'login') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        closeModal();
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw new Error(error.message);
    };

    const register = async (name, email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: name }
            }
        });
        if (error) throw new Error(error.message);
        alert('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        closeModal();
    };

    const logout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };
    
    const updateUser = (newUserData) => {
        setUser(prevUser => ({ ...prevUser, ...newUserData }));
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        loginWithGoogle,
        register,
        updateUser,
        isModalOpen,
        modalType,
        openModal,
        closeModal
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);