import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { User, Calendar, ArrowLeft, ChevronLeft, ChevronRight, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const InfoTag = ({ icon, text }) => (
    <div className="flex items-center text-sm text-muted-foreground">
        {icon}
        <span className="ml-2">{text}</span>
    </div>
);

const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    if (!images || images.length === 0) {
        return <img src="https://placehold.co/800x450" alt="Placeholder" className="w-full h-auto md:h-[450px] object-cover" />;
    }
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    return (
        <div className="relative w-full h-auto md:h-[450px] overflow-hidden bg-gray-200">
            <img src={images[currentIndex].url} alt={`Gambar berita ${currentIndex + 1}`} className="w-full h-full object-cover transition-transform duration-500" />
            {images.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors focus:outline-none"><ChevronLeft size={24} /></button>
                    <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors focus:outline-none"><ChevronRight size={24} /></button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const CommentForm = ({ postId, onCommentPosted }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === '') return;
        setLoading(true);
        try {
            const { error } = await supabase.from('Comment').insert({ content: content, postId: postId, userId: user.id });
            if (error) throw error;
            setContent('');
            onCommentPosted();
        } catch (error) {
            console.error("Gagal mengirim komentar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex items-start gap-4">
                <img src={user?.avatar || 'https://placehold.co/40x40'} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tulis komentar Anda..."
                        className="w-full p-4 border border-custom rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                        rows="4"
                        required
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-pulse">•</span>
                                    <span>Mengirim...</span>
                                </>
                            ) : 'Kirim Komentar'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

const CommentList = ({ comments, fetchComments }) => {
    const { user } = useAuth();
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditedContent(comment.content);
    };
    
    const handleUpdate = async (commentId) => {
        if (editedContent.trim() === '') return;
        try {
            const { error } = await supabase
                .from('Comment')
                .update({ content: editedContent })
                .eq('id', commentId);
            if (error) throw error;
            setEditingCommentId(null);
            fetchComments();
        } catch (error) {
            console.error("Gagal memperbarui komentar:", error);
        }
    };
    
    const handleDelete = async (commentId) => {
        if(window.confirm('Anda yakin ingin menghapus komentar ini?')) {
            try {
                const { error } = await supabase
                    .from('Comment')
                    .delete()
                    .eq('id', commentId);
                if (error) throw error;
                fetchComments();
            } catch (error) {
                console.error("Gagal menghapus komentar:", error);
            }
        }
    };

    return (
        <div className="space-y-8">
            {comments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                </div>
            ) : (
                comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-4 animate-fadeIn">
                        <img 
                            src={comment.User?.avatar || 'https://placehold.co/40x40'} 
                            alt={comment.User?.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" 
                        />
                        <div className="flex-1">
                            <div className="bg-background p-5 rounded-lg border border-custom shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-card-foreground">{comment.User?.name || 'Pengguna'}</p>
                                    {user?.id === comment.userId && editingCommentId !== comment.id && (
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleEditClick(comment)} 
                                                className="text-muted-foreground hover:text-indigo-600 transition-colors duration-200 p-1 rounded-full hover:bg-indigo-50"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(comment.id)} 
                                                className="text-muted-foreground hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {editingCommentId === comment.id ? (
                                    <div className="mt-3">
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full p-3 border border-custom rounded-lg bg-input text-foreground focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow duration-200"
                                            rows="3"
                                        />
                                        <div className="flex justify-end space-x-3 mt-3">
                                            <button 
                                                onClick={() => setEditingCommentId(null)} 
                                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
                                            >
                                                Batal
                                            </button>
                                            <button 
                                                onClick={() => handleUpdate(comment.id)} 
                                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 font-medium"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground mt-2 leading-relaxed">{comment.content}</p>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 ml-2">
                                {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default function BeritaDetailPage() {
    const { id } = useParams();
    const { isAuthenticated, openModal } = useAuth();
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('Comment')
                .select('*, User(name, avatar)')
                .eq('postId', id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setComments(data);
        } catch (error) {
            console.error("Gagal mengambil komentar:", error);
        }
    }, [id]);
    
    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const { data, error } = await supabase
                    .from('Post')
                    .select(`*, author:User(name), category:Category(name), images:Image(id, url)`)
                    .eq('id', id)
                    .single();
                if (error) throw error;
                setNews(data);
                supabase.functions.invoke('increment-view-count', { body: { postId: id } });
            } catch (error) {
                console.error("Gagal mengambil detail berita:", error);
                setNews(null);
            }
        };

        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchNewsDetail(), fetchComments()]);
            setLoading(false);
        };
        
        fetchAllData();
    }, [id, fetchComments]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-foreground">Memuat Berita...</div>;
    }

    if (!news) {
        return <Navigate to="/404" replace />;
    }

    const canCopyClass = news.canBeCopied ? '' : 'select-none';

    return (
        <div className={`bg-background font-sans min-h-screen ${canCopyClass}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="mb-6">
                    <Link to="/berita" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Kembali ke Daftar Berita
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-custom hover:shadow-xl transition-shadow duration-300">
                       <ImageGallery images={news.images} />
                       <div className="p-8 md:p-10">
                            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200">
                                {news.category?.name || 'Tanpa Kategori'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-card-foreground tracking-tight leading-tight">{news.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 border-y border-custom py-4">
                               <InfoTag icon={<User className="w-4 h-4 text-muted-foreground" />} text={news.author?.name || 'Admin'} />
                               <InfoTag icon={<Calendar className="w-4 h-4 text-muted-foreground" />} text={new Date(news.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} />
                            </div>
                            <div className="mt-8 prose lg:prose-xl max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: news.content?.replace(/\n/g, '<br />') || 'Konten tidak tersedia.' }}>
                            </div>
                       </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-card rounded-2xl shadow-lg border border-custom p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                            <MessageSquare className="text-indigo-600" />
                            Komentar ({comments.length})
                        </h2>

                        {isAuthenticated ? (
                            <CommentForm postId={id} onCommentPosted={fetchComments} />
                        ) : (
                            <div className="mt-6 text-center bg-background p-6 rounded-lg border border-custom hover:border-indigo-300 transition-colors duration-200">
                                <p className="text-muted-foreground">
                                    <button onClick={() => openModal('login')} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">Masuk</button> atau <button onClick={() => openModal('register')} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">Daftar</button> untuk meninggalkan komentar.
                                </p>
                            </div>
                        )}

                        <hr className="my-8 border-custom" />

                        <CommentList comments={comments} fetchComments={fetchComments} />
                    </div>
                </div>
            </div>
        </div>
    );
}