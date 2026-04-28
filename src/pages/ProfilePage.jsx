// tegar127/jagat-news/jagat-news-484ca85cf68061a08fe7435d5b0a49863b94f172/src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Edit3, Save, Trash2, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient'; // 1. Impor klien Supabase

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user.name);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [isEditing, setIsEditing] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            let avatarUrl = avatarPreview; // Gunakan preview sebagai fallback

            // 2. Jika ada file baru yang dipilih untuk diunggah
            if (avatarFile) {
                // Buat nama file yang unik untuk menghindari tumpang tindih
                const fileName = `${user.id}/${Date.now()}_${avatarFile.name}`;
                
                // Unggah file ke Supabase Storage di bucket 'avatars'
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, {
                        cacheControl: '3600',
                        upsert: true, // Timpa file jika ada dengan nama yang sama
                    });

                if (uploadError) throw uploadError;

                // Dapatkan URL publik dari file yang baru diunggah
                const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
                avatarUrl = data.publicUrl;
            }
            
            // 3. Perbarui data pengguna di Supabase Auth (untuk metadata)
            const { data: updatedAuthUser, error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: avatarUrl, name: name }
            });
            if (authError) throw authError;

            // 4. Perbarui juga tabel 'User' publik Anda
            const { error: dbError } = await supabase
                .from('User')
                .update({ name: name, avatar: avatarUrl })
                .eq('id', user.id);
            if (dbError) throw dbError;
            
            // Perbarui state lokal (jika diperlukan, karena onAuthStateChange akan menangani ini)
            updateUser(updatedAuthUser.user);
            setIsEditing(false);

        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    return (
        // ... JSX tidak ada perubahan ...
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-500" />
                            </div>
                        )}
                        {isEditing && (
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                                <Camera size={16} />
                                <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                        )}
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex space-x-4">
                        <button onClick={handleSave} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            <Save size={18} className="mr-2" />
                            Simpan
                        </button>
                        <button onClick={handleRemoveAvatar} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            <Trash2 size={18} className="mr-2" />
                            Hapus Foto
                        </button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                            Batal
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        <Edit3 size={18} className="mr-2" />
                        Edit Profil
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;