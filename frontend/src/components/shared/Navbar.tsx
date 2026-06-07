import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="h-14 w-full bg-[#0d1117] border-b border-[#30363d] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono font-bold text-lg text-[#f0f6fc] tracking-wider select-none">🏗️ API-Deck</span>
        <span className="text-[10px] text-[#6e7681] bg-[#21262d] border border-[#30363d] rounded px-1.5 py-0.5 font-mono">v1.4.0</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3" ref={ref}>
        {/* Pro badge */}
        <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full select-none">
          ⚡ Pro Account
        </span>

        {/* Avatar */}
        <button
          onClick={() => setOpen(v => !v)}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#30363d] hover:border-[#58a6ff] transition-colors focus:outline-none relative"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=apideck&backgroundColor=b6e3f4"
            alt="User avatar"
            className="w-full h-full object-cover bg-[#21262d]"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-6 top-12 w-52 bg-[#21262d] border border-[#30363d] rounded-md shadow-2xl p-1 z-50 animate-in">
            <div className="px-3 py-2 border-b border-[#30363d] mb-1">
              <p className="text-xs font-semibold text-[#f0f6fc]">Arjun Sharma</p>
              <p className="text-[10px] text-[#6e7681]">arjun@devhq.io</p>
            </div>
            {[
              { icon: '⚙️', label: 'Account Settings' },
              { icon: '🔑', label: 'Manage API Keys' },
            ].map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#30363d] rounded transition-colors text-left"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="border-t border-[#30363d] my-1" />
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#f85149] font-medium hover:bg-[#30363d] rounded transition-colors text-left"
            >
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}