import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import {
    PlusCircle, Search, Edit, Trash2, Upload, XCircle,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Loader2
} from 'lucide-react';
import { supabase } from '../../supabaseClient'; // Impor Supabase
import { useAuth } from '../../context/AuthContext'; // Impor untuk mendapatkan user ID
import { useToast } from '../../context/ToastContext'; // Impor untuk notifikasi toast

const initialValue = [
    {
        type: 'paragraph',
        align: 'left',
        children: [{ text: '' }],
    },
];

// === HELPER FUNCTIONS ===

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor, format) => {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.align === format,
    });
    return !!match;
};

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    Transforms.setNodes(editor, {
        align: isActive ? undefined : format,
    });
};

// === CUSTOM RENDERERS ===

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'paragraph':
            return <p style={style} {...attributes}>{children}</p>;
        default:
            return <div style={style} {...attributes}>{children}</div>;
    }
};

// === TOOLBAR COMPONENT ===

const Toolbar = () => {
    const editor = useSlate();
    return (
        <div className="flex flex-wrap gap-2 p-2 border-b mb-2">
            {/* Mark Buttons */}
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'bold'); }} className={`p-2 rounded ${isMarkActive(editor, 'bold') ? 'bg-gray-200' : 'bg-white'}`}><Bold size={16} /></button>
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'italic'); }} className={`p-2 rounded ${isMarkActive(editor, 'italic') ? 'bg-gray-200' : 'bg-white'}`}><Italic size={16} /></button>
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'underline'); }} className={`p-2 rounded ${isMarkActive(editor, 'underline') ? 'bg-gray-200' : 'bg-white'}`}><Underline size={16} /></button>

            <div className="border-l mx-2"></div>

            {/* Block Buttons */}
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'left'); }} className={`p-2 rounded ${isBlockActive(editor, 'left') ? 'bg-gray-200' : 'bg-white'}`}><AlignLeft size={16} /></button>
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'center'); }} className={`p-2 rounded ${isBlockActive(editor, 'center') ? 'bg-gray-200' : 'bg-white'}`}><AlignCenter size={16} /></button>
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'right'); }} className={`p-2 rounded ${isBlockActive(editor, 'right') ? 'bg-gray-200' : 'bg-white'}`}><AlignRight size={16} /></button>
            <button type="button" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'justify'); }} className={`p-2 rounded ${isBlockActive(editor, 'justify') ? 'bg-gray-200' : 'bg-white'}`}><AlignJustify size={16} /></button>
        </div>
    );
};


// Main Component
const BeritaAdminPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [newsData, setNewsData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentNews, setCurrentNews] = useState({
        id: null,
        title: '',
        category: '',
        status: 'DRAFT',
        content: '',
        canBeCopied: true,
        images: []
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [editorValue, setEditorValue] = useState(initialValue);
    
    const deserialize = (htmlString) => {
        if (!htmlString) return initialValue;
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        if (!doc.body.hasChildNodes()) return initialValue;
        const slateNodes = Array.from(doc.body.childNodes).map(node => domNodeToSlate(node)).filter(Boolean);
        return slateNodes.length > 0 ? slateNodes : initialValue;
    };
    
    const domNodeToSlate = (node) => {
        if (node.nodeType === 3) {
            return { text: node.textContent };
        }
        if (node.nodeType !== 1) {
            return null;
        }

        const element = node;
        let children = Array.from(element.childNodes).map(domNodeToSlate).flat().filter(Boolean);
        if (children.length === 0) {
            children = [{ text: '' }];
        }

        switch (element.nodeName) {
            case 'P':
                return { type: 'paragraph', align: element.style.textAlign || 'left', children };
            case 'STRONG':
                return children.map(child => ({ ...child, bold: true }));
            case 'EM':
                return children.map(child => ({ ...child, italic: true }));
            case 'U':
                return children.map(child => ({ ...child, underline: true }));
            case 'BODY':
                 return { type: 'paragraph', align: 'left', children };
            default:
                 return { type: 'paragraph', align: 'left', children };
        }
    };
    
    const serialize = (nodes) => {
        return nodes.map(node => {
            if (Text.isText(node)) {
                let html = node.text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                if (node.bold) html = `<strong>${html}</strong>`;
                if (node.italic) html = `<em>${html}</em>`;
                if (node.underline) html = `<u>${html}</u>`;
                return html;
            }

            if (!node.children) return '';

            const childrenHtml = serialize(node.children);

            switch (node.type) {
                case 'paragraph':
                    return `<p style="text-align: ${node.align || 'left'};">${childrenHtml}</p>`;
                default:
                    return childrenHtml;
            }
        }).join('');
    };


    const fetchNews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Post')
                .select(`*, author:User(name), category:Category(name), images:Image(*)`)
                .order('publishedAt', { ascending: false });
            if (error) throw error;
            const formattedData = data.map(news => ({
                ...news,
                author: news.author ? news.author.name : 'N/A',
                category: news.category ? news.category.name : 'N/A',
            }));
            setNewsData(formattedData);
        } catch (error) { console.error("Gagal mengambil data berita:", error); }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentNews({ ...currentNews, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        setImageFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    };

    const handleRemoveNewImage = (index) => {
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (imageId) => {
        if (window.confirm('Yakin ingin menghapus gambar ini?')) {
            setImagesToDelete(prev => [...prev, imageId]);
            setCurrentNews(prev => ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }));
        }
    };

    const handleAddNew = () => {
        setCurrentNews({ id: null, title: '', category: '', status: 'DRAFT', content: '', canBeCopied: true, images: [] });
        setEditorValue(initialValue);
        setImageFiles([]);
        setImagesToDelete([]);
        setIsFormVisible(true);
    };

    const handleEdit = (news) => {
        setLoading(true);
        try {
            setCurrentNews({ ...news, category: news.category?.name || '' });
            setEditorValue(deserialize(news.content || ''));
            setImageFiles([]);
            setImagesToDelete([]);
            setIsFormVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = serialize(editorValue);
        setSubmitting(true);

        try {
            const { data: category, error: catError } = await supabase
                .from('Category')
                .upsert({ name: currentNews.category }, { onConflict: 'name' })
                .select()
                .single();
            if (catError) throw catError;

            const postData = {
                title: currentNews.title,
                content: content,
                status: currentNews.status,
                canBeCopied: currentNews.canBeCopied,
                categoryId: category.id,
                authorId: user.id
            };

            let postId = currentNews.id;
            if (postId) {
                const { error: postError } = await supabase.from('Post').update(postData).eq('id', postId);
                if (postError) throw postError;
            } else {
                const { data: newPost, error: postError } = await supabase.from('Post').insert(postData).select().single();
                if (postError) throw postError;
                postId = newPost.id;
            }

            if (imagesToDelete.length > 0) {
                const { error: deleteImgError } = await supabase.from('Image').delete().in('id', imagesToDelete);
                if (deleteImgError) throw deleteImgError;
            }

            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(file => {
                    const fileName = `berita/${postId}/${Date.now()}_${file.name}`;
                    return supabase.storage.from('berita').upload(fileName, file);
                });
                const uploadResults = await Promise.all(uploadPromises);

                const newImagesData = uploadResults.map(result => {
                    if (result.error) throw result.error;
                    const { data } = supabase.storage.from('berita').getPublicUrl(result.data.path);
                    return { postId: postId, url: data.publicUrl };
                });

                const { error: imageInsertError } = await supabase.from('Image').insert(newImagesData);
                if (imageInsertError) throw imageInsertError;
            }
            
            await fetchNews();
            setIsFormVisible(false);
            showToast('Berita berhasil disimpan', 'success');

        } catch (error) {
            showToast('Terjadi kesalahan: ' + error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus berita ini?')) {
            setLoading(true);
            try {
                await supabase.from('Image').delete().eq('postId', id);
                await supabase.from('Post').delete().eq('id', id);
                await fetchNews();
                showToast('Berita berhasil dihapus', 'success');
            } catch (error) {
                showToast('Gagal menghapus berita: ' + error.message, 'error');
                setLoading(false);
            }
        }
    };

    const filteredNews = newsData.filter(news => news.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const renderElement = useCallback(props => <Element {...props} />, []);

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                        <path d="M18 14h-8"/>
                        <path d="M15 18h-5"/>
                        <path d="M10 6h8v4h-8V6Z"/>
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Berita</h1>
                </div>
                <button 
                    onClick={handleAddNew} 
                    disabled={loading}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? <Loader2 size={20} className="mr-2 animate-spin" /> : <PlusCircle size={20} className="mr-2" />} Tambah Berita
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                            {currentNews.id ? (
                                <>
                                    <Edit size={20} className="mr-2 text-blue-500" />
                                    Edit Berita
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} className="mr-2 text-green-500" />
                                    Tambah Berita Baru
                                </>
                            )}
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => setIsFormVisible(false)} 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <XCircle size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Judul</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={currentNews.title} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:text-white" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Kategori</label>
                            <select
                                name="category"
                                value={currentNews.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:text-white"
                                required
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                <option value="Politik">Politik</option>
                                <option value="Sosial">Sosial</option>
                                <option value="Sport">Sport</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Isi Berita</label>
                            <Slate editor={editor} initialValue={editorValue} onChange={setEditorValue}>
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
                                        <Toolbar />
                                    </div>
                                    <Editable
                                        className="min-h-[200px] focus:outline-none p-4 bg-white dark:bg-gray-800 dark:text-white"
                                        placeholder="Tulis isi berita di sini..."
                                        renderElement={renderElement}
                                        renderLeaf={renderLeaf}
                                    />
                                </div>
                            </Slate>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Gambar</label>
                            {currentNews.id && currentNews.images && currentNews.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                                    {currentNews.images.map((image) => (
                                        <div key={image.id} className="relative">
                                            <img src={image.url} alt="Gambar berita" className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                            <button type="button" onClick={() => handleRemoveExistingImage(image.id)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-sm transition-colors"><XCircle size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {imageFiles.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                                    {imageFiles.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                            <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-sm transition-colors"><XCircle size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                                            <span>Pilih file (bisa lebih dari satu)</span>
                                            <input id="file-upload" name="imageFiles" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (MAX. 10MB)</p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Status</label>
                            <select 
                                name="status" 
                                value={currentNews.status} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:text-white"
                            >
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    name="canBeCopied" 
                                    checked={currentNews.canBeCopied} 
                                    onChange={handleInputChange} 
                                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700" 
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">Izinkan teks berita disalin</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsFormVisible(false)} 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={20} className="mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                        Simpan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 transition-all">
                <div className="mb-6">
                    <div className="relative max-w-md">
                        {loading ? (
                            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 animate-spin" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        )}
                        <input 
                            type="text" 
                            placeholder="Cari berita..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-full bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors" 
                            disabled={loading}
                        />
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Memuat data berita...</p>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                            <path d="M18 14h-8"/>
                            <path d="M15 18h-5"/>
                            <path d="M10 6h8v4h-8V6Z"/>
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Tidak ada berita ditemukan</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Coba ubah kata kunci pencarian atau tambahkan berita baru</p>
                        <button 
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors flex items-center dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-400"
                        >
                            <PlusCircle size={18} className="mr-2" />
                            Tambah Berita
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto animate-fadeIn">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Judul</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Kategori</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Penulis</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Status</th>
                                    <th className="text-right py-3 px-4 uppercase font-semibold text-sm text-gray-700 dark:text-gray-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNews.map(news => (
                                    <tr key={news.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{news.title}</td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{news.category}</td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{news.author}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${news.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {news.status === 'PUBLISHED' ? 'Dipublikasikan' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleEdit(news)} 
                                                disabled={loading}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Edit berita"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(news.id)} 
                                                disabled={loading}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Hapus berita"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeritaAdminPage;