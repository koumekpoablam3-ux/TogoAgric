'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '🌱 Bienvenue sur TogoAgric ! Je suis AgriBot, votre assistant agricole intelligent. Je connais les prix, les marchés, les cultures et bien plus ! Posez-moi n\'importe quelle question. 🇹🇬' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Désolé, je n\'ai pas compris.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Erreur de connexion. Vérifiez que le serveur est en marche.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    '🌽 Prix du maïs',
    '🍅 Cultiver tomate',
    '🏪 Marchés Lomé',
    '📱 T-Money',
    '🌤️ Calendrier',
    '💰 Crédit agricole',
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && !minimized && (
        <div className="fixed bottom-20 right-3 sm:right-5 z-[90] w-[290px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-slide-in" style={{ height: '380px' }}>
          {/* Header with admin photo */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 p-4 text-white flex items-center gap-3 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-white/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 border-4 border-white/20 rounded-full" />
            </div>
            <div className="relative">
              <img
                src="/admin-photo.png"
                alt="AgriBot"
                className="w-11 h-11 rounded-full object-cover border-2 border-white/40 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex-1 relative">
              <h3 className="font-bold text-sm flex items-center gap-1.5">AgriBot <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">IA</span></h3>
              <p className="text-xs text-green-100">Assistant agricole du Togo</p>
            </div>
            <div className="flex items-center gap-1 relative">
              <button onClick={() => setMinimized(true)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <span className="text-sm font-bold">—</span>
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-gray-50 to-gray-100/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 animate-chat-message ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  {msg.role === 'bot' ? (
                    <img src="/admin-photo.png" alt="Bot" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-tr-md shadow-sm'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 animate-chat-message">
                <div className="w-7 h-7 rounded-full shadow-sm">
                  <img src="/admin-photo.png" alt="Bot" className="w-7 h-7 rounded-full object-cover" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                    <span className="text-sm text-gray-500">AgriBot réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto shrink-0">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="whitespace-nowrap text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 hover:border-green-300 transition shrink-0 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Posez votre question agricole..."
                className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">AgriBot — Assistant TogoAgric | 🇹🇬</p>
          </div>
        </div>
      )}

      {/* Minimized bubble with photo */}
      {isOpen && minimized && (
        <div
          onClick={() => setMinimized(false)}
          className="fixed bottom-20 right-3 sm:right-5 z-[90] bg-white rounded-full px-3 py-2 shadow-xl border border-gray-200 cursor-pointer hover:shadow-2xl transition flex items-center gap-2 animate-fade-in-up"
        >
          <img src="/admin-photo.png" alt="AgriBot" className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs font-bold text-gray-700">AgriBot</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setMinimized(false); }}
        className={`fixed bottom-5 right-3 sm:right-5 z-[90] w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-2xl'
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>
    </>
  );
}
