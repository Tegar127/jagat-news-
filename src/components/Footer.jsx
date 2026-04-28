// File: src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="md:col-span-2 lg:col-span-1">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <Newspaper className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white">Jagat News</span>
                    </Link>
                    <p className="text-sm text-gray-400">Portal berita terdepan yang menyajikan informasi akurat, terkini, dan terpercaya dari seluruh dunia.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-white tracking-wider uppercase mb-4">Navigasi</h3>
                    <ul className="space-y-2">
                        <li><Link to="/tentang" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                        <li><Link to="/kontak" className="hover:text-white transition-colors">Kontak</Link></li>
                        <li><Link to="/privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
                        <li><Link to="/syarat" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-white tracking-wider uppercase mb-4">Kategori</h3>
                     <ul className="space-y-2">
                        <li><Link to="/berita?kategori=teknologi" className="hover:text-white transition-colors">Teknologi</Link></li>
                        <li><Link to="/berita?kategori=olahraga" className="hover:text-white transition-colors">Olahraga</Link></li>
                        <li><Link to="/berita?kategori=politik" className="hover:text-white transition-colors">Politik</Link></li>
                    </ul>
                </div>
                <div>
                     <h3 className="font-semibold text-white tracking-wider uppercase mb-4">Ikuti Kami</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Facebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Linkedin /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Jagat News. Seluruh hak cipta dilindungi.</p>
            </div>
        </div>
    </footer>
);

export default Footer;