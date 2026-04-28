// File: src/components/ThreadCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';

/**
 * A card component to display summary information about a discussion thread.
 * @param {object} props - The component props.
 * @param {object} props.thread - The thread object to display.
 */
const ThreadCard = ({ thread }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex items-center">
            <img src={thread.authorAvatar} alt={thread.author} className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex-grow">
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{thread.category}</span>
            <h3 className="mt-2 text-lg font-bold text-gray-800 hover:text-blue-600">
                <Link to={`/login`}>{thread.title}</Link>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
                Dimulai oleh <span className="font-semibold text-gray-700">{thread.author}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
                {thread.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">#{tag}</span>
                ))}
            </div>
        </div>
        <div className="flex-shrink-0 flex sm:flex-col items-end sm:items-center justify-between sm:justify-center gap-4 sm:gap-2 sm:border-l sm:pl-4 text-sm text-center">
            <div className="flex items-center gap-1 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span className="font-semibold">{thread.replies}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{thread.views}</span>
            </div>
        </div>
    </div>
);

export default ThreadCard;
