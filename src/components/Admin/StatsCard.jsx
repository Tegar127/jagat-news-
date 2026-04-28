// File: src/components/Admin/StatsCard.jsx

import React from 'react';

const StatsCard = ({ icon, title, value, change, changeType }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
    
    // Warna latar belakang yang berbeda untuk setiap jenis kartu
    const getGradientClass = () => {
        switch(title) {
            case "Total Berita":
                return "from-blue-500 to-blue-600";
            case "Total Pengguna":
                return "from-purple-500 to-purple-600";
            case "Total Kategori":
                return "from-amber-500 to-amber-600";
            case "Total Pembaca":
                return "from-emerald-500 to-emerald-600";
            default:
                return "from-blue-500 to-blue-600";
        }
    };

    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl hover:scale-[1.02] duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 flex items-center ${changeColor}`}>
                            {changeType === 'increase' ? '↑' : '↓'} {change}
                        </p>
                    )}
                </div>
                <div className={`bg-gradient-to-br ${getGradientClass()} text-white p-3 rounded-lg shadow-md`}>
                    {icon}
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-10 text-8xl">
                {icon}
            </div>
        </div>
    );
};

export default StatsCard;