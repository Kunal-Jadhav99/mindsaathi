import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User as UserIcon, AlertTriangle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TOPICS = [
  { id: 't1', title: 'Managing exam stress', badge: 'Active', badgeColor: '#16A34A' },
  { id: 't2', title: 'Dealing with loneliness', badge: null },
  { id: 't3', title: 'Sleep problems', badge: null },
  { id: 't4', title: 'Social anxiety', badge: null },
];

export default function Chat() {
  const { chatMessages, addChatMessage } = useApp();
  const [input, setInput]     = useState('');
  const [isTyping, setTyping] = useState(false);
  const [activeTopicId, setTopic] = useState('t1');
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
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const distress = ['sad','kill','die','hurt','overwhelmed','depressed','anxious'];
      const isDistressed = distress.some(w => userMsg.content.toLowerCase().includes(w));

      addChatMessage({
        id: `m_${Date.now() + 1}`,
        role: 'bot',
        content: isDistressed
          ? "I'm hearing that things are really difficult right now. Your wellbeing is important. Could we take 3 minutes to do a quick check-in? It helps me understand how best to support you."
          : "I hear you. Dealing with that isn't easy. What has helped you manage similar situations in the past?",
        timestamp: new Date().toISOString(),
        triggeredCheckin: isDistressed,
      });
    }, 1500);
  }

  function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden' }}>

      {/* ── Left: conversation list ── */}
      <div style={{
        width: '260px', flexShrink: 0,
        borderRight: '1px solid var(--border)',
        background: '#fff', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Conversations</div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>+ New Chat</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setTopic(topic.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
                background: activeTopicId === topic.id ? 'var(--primary-light)' : 'transparent',
                borderLeft: `3px solid ${activeTopicId === topic.id ? 'var(--primary)' : 'transparent'}`,
                transition: 'background 0.1s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: activeTopicId === topic.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={10} />
                  {chatMessages.length} messages
                </div>
              </div>
              {topic.badge && (
                <span className="badge" style={{ background: topic.badgeColor + '20', color: topic.badgeColor, fontSize: '10px' }}>
                  {topic.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: chat area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>

        {/* Chat header */}
        <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {TOPICS.find(t => t.id === activeTopicId)?.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MindSaathi AI · always here to listen</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {chatMessages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: '10px', maxWidth: '75%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--primary-light)' : '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: msg.role === 'user' ? 'var(--primary)' : 'var(--text-muted)',
              }}>
                {msg.role === 'user' ? <UserIcon size={13} /> : <Bot size={13} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                  background: msg.role === 'user' ? 'var(--primary)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
                  fontSize: '14px', lineHeight: 1.55,
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{fmtTime(msg.timestamp)}</span>
                {msg.triggeredCheckin && (
                  <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--warning-light)', border: '1px solid #FDE68A', maxWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <AlertTriangle size={13} style={{ color: '#B45309' }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>Recommended action</span>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => navigate('/checkin')}>
                      Start Check-in
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', maxWidth: '75%' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: '#fff', border: '1px solid var(--border)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1.2s infinite', animationDelay: `${delay}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: '12px 20px 16px', background: '#fff', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={send} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              disabled={!input.trim() || isTyping}
              style={{ width: '40px', height: '40px', flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </form>
          <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '6px', textAlign: 'center' }}>
            Prototype: responses are simulated. Production connects to a Python NLP microservice.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
