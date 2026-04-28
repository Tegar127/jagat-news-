// src/components/SidebarNews.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const SidebarNews = ({ title, news, loading, showRanking = false }) => {
    if (loading) {
        return (
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200/80">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4 py-2">
                        <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                        <div className="flex-1 space-y-3 py-1">
                            <div className="h-2 bg-slate-200 rounded"></div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                </div>
                                <div className="h-2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200/80">
            <h3 className="text-xl font-bold text-gray-800 mb-5">{title}</h3>
            <div className="space-y-4">
                {news.map((item, index) => (
                    <Link to={`/berita/${item.id}`} key={item.id} className="group flex items-center gap-4">
                        {showRanking && (
                            <div className="text-2xl font-bold text-gray-300 group-hover:text-blue-600 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        )}
                        <img 
                            src={(item.images && item.images.length > 0) ? item.images[0].url : 'https://placehold.co/100x100?text=Jagat'} 
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                                {item.title}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1.5">
                                <Calendar className="w-3 h-3 mr-1.5" />
                                {new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SidebarNews;