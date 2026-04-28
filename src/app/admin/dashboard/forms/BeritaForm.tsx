'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Import CKEditor secara dinamis tanpa SSR
const RichTextEditor = dynamic(
    () => import('@/components/admin/ui/RichTextEditor'),
    { ssr: false, loading: () => <div className="h-64 animate-pulse bg-slate-200 rounded-md">Loading Editor...</div> }
);

interface BeritaFormProps {
    initialData?: {
        id?: string;
        title: string;
        content: string;
    };
    isEdit?: boolean;
}

export default function BeritaForm({ initialData, isEdit = false }: BeritaFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Ganti dengan pemanggilan fungsi API/Supabase Anda
            // const action = isEdit ? updateBerita(initialData.id, { title, content }) : createBerita({ title, content });
            // await action;

            console.log('Data yang disimpan:', { title, content });
            router.push('/admin/berita');
            router.refresh();
        } catch (error) {
            console.error('Gagal menyimpan berita:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Judul Berita</label>
                <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul berita"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Konten Berita</label>
                <RichTextEditor
                    value={content}
                    onChange={(newContent) => setContent(newContent)}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : (isEdit ? 'Perbarui Berita' : 'Simpan Berita')}
                </Button>
            </div>
        </form>
    );
}