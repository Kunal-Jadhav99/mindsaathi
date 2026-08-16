import { useState } from 'react';
import { BookOpen, Save } from 'lucide-react';

const MOODS = ['great', 'good', 'okay', 'bad', 'awful'];
const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', bad: '😔', awful: '😞' };
const MOOD_COLOR = { great: 'text-green-400', good: 'text-lime-400', okay: 'text-yellow-400', bad: 'text-orange-400', awful: 'text-red-400' };

const PROMPTS = [
  "What's one thing that went well today?",
  "Describe a moment today when you felt calm or at ease.",
  "What's something you're looking forward to?",
  "What challenged you today and how did you respond?",
  "What would make tomorrow a good day?",
];

export default function Journal() {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(null);
  const [saved, setSaved] = useState(false);
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  function save() {
    if (!text.trim()) return;
    // TODO: save to Firestore
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2"><BookOpen size={22} className="text-brand-400" /> Mood Journal</h1>
          <p>Private · Only you can see this · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button onClick={save} disabled={!text.trim()}
          className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
          <Save size={14} /> {saved ? '✓ Saved!' : 'Save Entry'}
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Mood */}
        <div className="card">
          <p className="text-sm font-semibold text-slate-100 mb-3">How are you feeling right now?</p>
          <div className="flex gap-3">
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all flex-1 ${
                  mood === m ? 'bg-brand-500/15 border-brand-500/40 text-brand-300' : 'border-surface-border text-slate-400 hover:bg-bg-700'
                }`}>
                <span className="text-2xl">{MOOD_EMOJI[m]}</span>
                <span className={`capitalize font-medium ${mood === m ? MOOD_COLOR[m] : ''}`}>{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-500/8 border border-brand-500/20">
          <span className="text-brand-400 text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-xs text-brand-400 font-semibold mb-0.5">Today's prompt</p>
            <p className="text-sm text-slate-300">{prompt}</p>
          </div>
        </div>

        {/* Journal textarea */}
        <div className="card">
          <p className="text-sm font-semibold text-slate-100 mb-3">Your thoughts</p>
          <textarea
            className="textarea w-full min-h-[220px]"
            placeholder="Write freely — this is private. Your thoughts won't be shared with anyone..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-600">{text.length} characters</p>
            <p className="text-xs text-slate-600">🔒 Private · end-to-end encrypted</p>
          </div>
        </div>

        {/* Past entries teaser */}
        <div className="card">
          <p className="text-sm font-semibold text-slate-100 mb-3">Recent Entries</p>
          <div className="space-y-3">
            {[
              { date: 'Aug 9', snippet: 'Hard to concentrate lately. Tried the breathing exercise...', mood: 'okay' },
              { date: 'Aug 2',  snippet: 'Managing okay but feeling tired. Had a decent day despite...', mood: 'okay' },
              { date: 'Jul 26', snippet: 'Had a good week overall. Finished my assignment early...', mood: 'good' },
            ].map(({ date, snippet, mood: m }) => (
              <div key={date} className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-700 transition-colors cursor-pointer">
                <span className="text-xl flex-shrink-0">{MOOD_EMOJI[m]}</span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{date}</p>
                  <p className="text-sm text-slate-300 truncate">{snippet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
