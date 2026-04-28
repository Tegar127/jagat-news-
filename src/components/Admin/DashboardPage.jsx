import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/Admin/StatsCard';
import { Newspaper, Users, Tag, Eye } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalBerita: 0,
        totalPengguna: 0,
        totalKategori: 0,
        totalPembaca: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Jalankan semua query secara paralel
                const [
                    beritaCount,
                    penggunaCount,
                    kategoriCount,
                    totalViews,
                    recentPosts
                ] = await Promise.all([
                    supabase.from('Post').select('*', { count: 'exact', head: true }),
                    supabase.from('User').select('*', { count: 'exact', head: true }),
                    supabase.from('Category').select('*', { count: 'exact', head: true }),
                    supabase.rpc('get_total_views'), // Panggil fungsi yang kita buat
                    supabase.from('Post').select('id, title, author:User(name), publishedAt').order('publishedAt', { ascending: false }).limit(5)
                ]);

                if (beritaCount.error) throw beritaCount.error;
                if (penggunaCount.error) throw penggunaCount.error;
                if (kategoriCount.error) throw kategoriCount.error;
                if (totalViews.error) throw totalViews.error;
                if (recentPosts.error) throw recentPosts.error;

                setStats({
                    totalBerita: beritaCount.count,
                    totalPengguna: penggunaCount.count,
                    totalKategori: kategoriCount.count,
                    totalPembaca: totalViews.data,
                });
                
                setRecentActivity(recentPosts.data);

            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    // Fungsi untuk format angka besar (misal: 1200 menjadi 1.2K)
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    const statCards = [
        { icon: <Newspaper />, title: "Total Berita", value: stats.totalBerita },
        { icon: <Users />, title: "Total Pengguna", value: stats.totalPengguna },
        { icon: <Tag />, title: "Total Kategori", value: stats.totalKategori },
        { icon: <Eye />, title: "Total Pembaca", value: formatNumber(stats.totalPembaca) },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                <div className="bg-white dark:bg-gray-800 p-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl animate-pulse"></div>)
                ) : (
                    statCards.map(stat => <StatsCard key={stat.title} {...stat} />)
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Aktivitas Terkini</h2>
                    <Link to="/admin/berita" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">Lihat Semua</Link>
                </div>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentActivity.length > 0 ? (
                            recentActivity.map(post => (
                                <li key={post.id} className="py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/60 px-2 rounded-lg transition-colors duration-150">
                                    <div>
                                        <Link to={`/berita/${post.id}`} className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{post.title}</Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                            oleh {post.author?.name || 'Admin'} - {new Date(post.publishedAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                                        </p>
                                    </div>
                                    <Link to={`/admin/berita`} className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors">
                                        Kelola
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p className="text-muted-foreground">Belum ada aktivitas.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;