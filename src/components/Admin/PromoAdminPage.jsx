import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../supabaseClient'; // Impor Supabase

const PromoAdminPage = () => {
    const [promos, setPromos] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPromo, setCurrentPromo] = useState({ id: null, title: '', subtitle: '', buttonText: '', buttonLink: '', imageUrl: '', isActive: true });
    const [imageFile, setImageFile] = useState(null);

    // READ: Ambil semua data promo dari Supabase
    const fetchPromos = async () => {
        try {
            const { data, error } = await supabase.from('Promo').select('*').order('title');
            if (error) throw error;
            setPromos(data);
        } catch (error) {
            console.error("Gagal mengambil data promo:", error);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPromo({ ...currentPromo, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleAddNew = () => {
        setCurrentPromo({ id: null, title: '', subtitle: '', buttonText: '', buttonLink: '', imageUrl: '', isActive: true });
        setImageFile(null);
        setIsFormVisible(true);
    };

    const handleEdit = (promo) => {
        setCurrentPromo(promo);
        setImageFile(null);
        setIsFormVisible(true);
    };

    // SUBMIT: Simpan (Create/Update) promo ke Supabase
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = currentPromo.imageUrl;

            // Jika ada file gambar baru, unggah ke Storage
            if (imageFile) {
                const fileName = `promo/${Date.now()}_${imageFile.name}`;
                const { error: uploadError } = await supabase.storage.from('berita').upload(fileName, imageFile, { upsert: true });
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('berita').getPublicUrl(fileName);
                finalImageUrl = data.publicUrl;
            }
            
            const promoData = {
                title: currentPromo.title,
                subtitle: currentPromo.subtitle,
                buttonText: currentPromo.buttonText,
                buttonLink: currentPromo.buttonLink,
                isActive: currentPromo.isActive,
                imageUrl: finalImageUrl,
            };

            if (currentPromo.id) { // Mode Update
                const { error } = await supabase.from('Promo').update(promoData).eq('id', currentPromo.id);
                if (error) throw error;
            } else { // Mode Create
                const { error } = await supabase.from('Promo').insert(promoData);
                if (error) throw error;
            }

            fetchPromos();
            setIsFormVisible(false);

        } catch (error) {
            alert('Gagal menyimpan promo: ' + error.message);
        }
    };

    // DELETE: Hapus promo dari Supabase
    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus promo ini?')) {
            try {
                const { error } = await supabase.from('Promo').delete().eq('id', id);
                if (error) throw error;
                fetchPromos();
            } catch (error) {
                alert('Gagal menghapus promo: ' + error.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kelola Promo Banner</h1>
                <button onClick={handleAddNew} className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                    <PlusCircle size={20} className="mr-2" />
                    Tambah Promo
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                    <h2 className="text-xl font-bold mb-4">{currentPromo.id ? 'Edit Promo' : 'Tambah Promo Baru'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input name="title" value={currentPromo.title} onChange={handleInputChange} placeholder="Judul Promo" className="w-full p-2 border rounded mb-4" required />
                        <input name="subtitle" value={currentPromo.subtitle} onChange={handleInputChange} placeholder="Sub Judul" className="w-full p-2 border rounded mb-4" />
                        <input name="buttonText" value={currentPromo.buttonText} onChange={handleInputChange} placeholder="Teks Tombol" className="w-full p-2 border rounded mb-4" />
                        <input name="buttonLink" value={currentPromo.buttonLink} onChange={handleInputChange} placeholder="Link Tombol (contoh: /berita)" className="w-full p-2 border rounded mb-4" />

                        <input name="imageUrl" value={currentPromo.imageUrl} onChange={handleInputChange} placeholder="URL Gambar (Jika tidak mengunggah file baru)" className="w-full p-2 border rounded mb-2" />
                        <p className="text-center text-gray-500 my-2">ATAU UNGGAH FILE BARU</p>
                        <input type="file" name="imageFile" onChange={handleFileChange} className="w-full p-2 border rounded mb-4" />
                        
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input type="checkbox" name="isActive" checked={currentPromo.isActive} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <span className="ml-2 text-gray-700">Aktifkan Promo ini</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-4">
                           <button type="button" onClick={() => setIsFormVisible(false)} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg">Batal</button>
                           <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Simpan</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Judul</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promos.map(promo => (
                            <tr key={promo.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{promo.title}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {promo.isActive ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button onClick={() => handleEdit(promo)} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromoAdminPage;