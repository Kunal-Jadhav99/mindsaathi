import { useState } from 'react';
import { PenLine, Plus, Tag, Search, Lock } from 'lucide-react';

const MOODS = [
  { key: 'awful', emoji: '😞', label: 'Very Bad'  },
  { key: 'bad',   emoji: '😔', label: 'Bad'       },
  { key: 'okay',  emoji: '😐', label: 'Okay'      },
  { key: 'good',  emoji: '🙂', label: 'Good'      },
  { key: 'great', emoji: '😄', label: 'Great'     },
];

const MOOD_COLOR = {
  awful: '#EF4444', bad: '#F97316', okay: '#F59E0B', good: '#22C55E', great: '#10B981',
};

const PROMPTS = [
  "What's one thing that went well today?",
  "Describe a moment today when you felt calm or at ease.",
  "What's something you're looking forward to?",
  "What challenged you today and how did you respond?",
  "What would make tomorrow a good day?",
];

const MOCK_ENTRIES = [
  { id: 'e1', date: '2026-08-16', title: 'A good day overall', mood: 'good',  preview: 'Today went better than I expected. I was productive in the morning and finished my assignments early...' },
  { id: 'e2', date: '2026-08-14', title: 'Feeling a bit overwhelmed', mood: 'bad', preview: "There's just too much to handle at once. The deadlines are piling up and I feel like I can't keep up..." },
  { id: 'e3', date: '2026-08-11', title: 'Grateful for small wins', mood: 'okay', preview: 'Even though the week was tough, I managed to finish one chapter and go for a short walk outside...' },
  { id: 'e4', date: '2026-08-08', title: 'Tough day', mood: 'awful', preview: "Couldn't focus at all. Everything felt heavy. But I talked to a friend which helped a little..." },
  { id: 'e5', date: '2026-08-05', title: 'Looking forward', mood: 'great', preview: 'Feeling more optimistic today. Set some small goals for the week and I think they are achievable...' },
];

function formatEntryDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Journal() {
  const [entries, setEntries]   = useState(MOCK_ENTRIES);
  const [selected, setSelected] = useState(MOCK_ENTRIES[0]);
  const [isNew, setIsNew]       = useState(false);
  const [text, setText]         = useState('');
  const [mood, setMood]         = useState(null);
  const [saved, setSaved]       = useState(false);
  const [search, setSearch]     = useState('');
  const [prompt]                = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.preview.toLowerCase().includes(search.toLowerCase())
  );

  function startNew() {
    setIsNew(true);
    setSelected(null);
    setText('');
    setMood(null);
    setSaved(false);
  }

  function saveEntry() {
    if (!text.trim()) return;
    const entry = {
      id: `e_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: text.trim().slice(0, 48) + (text.trim().length > 48 ? '…' : ''),
      mood: mood ?? 'okay',
      preview: text.trim(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    setSelected(entry);
    setIsNew(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden' }}>

      {/* ── Left: entry list ── */}
      <div style={{
        width: '280px', flexShrink: 0, borderRight: '1px solid var(--border)',
        background: '#fff', display: 'flex', flexDirection: 'column',
      }}>
        {/* List header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>My Entries</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={startNew}
              style={{ gap: '4px', padding: '5px 10px', fontSize: '12px' }}
            >
              <Plus size={13} /> New Entry
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input
              className="input"
              placeholder="Search entries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '30px', fontSize: '13px', height: '34px' }}
            />
          </div>
        </div>

        {/* Entry rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(entry => (
            <button
              key={entry.id}
              onClick={() => { setSelected(entry); setIsNew(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
                background: selected?.id === entry.id ? 'var(--primary-light)' : 'transparent',
                borderLeft: `3px solid ${selected?.id === entry.id ? 'var(--primary)' : 'transparent'}`,
                transition: 'background 0.1s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: selected?.id === entry.id ? 'var(--primary)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                  {entry.title}
                </span>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>
                  {MOODS.find(m => m.key === entry.mood)?.emoji}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px' }}>
                {formatEntryDate(entry.date)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {entry.preview}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: entry viewer / editor ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--page-bg)' }}>

        {/* Viewing an existing entry */}
        {selected && !isNew && (
          <div style={{ padding: '28px 32px', maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={11} />
                  {formatEntryDate(selected.date)}
                </div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>{selected.title}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>{MOODS.find(m => m.key === selected.mood)?.emoji}</span>
                <span className="badge" style={{ background: MOOD_COLOR[selected.mood] + '20', color: MOOD_COLOR[selected.mood] }}>
                  {MOODS.find(m => m.key === selected.mood)?.label}
                </span>
              </div>
            </div>
            <div className="card" style={{ lineHeight: 1.8, fontSize: '15px', color: 'var(--text-body)', whiteSpace: 'pre-wrap' }}>
              {selected.preview}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-faint)' }}>
              <Lock size={11} />
              Private · end-to-end encrypted · only you can see this
            </div>
          </div>
        )}

        {/* New entry editor */}
        {isNew && (
          <div style={{ padding: '28px 32px', maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PenLine size={20} style={{ color: 'var(--primary)' }} />
                New Entry
              </h2>
              <button
                className="btn btn-primary"
                onClick={saveEntry}
                disabled={!text.trim()}
              >
                {saved ? '✓ Saved!' : 'Save Entry'}
              </button>
            </div>

            {/* Mood picker */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>How are you feeling?</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {MOODS.map(m => (
                  <button key={m.key} onClick={() => setMood(m.key)} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '10px 6px', borderRadius: '8px',
                    border: `1px solid ${mood === m.key ? 'var(--primary)' : 'var(--border)'}`,
                    background: mood === m.key ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.1s',
                  }}>
                    <span style={{ fontSize: '20px' }}>{m.emoji}</span>
                    <span style={{ fontSize: '11px', color: mood === m.key ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--primary-light)', border: '1px solid #BFDBFE', marginBottom: '16px', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', marginBottom: '3px' }}>Today's prompt</div>
                <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>{prompt}</div>
              </div>
            </div>

            {/* Textarea */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>Your thoughts</div>
              <textarea
                className="textarea"
                placeholder="Write freely — this is private. Your thoughts won't be shared with anyone..."
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ minHeight: '200px', fontSize: '15px', lineHeight: '1.7' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--text-faint)' }}>
                <span>{text.length} characters</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={11} /> Private · end-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selected && !isNew && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-faint)', gap: '10px' }}>
            <PenLine size={40} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>Select an entry or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
