import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_FORUM_POSTS } from '../data/mockData';
import { Shield, MessageCircle, Heart, Share2, AlertTriangle, Send } from 'lucide-react';

export default function Forum() {
  const { user } = useApp();
  const [posts, setPosts] = useState(MOCK_FORUM_POSTS);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  function handlePost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;
    setIsPosting(true);

    // Simulate NLP moderation delay
    setTimeout(() => {
      const toxicWords = ['stupid', 'idiot', 'hate', 'ugly', 'dumb'];
      const isToxic = toxicWords.some(w => newPost.toLowerCase().includes(w));
      
      const post = {
        id: `fp_${Date.now()}`,
        pseudonym: user.pseudonym,
        avatarColor: user.avatarColor,
        content: newPost.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
        tags: [],
        moderationStatus: isToxic ? 'flagged' : 'pending',
      };

      setPosts([post, ...posts]);
      setNewPost('');
      setIsPosting(false);

      if (!isToxic) {
        // Simulate approval after a few seconds
        setTimeout(() => {
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, moderationStatus: 'approved' } : p));
        }, 3000);
      }
    }, 1200);
  }

  function formatTime(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1>Peer Forum</h1>
          <p>A safe, pseudonymous space to share and support each other.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-lg">
          <Shield size={14} className="text-brand-400" />
          <span className="text-xs font-semibold text-brand-400">NLP Moderated</span>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Create Post */}
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                 style={{ backgroundColor: `${user.avatarColor}25`, color: user.avatarColor }}>
              {user.pseudonym[0]}
            </div>
            <span className="text-sm font-semibold text-slate-200">Posting as {user.pseudonym}</span>
          </div>
          <form onSubmit={handlePost}>
            <textarea
              className="textarea w-full min-h-[100px] mb-3"
              placeholder="What's on your mind? Share your thoughts, ask for advice, or just vent..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500 max-w-[60%] leading-relaxed">
                Posts are automatically reviewed by our AI moderation system to maintain a safe, supportive environment.
              </p>
              <button type="submit" disabled={!newPost.trim() || isPosting} className="btn btn-primary">
                {isPosting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Post</>}
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="card p-5 relative overflow-hidden group">
              {post.moderationStatus === 'pending' && (
                <div className="absolute inset-0 bg-bg-900/80 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-400/10 border border-orange-400/30 rounded-full text-orange-400 text-xs font-semibold">
                    <span className="w-3 h-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                    Reviewing post...
                  </div>
                </div>
              )}
              {post.moderationStatus === 'flagged' && (
                <div className="absolute inset-0 bg-bg-900/95 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="text-center px-6">
                    <AlertTriangle size={24} className="text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-200 mb-1">Post Flagged</p>
                    <p className="text-xs text-slate-500">This post violates our community guidelines for respectful communication.</p>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                       style={{ backgroundColor: `${post.avatarColor}25`, color: post.avatarColor }}>
                    {post.pseudonym[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{post.pseudonym}</p>
                    <p className="text-[11px] text-slate-500">{formatTime(post.timestamp)}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-1 rounded-md bg-surface-subtle text-slate-400">#{t}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-surface-subtle">
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-400 transition-colors">
                  <Heart size={15} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-400 transition-colors">
                  <MessageCircle size={15} /> {post.replies}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-400 transition-colors ml-auto">
                  <Share2 size={15} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
