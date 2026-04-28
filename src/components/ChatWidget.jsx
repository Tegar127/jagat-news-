import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Send, Headphones, X, Paperclip, FileText } from 'lucide-react';

const ChatWidget = () => {
    const { user, isAuthenticated, openModal } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Pesan selamat datang statis
    const welcomeMessage = {
        id: 'welcome-msg',
        is_admin_response: true,
        content: "Halo! Ada yang bisa kami bantu? Silakan tinggalkan pertanyaan Anda di sini.",
        message_type: 'text',
        created_at: new Date().toISOString()
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            const fetchMessages = async () => {
                const { data, error } = await supabase
                    .from('messages') // Gunakan nama tabel huruf kecil
                    .select('*')
                    .eq('sender_id', user.id)
                    .order('created_at', { ascending: true });

                if (error) console.error('Error fetching messages:', error);
                else setMessages([welcomeMessage, ...data]);
            };
            fetchMessages();

            const channel = supabase.channel(`chat:${user.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${user.id}` },
                    (payload) => {
                        setMessages(currentMessages => [...currentMessages, payload.new]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else if (isOpen) {
            setMessages([welcomeMessage]);
        }
    }, [isAuthenticated, user, isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // LOGIKA KIRIM PESAN TEKS
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;
        const tempMessage = newMessage;
        setNewMessage('');
        const { error } = await supabase.from('messages').insert({ 
            content: tempMessage, 
            sender_id: user.id, 
            is_admin_response: false, 
            message_type: 'text' 
        });
        if (error) setNewMessage(tempMessage);
    };

    // LOGIKA KIRIM FILE/GAMBAR
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !user) return;
        setUploading(true);
        try {
            const fileName = `${user.id}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('chat-attachments')
                .upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('chat-attachments').getPublicUrl(fileName);
            
            const { error: insertError } = await supabase.from('messages').insert({
                content: file.name,
                sender_id: user.id,
                is_admin_response: false,
                message_type: file.type.startsWith('image/') ? 'image' : 'file',
                file_url: data.publicUrl
            });
            if (insertError) throw insertError;

        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
            fileInputRef.current.value = null;
        }
    };
    
    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className={`
                w-[calc(100vw-2.5rem)] max-w-xs bg-card rounded-lg shadow-2xl flex flex-col h-[60vh]
                transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
                <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                    <button onClick={() => setIsOpen(false)} className="hover:opacity-75"><X size={20} /></button>
                    <div className="text-right">
                        <h2 className="text-md font-bold">Chat dengan Admin</h2>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={msg.id || `msg-${index}`} className={`flex items-end gap-2.5 ${msg.is_admin_response ? 'justify-start' : 'justify-end'}`}>
                            <div className={`flex flex-col w-full max-w-xs leading-1.5 p-3 rounded-xl ${msg.is_admin_response ? 'rounded-es-none bg-gray-100 dark:bg-gray-700' : 'rounded-ee-none bg-blue-600 text-white'}`}>
                                {msg.message_type === 'image' ? (
                                    <a href={msg.file_url} target="_blank" rel="noopener noreferrer"><img src={msg.file_url} alt={msg.content} className="rounded-lg max-w-full h-auto" /></a>
                                ) : msg.message_type === 'file' ? (
                                    <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-600 rounded-lg"><FileText className="w-6 h-6 flex-shrink-0" /><span className="text-sm font-medium truncate">{msg.content}</span></a>
                                ) : ( <p className="text-sm font-normal">{msg.content}</p> )}
                            </div>
                        </div>
                    ))}
                    {uploading && <div className="text-center text-muted-foreground text-sm">Mengunggah file...</div>}
                    <div ref={messagesEndRef} />
                </div>

                {isAuthenticated && (
                    <div className="p-3 border-t border-custom">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="p-2 text-muted-foreground hover:text-foreground"><Paperclip size={20} /></button>
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="w-full p-2 bg-input border border-custom rounded-full focus:outline-none" />
                            <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"><Send size={18} /></button>
                        </form>
                    </div>
                )}
            </div>
            
            <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 mt-4 float-right">
                {isOpen ? <X size={28} /> : <Headphones size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;