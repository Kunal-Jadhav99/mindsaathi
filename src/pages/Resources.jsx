import { useState } from 'react';
import { Phone, ExternalLink, Brain, Wind, BookOpen, Video, Wrench, Star } from 'lucide-react';

const TABS = [
  { id: 'all',      label: 'All',      icon: Star     },
  { id: 'articles', label: 'Articles', icon: BookOpen  },
  { id: 'videos',   label: 'Videos',   icon: Video     },
  { id: 'guides',   label: 'Guides',   icon: Brain     },
  { id: 'tools',    label: 'Tools',    icon: Wrench    },
];

const FEATURED = {
  title: '5 Simple Ways to Manage Stress',
  desc: 'Practical tips you can apply today to feel more calm and in control of your day.',
  type: 'articles',
  readTime: '5 min read',
  emoji: '🌿',
};

const RESOURCES = [
  { id: 'r1', type: 'guides',   title: 'Mindfulness for Beginners',       desc: 'Start with just 5 minutes a day.',      emoji: '🧘', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r2', type: 'guides',   title: 'Build a Better Sleep Routine',     desc: 'Evidence-based sleep hygiene tips.',     emoji: '🌙', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r3', type: 'guides',   title: 'Focus Better, Study Smarter',      desc: 'Pomodoro and attention techniques.',      emoji: '📚', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r4', type: 'guides',   title: 'Coping with Anxiety',              desc: 'Grounding exercises for tough moments.',  emoji: '🫁', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r5', type: 'articles', title: 'Managing Exam Anxiety',            desc: 'Evidence-based strategies to prepare without burning out.', emoji: '✏️', cta: 'Read Article', ctaStyle: 'link', href: 'https://example.com' },
  { id: 'r6', type: 'articles', title: 'Understanding Imposter Syndrome',  desc: 'Why you feel you don\'t belong, and how to reframe those thoughts.', emoji: '💭', cta: 'Read Article', ctaStyle: 'link', href: 'https://example.com' },
  { id: 'r7', type: 'tools',    title: '4-7-8 Breathing',                  desc: 'Inhale 4s · Hold 7s · Exhale 8s. Reduces immediate panic.', emoji: '💨', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r8', type: 'tools',    title: '5-4-3-2-1 Grounding',              desc: '5 things you see, 4 feel, 3 hear, 2 smell, 1 taste.', emoji: '🌱', cta: 'Try Exercise', ctaStyle: 'guide' },
  { id: 'r9', type: 'tools',    title: 'Progressive Muscle Relaxation',    desc: 'Tense and release each muscle group from toes up.', emoji: '🏃', cta: 'Try Exercise', ctaStyle: 'guide' },
];

const HELPLINES = [
  { name: 'Tele-MANAS',   desc: 'National mental health helpline (24/7, Toll-Free)', contact: '14416' },
  { name: 'iCall (TISS)', desc: 'Psychosocial helpline for individuals in distress',  contact: '9152987821' },
  { name: 'AASRA',        desc: 'Crisis intervention — suicidal ideation',            contact: '9820466726' },
];

export default function Resources() {
  const [activeTab, setTab] = useState('all');

  const displayed = activeTab === 'all' ? RESOURCES : RESOURCES.filter(r => r.type === activeTab);

  return (
    <div className="s-page animate-fade-in">
      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px', fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                background: 'transparent', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.12s', marginBottom: '-1px',
              }}
            >
              <Icon size={14} />{tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Featured ── */}
      {(activeTab === 'all' || activeTab === 'articles') && (
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px' }}>
          <div style={{ fontSize: '48px', flexShrink: 0 }}>{FEATURED.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Featured</div>
            <h2 style={{ fontSize: '17px', margin: '0 0 6px' }}>{FEATURED.title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{FEATURED.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Article · {FEATURED.readTime}</span>
              <a href="#" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>Read now →</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Resource grid ── */}
      <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
        Popular Resources
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px' }}>
        {displayed.map(r => (
          <div key={r.id} className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{r.emoji}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>{r.title}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>{r.desc}</p>
            {r.ctaStyle === 'guide' && (
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                <Brain size={12} /> {r.cta}
              </button>
            )}
            {r.ctaStyle === 'link' && (
              <a href={r.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                <ExternalLink size={12} /> {r.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* ── Crisis Helplines ── */}
      {(activeTab === 'all' || activeTab === 'tools') && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Phone size={16} style={{ color: 'var(--danger)' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Crisis Helplines</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {HELPLINES.map(h => (
              <div key={h.name} className="card" style={{ padding: '14px', borderColor: '#FECACA', background: 'var(--danger-light)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{h.name}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>{h.desc}</p>
                <a href={`tel:${h.contact}`} className="btn btn-sm" style={{ width: '100%', background: 'var(--danger)', color: '#fff', border: 'none' }}>
                  <Phone size={12} /> Call {h.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
