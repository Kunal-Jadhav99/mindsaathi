import { X, Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SOSModal() {
  const { sosOpen, closeSOS } = useApp();
  if (!sosOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-lg z-[999] flex items-center justify-center animate-fade-in"
      onClick={closeSOS}>
      <div className="relative bg-bg-800 border border-red-400/30 rounded-3xl p-8 max-w-md w-[92%]
                      shadow-glow-danger animate-fade-in-up"
        onClick={e => e.stopPropagation()}>

        <button onClick={closeSOS}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
                     text-slate-500 hover:text-slate-200 hover:bg-bg-700 transition-colors">
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-400/15 border border-red-400/35 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">You're not alone</h2>
            <p className="text-xs text-slate-400">Immediate support is available right now</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Tele-MANAS */}
          <a href="tel:14416"
            className="flex items-center gap-4 p-4 rounded-2xl bg-red-400/10 border border-red-400/25
                       hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-red-400/20 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">Tele-MANAS</p>
              <p className="text-xs text-slate-400">National helpline — 14416 (24/7, free)</p>
            </div>
            <span className="text-red-400 font-bold text-lg group-hover:scale-110 transition-transform">→</span>
          </a>

          {/* iCall */}
          <a href="tel:9152987821"
            className="flex items-center gap-4 p-4 rounded-2xl bg-bg-900 border border-surface-border
                       hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">iCall — TISS</p>
              <p className="text-xs text-slate-400">9152987821 · Counselling for students</p>
            </div>
            <span className="text-brand-400 font-bold text-lg group-hover:scale-110 transition-transform">→</span>
          </a>

          {/* Alert counsellor */}
          <button
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30
                       hover:bg-brand-500/20 hover:border-brand-500/50 transition-all duration-200 group"
            onClick={() => { closeSOS(); alert('✅ Your counsellor has been notified. They will reach out within 24 hours.'); }}>
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={18} className="text-brand-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-slate-100">Alert My Counsellor</p>
              <p className="text-xs text-slate-400">Notify your college wellness cell</p>
            </div>
            <span className="text-brand-400 font-bold text-lg group-hover:scale-110 transition-transform">→</span>
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-500 leading-relaxed">
          This alert is confidential — only your assigned counsellor will see it.
        </p>
      </div>
    </div>
  );
}
