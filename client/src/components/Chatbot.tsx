import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X } from 'lucide-react';
import type { IChatbotResponse } from '../types';

interface ChatbotProps {
    onTaskChange: () => void;
}

interface Message {
    text: string;
    isBot: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Chatbot: React.FC<ChatbotProps> = ({ onTaskChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Hello! How can I help you manage your tasks today?', isBot: true }
    ]);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInput('');
        setIsSending(true);

        try {
            const response = await axios.post(`${API_URL}/chatbot`, { message: userMessage });
            const data: IChatbotResponse = response.data;

            setMessages(prev => [...prev, { text: data.reply, isBot: true }]);

            if (data.action !== null) {
                onTaskChange();
            }
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again later.', isBot: true }]);
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) {
        return (
            <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div className="chatbot">
            <div className="chatbot-header">
                <div className="chatbot-header-content">
                    <h3>Task Assistant</h3>
                    <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div className="chatbot-messages" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                />
                <button type="submit" disabled={isSending}>Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
