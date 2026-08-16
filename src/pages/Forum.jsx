import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_FORUM_POSTS } from '../data/mockData';
import { Shield, MessageCircle, Heart, AlertTriangle, Send, Plus, Search, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { id: 'all',        label: 'All Topics' },
  { id: 'stress',     label: 'Stress & Anxiety' },
  { id: 'academics',  label: 'Academics' },
  { id: 'social',     label: 'Relationships' },
  { id: 'wellbeing',  label: 'Wellbeing Tips' },
  { id: 'general',    label: 'General' },
];

const GUIDELINES = [
  'Be kind and respectful',
  'Share to support, not to judge',
];

function formatTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Forum() {
  const { user } = useApp();
  const [posts, setPosts]         = useState(MOCK_FORUM_POSTS);
  const [category, setCategory]   = useState('all');
  const [newPost, setNewPost]     = useState('');
  const [isPosting, setPosting]   = useState(false);
  const [showCompose, setCompose] = useState(false);
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('latest');

  function handlePost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    setTimeout(() => {
      const toxic = ['stupid','idiot','hate','ugly','dumb'];
      const isToxic = toxic.some(w => newPost.toLowerCase().includes(w));
      const post = {
        id: `fp_${Date.now()}`,
        pseudonym: user.pseudonym,
        avatarColor: user.avatarColor,
        content: newPost.trim(),
        timestamp: new Date().toISOString(),
        likes: 0, replies: 0, tags: [],
        moderationStatus: isToxic ? 'flagged' : 'pending',
      };
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setPosting(false);
      setCompose(false);
      if (!isToxic) {
        setTimeout(() => {
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, moderationStatus: 'approved' } : p));
        }, 3000);
      }
    }, 1200);
  }

  const visible = posts.filter(p => {
    const matchSearch = !search || p.content.toLowerCase().includes(search.toLowerCase()) || p.pseudonym.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const sorted = [...visible].sort((a, b) => {
    if (sort === 'popular') return (b.likes + b.replies) - (a.likes + a.replies);
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden' }}>

      {/* ── Left: categories ── */}
      <div style={{ width: '220px', flexShrink: 0, borderRight: '1px solid var(--border)', background: '#fff', display: 'flex', flexDirection: 'column', padding: '16px 12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
          All Topics
        </div>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
            width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px',
            fontSize: '13px', fontWeight: category === cat.id ? 600 : 500,
            color: category === cat.id ? 'var(--primary)' : 'var(--text-muted)',
            background: category === cat.id ? 'var(--primary-light)' : 'transparent',
            border: 'none', cursor: 'pointer', transition: 'all 0.1s', marginBottom: '2px',
          }}>
            {cat.label}
          </button>
        ))}

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
            Helpful Guidelines
          </div>
          {GUIDELINES.map(g => (
            <div key={g} style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 8px', lineHeight: 1.5 }}>
              • {g}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: posts ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input className="input" placeholder="Search topics..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '30px', height: '36px', fontSize: '13px' }} />
          </div>
          <select
            value={sort} onChange={e => setSort(e.target.value)}
            className="input" style={{ width: '120px', height: '36px', fontSize: '13px' }}
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
          </select>
          <button className="btn btn-primary btn-sm" style={{ gap: '5px', whiteSpace: 'nowrap' }} onClick={() => setCompose(v => !v)}>
            <Plus size={14} /> New Post
          </button>
        </div>

        {/* Compose panel */}
        {showCompose && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--page-bg)' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user.avatarColor + '20', color: user.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                  {user.pseudonym[0]}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Posting as {user.pseudonym}</span>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                  <Shield size={9} />NLP Moderated
                </span>
              </div>
              <form onSubmit={handlePost}>
                <textarea
                  className="textarea"
                  placeholder="What's on your mind? Share your thoughts, ask for advice, or just vent..."
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  style={{ minHeight: '90px', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-faint)', maxWidth: '55%', lineHeight: 1.5 }}>
                    Posts are automatically reviewed by our AI moderation system to keep this space safe and supportive.
                  </p>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim() || isPosting}>
                    {isPosting ? <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> : <><Send size={13} /> Post</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sorted.map(post => (
            <div key={post.id} className="card" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
              {/* Pending overlay */}
              {post.moderationStatus === 'pending' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '99px', background: 'var(--warning-light)', border: '1px solid #FDE68A', fontSize: '12px', fontWeight: 600, color: '#B45309' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #FDE68A', borderTop: '2px solid #B45309', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Reviewing post...
                  </div>
                </div>
              )}
              {post.moderationStatus === 'flagged' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ textAlign: 'center', padding: '0 24px' }}>
                    <AlertTriangle size={22} style={{ color: 'var(--danger)', margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>Post Flagged</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This post violates our community guidelines.</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: post.avatarColor + '20', color: post.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                    {post.pseudonym[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{post.pseudonym}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{formatTime(post.timestamp)}</div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{post.content}</p>

              {post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {post.tags.map(t => (
                    <span key={t} className="badge badge-gray">#{t}</span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Heart size={14} /> {post.likes}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <MessageCircle size={14} /> {post.replies} replies
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <TrendingUp size={13} /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
