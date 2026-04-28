import BeritaForm from '@/components/admin/forms/BeritaForm';
// import { getBeritaById } from '@/lib/supabase/server'; // Sesuaikan dengan fungsi fetch Anda

export default async function EditBeritaPage({ params }: { params: { id: string } }) {
    // 1. Fetch data berita berdasarkan ID dari database (Server-side)
    // const berita = await getBeritaById(params.id);

    // Data dummy sementara
    const berita = {
        id: params.id,
        title: 'Pembaruan Sistem Cuti Karyawan',
        content: '<p>Terdapat pembaruan mengenai aturan yang berlaku...</p>'
    };

    if (!berita) {
        return <div>Berita tidak ditemukan</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Edit Berita
            </h1>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border dark:border-slate-700">
                <BeritaForm initialData={berita} isEdit={true} />
            </div>
        </div>
    );
}