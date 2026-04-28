// File: src/pages/Admin/DashboardPage.jsx

import React from 'react';
import StatsCard from '../../components/Admin/StatsCard';
import { Newspaper, Users, Tag, Eye } from 'lucide-react';

const DashboardPage = () => {
    const stats = [
        { icon: <Newspaper />, title: "Total Berita", value: "1,250", change: "+12% dari bulan lalu", changeType: "increase" },
        { icon: <Users />, title: "Total Pengguna", value: "5,820", change: "+5% dari bulan lalu", changeType: "increase" },
        { icon: <Tag />, title: "Total Kategori", value: "15", change: "Stabil", changeType: "stable" },
        { icon: <Eye />, title: "Total Pembaca", value: "1.2M", change: "-2.5% dari bulan lalu", changeType: "decrease" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => <StatsCard key={stat.title} {...stat} />)}
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Aktivitas Terkini</h2>
                {/* Di sini Anda bisa menambahkan komponen untuk menampilkan log aktivitas atau berita terbaru */}
                <p className="text-gray-600 dark:text-gray-400">Fitur aktivitas terkini sedang dalam pengembangan.</p>
            </div>
        </div>
    );
};

export default DashboardPage;