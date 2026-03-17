'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import styles from './Chat.module.css';
import glass from '@/styles/glass.module.css';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial message from the AI (acts as greeting)
    const { messages, sendMessage, setMessages, status } = useChat({
        messages: [
            { id: 'welcome', role: 'assistant', parts: [{ type: 'text', text: '¡Hola! Soy StephanoBot. Más que un chatbot, soy tu socio estratégico para aterrizar esa idea que tienes en mente. ¿De qué trata tu proyecto o negocio?' }] }
        ]
    });
    
    const isLoading = status === 'submitted' || status === 'streaming';

    const [chatInput, setChatInput] = useState('');
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [projectSummary, setProjectSummary] = useState<{
        tipo_proyecto?: string;
        presupuesto_estimado?: string;
        resumen?: string;
        features?: string[];
        nombre?: string;
        empresa?: string;
    } | null>(null);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Check if there's any completed tool invocation that captured the lead
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.parts) {
            const capturePart = lastMessage.parts.find((p: any) => p.type === 'tool-captureLead' && p.state === 'output-available');
            if (capturePart && (capturePart as any).output) {
                const leadData = (capturePart as any).output.leadData;
                if (leadData?.nombre && leadData?.email) {
                    setLeadCaptured(true);
                    setProjectSummary(leadData);
                }
            }
        }
    }, [messages]);

    const resetChat = () => {
        setMessages([
            { id: 'welcome', role: 'assistant', parts: [{ type: 'text', text: '¡Hola! Soy StephanoBot. Más que un chatbot, soy tu socio estratégico para aterrizar esa idea que tienes en mente. ¿De qué trata tu proyecto o negocio?' }] }
        ]);
        setLeadCaptured(false);
        setProjectSummary(null);
    };

    const whatsappLink = useMemo(() => {
        if (!projectSummary) return '';
        const text = encodeURIComponent(`*CONSULTORÍA STEPHANOBOT | CONFIGURACIÓN IA*
---------------------------------------
CLIENTE: ${projectSummary.nombre || 'N/A'} (${projectSummary.empresa || 'Independiente'})
NÚCLEO: ${projectSummary.tipo_proyecto?.toUpperCase() || 'N/A'}
RESUMEN: ${projectSummary.resumen || ''}
COMPONENTES: ${projectSummary.features?.join(', ') || 'Base'}
ESTIMADO INGENIERÍA: ${projectSummary.presupuesto_estimado || 'N/A'}
---------------------------------------
Hola Stephano, acabo de terminar el diagnóstico conversacional con el bot. ¿Podemos revisar estos parámetros?`);
        return `https://wa.me/50671164454?text=${text}`;
    }, [projectSummary]);

    return (
        <>
            <div className={styles.chatToggleWrapper}>
                <AnimatePresence>
                    {!open && (
                        <motion.div
                            className={styles.chatTooltip}
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ delay: 1, duration: 0.4 }}
                        >
                            <div className={styles.tooltipDot} />
                            ¡Hola! Estoy disponible para ayudarte
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button className={styles.chatToggle} onClick={() => setOpen(!open)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Chat">
                    {open ? '✕' : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8V4H8" />
                            <rect width="16" height="12" x="4" y="8" rx="2" />
                            <path d="M2 14h2" />
                            <path d="M20 14h2" />
                            <path d="M15 13v2" />
                            <path d="M9 13v2" />
                        </svg>
                    )}
                </motion.button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.25 }}>

                        <div className={styles.chatHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#00E5FF', borderRadius: '50%', boxShadow: '0 0 10px #00E5FF', animation: isLoading ? 'pulse 1s infinite alternate' : 'none' }} />
                                <div>
                                    <div className={styles.chatHeaderTitle}>StephanoBot <span style={{ fontSize: '9px', opacity: 0.4, fontWeight: 400 }}>v3.0 (AI)</span></div>
                                    <div className={styles.chatHeaderStatus}>Terminal de Ingeniería de Software</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button className={styles.chatReset} onClick={resetChat} title="Reiniciar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                </button>
                                <button className={styles.chatClose} onClick={() => setOpen(false)}>✕</button>
                            </div>
                        </div>

                        {/* --- Live Scope Summary (Visible after Tool Calling extraction) --- */}
                        {projectSummary && projectSummary.tipo_proyecto && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                style={{ background: 'rgba(0,102,255,0.08)', borderBottom: '1px solid rgba(0,102,255,0.15)', padding: '12px 16px', fontSize: '11px', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.05), transparent)', animation: 'shimmer 2s infinite' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', position: 'relative' }}>
                                    <div>
                                        <div style={{ opacity: 0.5, fontSize: '9px', letterSpacing: '0.05em' }}>CORE ARCHITECTURE</div>
                                        <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '12px' }}>{projectSummary.tipo_proyecto.toUpperCase()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ opacity: 0.5, fontSize: '9px', letterSpacing: '0.05em' }}>ENGINEERING RANGE</div>
                                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>{projectSummary.presupuesto_estimado}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className={styles.chatMessages}>
                            {messages.map((msg: any) => {
                                // Extract only text parts; skip messages with no text (e.g. pure tool calls)
                                const textParts = (msg.parts ?? []).filter((p: any) => p.type === 'text');
                                if (textParts.length === 0) return null;
                                const text = textParts.map((p: any) => p.text).join('');

                                return (
                                    <div key={msg.id} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgAssistant}`}>
                                        {text}
                                    </div>
                                );
                            })}
                            
                            {isLoading && (
                                <div className={styles.msgAssistant} style={{ width: '40px', display: 'flex', gap: '4px', padding: '12px' }}>
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }} />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }} />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }} />
                                </div>
                            )}
                            
                            {leadCaptured && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '15px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                        <a
                                            href={whatsappLink}
                                            target="_blank" rel="noopener noreferrer"
                                            className={glass.btnSecondary} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                            <span>Contactar por WhatsApp</span>
                                        </a>
                                        <a
                                            href="/cotizar"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
                                        >
                                            <span>Ir a Cotizador Clásico</span>
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {!leadCaptured && (
                            <form className={styles.chatInputArea} onSubmit={(e) => {
                                e.preventDefault();
                                if (!chatInput.trim() || isLoading) return;
                                sendMessage({ text: chatInput });
                                setChatInput('');
                            }}>
                                <input 
                                    className={styles.chatInput} 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Describe tu idea o pregúntame algo..." 
                                    disabled={isLoading}
                                />
                                <button className={styles.chatSend} type="submit" disabled={!chatInput.trim() || isLoading}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
