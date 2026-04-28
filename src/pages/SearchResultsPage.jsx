import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Newspaper, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Anda bisa menyalin komponen NewsCard dan stripHtml dari BeritaPage.jsx
const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const NewsCard = ({ item }) => {
    const textContent = stripHtml(item.content);
    return (
        <div className="bg-white rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500 flex flex-col">
            <div className="overflow-hidden">
                <img className="w-full h-52 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" src={(item.images && item.images.length > 0) ? item.images[0].url : 'https://placehold.co/400x200'} alt={item.title}/>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-indigo-100 text-indigo-800">{item.category?.name || 'Tanpa Kategori'}</span>
                    <h3 className="text-xl font-bold text-zinc-800 mb-2">{item.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">{textContent.substring(0, 100) + '...' || 'Deskripsi tidak tersedia'}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 mb-4">Oleh: <span className="font-medium">{item.author?.name || 'Tanpa Penulis'}</span></p>
                    <Link to={`/berita/${item.id}`} className="inline-flex items-center font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors duration-300">
                        Baca Selengkapnya
                        <ChevronRight className="ml-1.5 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default function SearchResultsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // Gunakan textSearch untuk mencari di Supabase
                const { data, error } = await supabase
                    .from('Post')
                    .select('*, author:User(name), category:Category(name), images:Image(url)')
                    .eq('status', 'PUBLISHED')
                    .textSearch('title', `'${query}'`, { type: 'plain' });

                if (error) throw error;
                
                const formattedNews = data.map(item => ({
                    ...item,
                    author: item.author,
                    category: item.category,
                    images: item.images,
                }));

                setSearchResults(formattedNews);
            } catch (error) {
                console.error("Gagal melakukan pencarian:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="bg-zinc-50 font-sans min-h-screen">
            <div className="container mx-auto px-6 py-16 md:py-20">
                <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
                    Hasil Pencarian untuk: <span className="text-indigo-600">"{query}"</span>
                </h1>
                <p className="mt-4 text-lg text-zinc-600">
                    {loading ? 'Mencari berita...' : `${searchResults.length} hasil ditemukan.`}
                </p>

                <main className="mt-12">
                    {!loading && searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {searchResults.map(item => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        !loading && <p className="text-center text-gray-500">Tidak ada berita yang ditemukan untuk kata kunci ini.</p>
                    )}
                </main>
            </div>
        </div>
    );
}