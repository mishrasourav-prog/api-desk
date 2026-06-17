import { useState, useRef, useEffect  } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';





export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {onLogout} = useAuth();

  const navigate = useNavigate();

  const {user} = useAuth();

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () =>{
    onLogout();
  }

  return (
    <header className="h-14 w-full bg-[#0d1117] border-b border-[#30363d] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono font-bold text-lg text-[#f0f6fc] tracking-wider select-none">🏗️ API-Deck</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3" ref={ref}>

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
              <p className="text-xs font-semibold text-[#f0f6fc]">{user?.name}</p>
              <p className="text-[10px] text-[#6e7681]">{user?.email}</p>
            </div>
            {[
              { label: 'Account Settings' },
            ].map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#30363d] rounded transition-colors text-left"
                onClick={() => { navigate("/app/settings")}}

              >
              
                <span>{item.label}</span>
              </button>
            ))}
            {[
              { label: 'Dashboard' },
            ].map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#30363d] rounded transition-colors text-left"
                onClick={() => { navigate("/app/dashboard")}}

              >
               
                <span>{item.label}</span>
              </button>
            ))}
            <div className="border-t border-[#30363d] my-1" />
            <button
              onClick={() => { handleLogout()}}
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