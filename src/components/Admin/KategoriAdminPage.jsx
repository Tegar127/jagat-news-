import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Tag, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient'; // 1. Impor klien Supabase

const KategoriAdminPage = () => {
    const [categories, setCategories] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 2. READ: Fungsi untuk mengambil semua data kategori dari Supabase
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Category') // Nama tabel di database Supabase Anda
                .select('*')
                .order('name', { ascending: true }); // Urutkan berdasarkan nama

            if (error) throw error;
            setCategories(data);
        } catch (error) {
            console.error('Gagal mengambil data kategori:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Panggil fetchCategories saat komponen pertama kali dimuat
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        setCurrentCategory({ ...currentCategory, name: e.target.value });
    };

    const handleAddNew = () => {
        setCurrentCategory({ id: null, name: '' });
        setIsFormVisible(true);
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus kategori ini? Ini tidak dapat diurungkan.')) {
            try {
                // 4. DELETE: Hapus kategori dari Supabase berdasarkan ID
                const { error } = await supabase
                    .from('Category')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchCategories(); // Muat ulang daftar kategori setelah berhasil
            } catch (error) {
                console.error('Gagal menghapus kategori:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            if (currentCategory.id) {
                // 3. UPDATE: Perbarui kategori yang sudah ada di Supabase
                const { error } = await supabase
                    .from('Category')
                    .update({ name: currentCategory.name })
                    .eq('id', currentCategory.id);
                
                if (error) throw error;
            } else {
                // 3. CREATE: Tambahkan kategori baru ke Supabase
                const { error } = await supabase
                    .from('Category')
                    .insert([{ name: currentCategory.name }]);
                
                if (error) throw error;
            }
            
            // Setelah berhasil, refresh data dan reset form
            await fetchCategories();
            setIsFormVisible(false);
            setCurrentCategory({ id: null, name: '' });
        } catch (error) {
            console.error('Gagal menyimpan kategori:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Tag className="h-8 w-8 mr-2 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Kategori</h1>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                    disabled={loading}
                >
                    <PlusCircle size={20} className="mr-2" />
                    Tambah Kategori
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                            {currentCategory.id ? (
                                <>
                                    <Edit size={20} className="mr-2 text-blue-500" />
                                    Edit Kategori
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} className="mr-2 text-green-500" />
                                    Tambah Kategori
                                </>
                            )}
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => setIsFormVisible(false)} 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</label>
                            <input
                                id="categoryName"
                                type="text"
                                placeholder="Masukkan nama kategori"
                                value={currentCategory.name}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:text-white"
                                required
                                disabled={submitting}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsFormVisible(false)} 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center min-w-[100px]"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        Simpan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 transition-all">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Memuat data kategori...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Tag size={40} className="text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Belum ada kategori</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Tambahkan kategori baru untuk mengelompokkan berita</p>
                        <button 
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors flex items-center"
                        >
                            <PlusCircle size={18} className="mr-2" />
                            Tambah Kategori
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Nama Kategori</th>
                                    <th className="text-right py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{cat.name}</td>
                                        <td className="py-3 px-4 flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleEdit(cat)} 
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                                title="Edit kategori"
                                            >
                                                <Edit size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.id)} 
                                                className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                title="Hapus kategori"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                )}
            </div>
        </div>
    );
};

export default KategoriAdminPage;