import React, { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const UserAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: 'USER' });

    // Mengambil semua data pengguna dari tabel "User"
    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('User')
                .select('id, name, email, role, avatar')
                .order('name', { ascending: true });
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsFormVisible(true);
    };

    // Menyimpan perubahan (hanya peran) ke Supabase
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('User')
                .update({ role: currentUser.role })
                .eq('id', currentUser.id);

            if (error) throw error;

            await fetchUsers();
            setIsFormVisible(false);
        } catch (error) {
            alert("Gagal memperbarui peran pengguna: " + error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Kelola Pengguna</h1>
                {/* Tombol Tambah Pengguna dihapus untuk keamanan */}
            </div>

            {isFormVisible && (
                <div className="bg-card p-6 rounded-xl shadow-md border border-custom mb-6">
                    <h2 className="text-xl font-bold mb-4">Edit Peran untuk: {currentUser.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Email</label>
                            <p className="text-muted-foreground">{currentUser.email}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Peran (Role)</label>
                            <select 
                                name="role" 
                                value={currentUser.role} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-custom rounded bg-input"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="ADMINISTRATOR">Administrator</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                           <button type="button" onClick={() => setIsFormVisible(false)} className="flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                <X size={18} className="mr-2" /> Batal
                           </button>
                           <button type="submit" className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                                <Save size={18} className="mr-2" /> Simpan Perubahan
                           </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-card p-6 rounded-xl shadow-md border border-custom overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-background">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nama</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Peran</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-custom hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="py-3 px-4 text-foreground font-medium">{user.name}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'ADMINISTRATOR' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                    {/* Tombol Hapus dinonaktifkan untuk keamanan */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAdminPage;