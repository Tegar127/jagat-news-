import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose && onClose();
            }, 300); // Tunggu animasi selesai sebelum memanggil onClose
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    };

    const getToastClasses = () => {
        const baseClasses = `fixed z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`;
        
        // Posisi di tengah atas
        const positionClasses = 'top-4 left-1/2 -translate-x-1/2';
        
        // Warna berdasarkan tipe
        const typeClasses = type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30' 
            : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30';
        
        return `${baseClasses} ${positionClasses} ${typeClasses}`;
    };

    return (
        <div className={getToastClasses()}>
            <div className="flex items-center">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                    <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <p className="font-medium">{message}</p>
            </div>
            <button 
                onClick={handleClose} 
                className="ml-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;