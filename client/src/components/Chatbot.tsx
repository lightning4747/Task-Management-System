import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import type { IChatbotResponse } from '../types';

interface Message {
    text: string;
    isBot: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Keywords that indicate the bot performed a data-mutating action
const MUTATION_KEYWORDS = ['moved', 'deleted', 'renamed', 'updated'];

/**
 * Dispatch task-updated so Board.tsx re-fetches immediately,
 * keeping the UI in sync without a page reload.
 */
function notifyBoard() {
    window.dispatchEvent(new CustomEvent('task-updated'));
}

const PLACEHOLDER_HINTS = [
    'move 5 to In Progress',
    'delete 12',
    'update 3 title: Fix login bug',
    'help',
];

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [hintIdx, setHintIdx] = useState(0);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: 'Hi! I can move, delete, or rename tasks for you.\nType "help" to see all commands.',
            isBot: true,
        },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to newest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // Cycle placeholder hints so the user knows the syntax
    useEffect(() => {
        if (!isOpen) return;
        const id = setInterval(() => setHintIdx(i => (i + 1) % PLACEHOLDER_HINTS.length), 10000);
        return () => clearInterval(id);
    }, [isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const text = input.trim();
        if (!text || isSending) return;

        // Add user message immediately
        setMessages(prev => [...prev, { text, isBot: false }]);
        setInput('');
        setIsSending(true);

        try {
            const { data } = await axios.post<IChatbotResponse>(`${API_URL}/chatbot`, { message: text });
            const reply = data.message;

            setMessages(prev => [...prev, { text: reply, isBot: true }]);

            // Re-fetch the board if the bot performed a data mutation
            const lower = reply.toLowerCase();
            if (MUTATION_KEYWORDS.some(kw => lower.includes(kw))) {
                notifyBoard();
            }
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [
                ...prev,
                { text: 'Sorry, something went wrong. Please try again.', isBot: true },
            ]);
        } finally {
            setIsSending(false);
            // Re-focus the input for quick follow-up commands
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    };

    // ── Collapsed toggle button ───────────────────────────────────────────
    if (!isOpen) {
        return (
            <button
                className="chatbot-toggle-btn"
                onClick={() => setIsOpen(true)}
                title="Open Task Assistant"
                aria-label="Open chatbot"
            >
                <MessageCircle size={26} />
            </button>
        );
    }

    // ── Expanded panel ────────────────────────────────────────────────────
    return (
        <div className="chatbot" role="dialog" aria-label="Task Assistant">
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-header-content">
                    <h3>Task Assistant</h3>
                    <button
                        className="chatbot-close-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chatbot"
                    >
                        <X size={18} />
                    </button>
                </div>
                {/* Subtle command hint strip */}
                <p className="chatbot-hint">
                    e.g. <code>{PLACEHOLDER_HINTS[hintIdx]}</code>
                </p>
            </div>

            {/* Messages */}
            <div className="chatbot-messages" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                        {/* Preserve newlines from multi-line bot responses */}
                        {msg.text.split('\n').map((line, j) => (
                            <span key={j}>
                                {line}
                                {j < msg.text.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </div>
                ))}
                {isSending && (
                    <div className="message bot chatbot-typing">
                        <span /><span /><span />
                    </div>
                )}
            </div>

            {/* Input */}
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Try: ${PLACEHOLDER_HINTS[hintIdx]}`}
                    disabled={isSending}
                    aria-label="Chat input"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    aria-label="Send"
                >
                    <Send size={15} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
