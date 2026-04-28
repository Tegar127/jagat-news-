import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatAdminPage = () => {
    const { user: adminUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Mengambil daftar percakapan dari pengguna
    useEffect(() => {
        const fetchConversations = async () => {
            const { data, error } = await supabase.rpc('get_conversations');
            if (error) {
                console.error('Error fetching conversations:', error);
            } else {
                setConversations(data);
            }
        };
        fetchConversations();
    }, []);

    // Mengambil dan memantau pesan untuk percakapan yang dipilih
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:User(name, avatar)')
                .eq('sender_id', selectedUser.sender_id)
                .order('created_at', { ascending: true });
            
            if (error) console.error('Error fetching messages:', error);
            else setMessages(data);
            setLoadingMessages(false);
        };
        fetchMessages();
        
        const channel = supabase.channel(`admin-chat:${selectedUser.sender_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${selectedUser.sender_id}` },
                (payload) => {
                    setMessages(currentMessages => [...currentMessages, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mengirim balasan sebagai admin
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (reply.trim() === '' || !selectedUser) return;

        const replyData = {
            content: reply,
            sender_id: selectedUser.sender_id, // Tetap gunakan ID user agar masuk ke percakapan yang sama
            is_admin_response: true
        };
        
        setReply('');
        const { error } = await supabase.from('messages').insert(replyData);
        if (error) {
            console.error('Error sending reply:', error);
            setReply(replyData.content); // Kembalikan teks jika gagal
        }
    };

    return (
        <div className="flex bg-card text-card-foreground rounded-lg shadow-lg border border-custom h-[calc(100vh-120px)]">
            {/* Daftar Percakapan */}
            <div className="w-1/3 border-r border-custom flex flex-col">
                <div className="p-4 border-b border-custom">
                    <h2 className="text-lg font-bold">Percakapan Pengguna</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {conversations.map(conv => (
                        <div key={conv.sender_id} onClick={() => setSelectedUser(conv)} className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-custom ${selectedUser?.sender_id === conv.sender_id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                            <p className="font-semibold">{conv.name || 'User Tanpa Nama'}</p>
                            <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jendela Chat */}
            <div className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-custom">
                            <h2 className="font-bold">{selectedUser.name || 'User Tanpa Nama'}</h2>
                            <p className="text-xs text-muted-foreground">{selectedUser.sender_id}</p>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background">
                            {loadingMessages ? (
                                <p className="text-center text-muted-foreground">Memuat pesan...</p>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className={`flex items-end gap-2.5 ${!msg.is_admin_response ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`flex flex-col w-full max-w-md leading-1.5 p-3 rounded-xl ${!msg.is_admin_response ? 'rounded-es-none bg-white dark:bg-gray-700' : 'rounded-ee-none bg-blue-600 text-white'}`}>
                                            <p className="text-sm font-normal">{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                             <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-custom">
                            <form onSubmit={handleSendReply} className="flex items-center space-x-2">
                                <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder="Ketik balasan sebagai admin..." className="w-full p-3 bg-input border border-custom rounded-full focus:outline-none" />
                                <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Pilih percakapan untuk memulai</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatAdminPage;