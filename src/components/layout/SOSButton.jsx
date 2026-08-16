import { useApp } from '../../context/AppContext';

export default function SOSButton() {
  const { openSOS } = useApp();
  return (
    <button id="sos-btn" onClick={openSOS} aria-label="Emergency SOS"
      title="Emergency support — tap for immediate help"
      className="fixed bottom-6 right-6 z-[998] group">
      <span className="absolute inset-0 rounded-full animate-pulse-red opacity-30 bg-red-500" />
      <span className="relative flex items-center justify-center w-12 h-12 rounded-full
                       bg-red-500/20 border border-red-400/50 text-red-400 text-[10px] font-bold
                       tracking-widest hover:bg-red-500/35 hover:border-red-400 hover:scale-110
                       transition-all duration-200 shadow-glow-danger">
        SOS
      </span>
    </button>
  );
}
