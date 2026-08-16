import { Phone, ExternalLink, Heart, Brain, Wind } from 'lucide-react';

const RESOURCES = [
  {
    category: 'Crisis Helplines',
    icon: <Phone size={18} />,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    items: [
      { name: 'Tele-MANAS', desc: 'National mental health helpline (24/7, Toll-Free)', contact: '14416', type: 'phone' },
      { name: 'iCall (TISS)', desc: 'Psychosocial helpline for individuals in distress', contact: '9152987821', type: 'phone' },
      { name: 'AASRA', desc: 'Crisis intervention center for suicidal ideation', contact: '9820466726', type: 'phone' },
    ],
  },
  {
    category: 'Coping Strategies',
    icon: <Wind size={18} />,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
    items: [
      { name: '4-7-8 Breathing', desc: 'Inhale for 4s, hold for 7s, exhale for 8s. Helps reduce immediate panic.', type: 'guide' },
      { name: '5-4-3-2-1 Grounding', desc: 'Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.', type: 'guide' },
      { name: 'Progressive Muscle Relaxation', desc: 'Tense and then slowly relax each muscle group, starting from your toes.', type: 'guide' },
    ],
  },
  {
    category: 'Self-Help Articles',
    icon: <BookOpen size={18} />, // Need to import BookOpen, let's just use Brain instead to avoid import issues if forgot
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    items: [
      { name: 'Managing Exam Anxiety', desc: 'Evidence-based strategies to prepare without burning out.', type: 'link', contact: 'https://example.com' },
      { name: 'Understanding Imposter Syndrome', desc: 'Why you feel like you don\'t belong, and how to reframe those thoughts.', type: 'link', contact: 'https://example.com' },
    ],
  },
];

import { BookOpen } from 'lucide-react'; // Fix import

export default function Resources() {
  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1>Resources</h1>
        <p>Helplines, coping strategies, and self-help materials.</p>
      </div>

      <div className="max-w-3xl space-y-8">
        {RESOURCES.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${section.bg} ${section.border} border flex items-center justify-center ${section.color}`}>
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-slate-100">{section.category}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="card hover:border-surface-border transition-all">
                  <h3 className="text-sm font-bold text-slate-200 mb-1.5">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{item.desc}</p>
                  
                  {item.type === 'phone' && (
                    <a href={`tel:${item.contact}`} className="btn btn-sm bg-surface-subtle text-slate-200 hover:bg-bg-700 w-full justify-center border border-surface-border">
                      <Phone size={13} /> Call {item.contact}
                    </a>
                  )}
                  {item.type === 'link' && (
                    <a href={item.contact} target="_blank" rel="noreferrer" className="btn btn-sm bg-surface-subtle text-slate-200 hover:bg-bg-700 w-full justify-center border border-surface-border">
                      <ExternalLink size={13} /> Read Article
                    </a>
                  )}
                  {item.type === 'guide' && (
                    <button className="btn btn-sm bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 w-full justify-center">
                      <Brain size={13} /> Try Exercise
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
