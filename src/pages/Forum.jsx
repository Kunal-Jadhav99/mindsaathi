import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, MessageCircle, Heart, AlertTriangle, Send, Plus,
  Search, Tag, Sparkles, Phone, X, LifeBuoy
} from 'lucide-react';
import { getForumPosts, createForumPost, likeForumPost } from '../utils/api';

const CATEGORIES = [
  { id: 'all',        label: 'All Topics',        emoji: '💬' },
  { id: 'stress',     label: 'Stress & Anxiety',  emoji: '🌿' },
  { id: 'academics',  label: 'Academics & Exams', emoji: '📚' },
  { id: 'social',     label: 'Relationships',    emoji: '🤝' },
  { id: 'wellbeing',  label: 'Wellbeing Tips',    emoji: '✨' },
  { id: 'general',    label: 'General Venting',   emoji: '💭' },
];

const POPULAR_TAGS = ['exam-stress', 'sleep', 'burnout', 'coping', 'counselling', 'first-year', 'placement'];

function formatTime(iso) {
  if (!iso) return 'Recently';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Forum() {
  const { user, openSOS } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('stress');
  const [selectedTags, setSelectedTags] = useState(['exam-stress']);
  const [isPosting, setPosting] = useState(false);
  const [showCompose, setCompose] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [crisisTriggered, setCrisisTriggered] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getForumPosts();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Could not load live forum posts:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    setCrisisTriggered(false);

    try {
      const res = await createForumPost(newPost.trim(), selectedCategory, selectedTags);
      
      // If suicide / severe distress was detected
      if (res.suicideTriggered) {
        setCrisisTriggered(true);
        openSOS(); // Immediately open crisis popup
      }

      setPosts(prev => [res, ...prev]);
      setNewPost('');
      setCompose(false);
    } catch (err) {
      console.error('Failed to submit post:', err);
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId) {
    if (likedPosts.has(postId)) return;

    setLikedPosts(prev => new Set(prev).add(postId));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));

    try {
      await likeForumPost(postId);
    } catch (err) {
      console.warn('Like sync failed:', err);
    }
  }

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  const visible = posts.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch =
      !search ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.pseudonym?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const sorted = [...visible].sort((a, b) => {
    if (sort === 'popular') return (b.likes + b.replies) - (a.likes + a.replies);
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }} className="animate-fade-in">
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Peer Support Forum
            </h1>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
              background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE'
            }}>
              100% Pseudonymous
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px', margin: 0 }}>
            Share your thoughts and struggles with fellow students safely. Real identities are never revealed publicly.
          </p>
        </div>

        <button
          onClick={() => setCompose(v => !v)}
          className="btn btn-primary"
          style={{ gap: '6px', padding: '8px 18px', borderRadius: '10px' }}
        >
          <Plus size={16} />
          {showCompose ? 'Close Compose' : 'Create Post'}
        </button>
      </div>

      {/* ── Crisis Banner (if triggered) ── */}
      {crisisTriggered && (
        <div style={{
          marginBottom: '20px', padding: '16px 20px', borderRadius: '12px',
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
          display: 'flex', alignItems: 'flex-start', gap: '12px'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>You are not alone — Immediate Help is Available</div>
            <p style={{ fontSize: '12px', color: '#991B1B', margin: '4px 0 8px', lineHeight: 1.5 }}>
              Your post mentioned thoughts of severe distress or self-harm. An emergency alert has been sent to the college counselling cell, and free 24/7 crisis helplines are available right now.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="tel:14416" className="btn btn-sm" style={{ background: '#DC2626', color: '#fff', fontSize: '11px', borderRadius: '6px' }}>
                <Phone size={12} /> Call Tele-MANAS (14416)
              </a>
              <button onClick={openSOS} className="btn btn-sm" style={{ background: '#fff', color: '#DC2626', border: '1px solid #FECACA', fontSize: '11px', borderRadius: '6px' }}>
                Open Crisis Support Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Compose Drawer ── */}
      {showCompose && (
        <div className="card animate-fade-in-down" style={{ marginBottom: '24px', padding: '22px', border: '1.5px solid #BFDBFE', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `${user?.avatarColor || '#2563EB'}25`, color: user?.avatarColor || '#2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px'
              }}>
                {(user?.pseudonym || 'S')[0]}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Posting as {user?.pseudonym || 'Your Pseudonym'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Your real name & email remain 100% private
                </div>
              </div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 600, color: '#16A34A', background: '#F0FDF4',
              padding: '4px 10px', borderRadius: '99px', border: '1px solid #BBF7D0'
            }}>
              <Shield size={12} /> Safety Triage Active
            </span>
          </div>

          <form onSubmit={handlePost}>
            <textarea
              className="textarea"
              placeholder="What's on your mind? Share your thoughts, ask for advice on exam stress, or talk about what you're experiencing..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '1px solid var(--border)', fontSize: '14px', lineHeight: 1.6,
                background: '#FFFFFF', marginBottom: '14px', resize: 'vertical'
              }}
            />

            {/* Category & Tags selector */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Topic Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px',
                    border: '1px solid var(--border)', background: '#fff', color: 'var(--text-primary)', fontWeight: 500
                  }}
                >
                  <option value="stress">Stress & Anxiety</option>
                  <option value="academics">Academics & Exams</option>
                  <option value="social">Relationships</option>
                  <option value="wellbeing">Wellbeing Tips</option>
                  <option value="general">General Venting</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Tags
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {POPULAR_TAGS.map(tag => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{
                          fontSize: '11px', padding: '3px 9px', borderRadius: '6px', fontWeight: 600,
                          border: active ? '1px solid #2563EB' : '1px solid var(--border)',
                          background: active ? '#EFF6FF' : '#fff',
                          color: active ? '#2563EB' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} style={{ color: '#2563EB' }} /> Posts with severe distress triggers are automatically escalated to support.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setCompose(false)} className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!newPost.trim() || isPosting} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 16px' }}>
                  <Send size={13} />
                  {isPosting ? 'Publishing…' : 'Post to Forum'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Main Layout (Sidebar + Post Feed) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Categories card */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
              Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {CATEGORIES.map(cat => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px', border: 'none',
                      fontSize: '13px', fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#2563EB' : 'var(--text-primary)',
                      background: isActive ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s ease'
                    }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="card" style={{ padding: '16px', background: '#F8FAFC', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#16A34A', marginBottom: '6px' }}>
              <Shield size={14} /> Community Standards
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              This is a safe, empathetic space. Please respect others. If you are experiencing a crisis, the floating SOS button is available anytime.
            </p>
          </div>
        </div>

        {/* Right Feed Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Filter / Search Bar */}
          <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input"
                placeholder="Search topics, pseudonyms, or #tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '34px', fontSize: '13px', height: '36px', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                  border: '1px solid var(--border)', background: '#fff', color: 'var(--text-primary)', fontWeight: 600
                }}
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid #BFDBFE', borderTopColor: '#2563EB', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: '13px', margin: 0 }}>Loading peer posts…</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MessageCircle size={32} style={{ opacity: 0.35, margin: '0 auto 10px', color: 'var(--primary)' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>No posts found</div>
              <p style={{ fontSize: '12px', marginTop: '4px', margin: 0 }}>
                Be the first to share your thoughts in this category!
              </p>
            </div>
          ) : (
            sorted.map(post => {
              const isLiked = likedPosts.has(post.id);
              const isFlagged = post.moderationStatus === 'flagged';

              return (
                <div
                  key={post.id}
                  className="card"
                  style={{
                    padding: '20px', transition: 'box-shadow 0.15s ease',
                    border: isFlagged ? '1px solid #FECACA' : '1px solid var(--border)',
                    background: isFlagged ? '#FFF5F5' : 'var(--surface)'
                  }}
                >
                  {/* Flagged Banner if crisis or toxic */}
                  {isFlagged && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px', background: '#FEF2F2',
                      border: '1px solid #FECACA', color: '#DC2626', fontSize: '12px',
                      fontWeight: 600, marginBottom: '14px'
                    }}>
                      <AlertTriangle size={15} />
                      <span>Post under confidential safety review · Support resources dispatched</span>
                    </div>
                  )}

                  {/* Author Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: `${post.avatarColor || '#2563EB'}20`, color: post.avatarColor || '#2563EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px',
                        border: `1px solid ${post.avatarColor || '#2563EB'}40`
                      }}>
                        {(post.pseudonym || 'U')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {post.pseudonym || 'AnonymousStudent'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                          {formatTime(post.timestamp)}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                      background: '#F1F5F9', color: '#475569', textTransform: 'capitalize'
                    }}>
                      {post.category || 'General'}
                    </span>
                  </div>

                  {/* Content */}
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 14px 0', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </p>

                  {/* Tags */}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '11px', fontWeight: 600, color: '#2563EB',
                            background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px',
                            border: '1px solid #DBEAFE'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 600, border: 'none', background: 'transparent',
                        color: isLiked ? '#DC2626' : 'var(--text-muted)', cursor: 'pointer', padding: 0,
                        transition: 'color 0.12s ease'
                      }}
                    >
                      <Heart size={15} fill={isLiked ? '#DC2626' : 'none'} />
                      <span>{post.likes || 0}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
                      <MessageCircle size={15} />
                      <span>{post.replies || 0} replies</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
