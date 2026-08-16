import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const { chatMessages, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  function send(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Mock NLP response
    setTimeout(() => {
      setIsTyping(false);
      const distressWords = ['sad', 'kill', 'die', 'hurt', 'overwhelmed', 'depressed', 'anxious'];
      const isDistressed = distressWords.some(w => userMsg.content.toLowerCase().includes(w));

      if (isDistressed) {
        addChatMessage({
          id: `m_${Date.now() + 1}`,
          role: 'bot',
          content: "I'm hearing that things are really difficult right now. Your wellbeing is important. Could we take 3 minutes to do a quick check-in? It helps me understand how best to support you.",
          timestamp: new Date().toISOString(),
          triggeredCheckin: true,
        });
      } else {
        addChatMessage({
          id: `m_${Date.now() + 1}`,
          role: 'bot',
          content: "I hear you. Dealing with that isn't easy. What has helped you manage similar situations in the past?",
          timestamp: new Date().toISOString(),
        });
      }
    }, 1500);
  }

  return (
    <div className="page flex flex-col h-screen animate-fade-in pb-0 pr-0">
      <div className="page-header mb-4 pr-10">
        <h1 className="flex items-center gap-2"><Bot size={22} className="text-brand-400" /> AI Support</h1>
        <p>A private space to talk. Powered by NLP to detect when you might need extra help.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-10 pb-4 space-y-4">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-border text-slate-300'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-500/20 border border-brand-500/30 text-slate-100 rounded-tr-sm' 
                  : 'bg-bg-800 border border-surface-border text-slate-200 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              
              {msg.triggeredCheckin && (
                <div className="mt-2 p-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 max-w-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">Recommended action</span>
                  </div>
                  <button onClick={() => navigate('/checkin')} className="btn btn-sm btn-primary w-full justify-center">
                    Start Check-in
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-border text-slate-300 flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="p-3 rounded-2xl bg-bg-800 border border-surface-border rounded-tl-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="pt-4 pb-10 pr-10 border-t border-surface-subtle bg-bg-950">
        <form onSubmit={send} className="relative">
          <input
            type="text"
            className="input pr-12 bg-bg-900"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400
                       flex items-center justify-center hover:bg-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Send size={14} />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          In a prototype, responses are simulated. In production, this connects to a Python NLP microservice.
        </p>
      </div>
    </div>
  );
}
