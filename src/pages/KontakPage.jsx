import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const KontakPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4 bg-background">
            <Wrench size={64} className="text-blue-500 mb-4" />
            <h1 className="text-4xl font-bold text-foreground">
                Halaman Kontak
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Halaman ini sedang dalam tahap pengembangan.
                <br />
                Silakan hubungi kami melalui email di info@jagatnews.com
            </p>
            <Link 
                to="/" 
                className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default KontakPage;