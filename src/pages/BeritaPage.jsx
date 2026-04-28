import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Helper function to strip HTML tags from a string
const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}


const NewsCard = ({ item }) => {
    // Bersihkan tag HTML dari konten untuk pratinjau
    const textContent = stripHtml(item.content);

    return (
        <div className="bg-card rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500 flex flex-col">
            <div className="overflow-hidden">
                <img
                    className="w-full h-52 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    src={(item.images && item.images.length > 0) ? item.images[0].url : 'https://placehold.co/400x200'}
                    alt={item.title}
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-indigo-100 text-indigo-800">
                        {item.category?.name || 'Tanpa Kategori'}
                    </span>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{textContent.substring(0, 100) + '...' || 'Deskripsi tidak tersedia'}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-custom">
                    <p className="text-sm text-muted-foreground mb-4">
                        Oleh: <span className="font-medium text-card-foreground">{item.author?.name || 'Tanpa Penulis'}</span>
                    </p>
                    <Link
                        to={`/berita/${item.id}`}
                        className="inline-flex items-center font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors duration-300">
                        Baca Selengkapnya
                        <ChevronRight className="ml-1.5 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BeritaPage() {
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllNews = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('Post')
                    .select(`*, author:User(name), category:Category(name), images:Image(url)`)
                    .eq('status', 'PUBLISHED')
                    .order('publishedAt', { ascending: false });

                if (error) throw error;
                
                const formattedNews = data.map(item => ({
                    ...item,
                    author: item.author,
                    category: item.category,
                    images: item.images,
                }));

                setAllNews(formattedNews);
            } catch (error) {
                console.error("Gagal mengambil semua berita:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllNews();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-foreground">Memuat semua berita...</div>;
    }

    return (
        <div className="bg-background font-sans">
            <div className="text-center pt-24 pb-20 md:pt-32 md:pb-28 bg-gradient-to-b from-card to-background border-b border-custom">
                <div className="container mx-auto px-6">
                    <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-full text-sm mb-6">
                        <Newspaper className="w-5 h-5" />
                        Pusat Berita
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight">
                        Kumpulan Berita
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground leading-9">
                        Jelajahi berita dari berbagai kategori.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-6 py-16 md:py-20">
                {allNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {allNews.map(item => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
                )}
            </main>
        </div>
    );
}