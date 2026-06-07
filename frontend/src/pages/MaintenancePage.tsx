import { useState, useEffect } from 'react';

interface MaintenancePageProps {
  estimatedMinutes?: number;
}

export default function MaintenancePage({ estimatedMinutes = 23 }: MaintenancePageProps) {
  const [seconds, setSeconds] = useState(estimatedMinutes * 60);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const steps = [
    { label: 'Database migration', status: 'done' },
    { label: 'Cache warm-up', status: 'done' },
    { label: 'Service restart', status: 'active' },
    { label: 'Health checks', status: 'pending' },
  ] as const;

  const statusColor = { done: '#3fb950', active: '#d29922', pending: '#30363d' } as const;

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-[460px] bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#21262d] border border-[#30363d] flex items-center justify-center mx-auto mb-5 text-3xl">
          🔧
        </div>

        <h1 className="text-lg font-semibold text-[#f0f6fc] mb-2">Down for maintenance</h1>
        <p className="text-[12px] text-[#8b949e] leading-relaxed mb-6">
          API-Deck is undergoing scheduled maintenance to improve performance and reliability. We'll be back shortly.
        </p>

        <div className="flex gap-3 justify-center mb-6">
          {[{ n: pad(hrs), l: 'HOURS' }, { n: pad(mins), l: 'MINS' }, { n: pad(secs), l: 'SECS' }].map(({ n, l }) => (
            <div key={l} className="bg-[#0d1117] border border-[#30363d] rounded-lg px-5 py-3">
              <div className="font-mono font-bold text-2xl text-[#f0f6fc]">{n}</div>
              <div className="text-[9px] text-[#6e7681] mt-1 tracking-widest">{l}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 mb-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#6e7681] font-semibold uppercase tracking-widest">Deployment progress</span>
            <span className="text-[10px] text-[#c9d1d9] font-mono">78%</span>
          </div>
          <div className="h-1 bg-[#30363d] rounded-full mb-4">
            <div className="h-full bg-[#238636] rounded-full" style={{ width: '78%' }} />
          </div>
          <div className="flex flex-col gap-2">
            {steps.map(({ label, status }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor[status] }} />
                <span className="text-[11px]" style={{ color: status === 'pending' ? '#6e7681' : statusColor[status] }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-transparent border border-[#30363d] hover:bg-[#21262d] text-[#8b949e] text-xs font-medium py-2.5 rounded-md transition-colors mb-3">
          Notify me when back online
        </button>
        <a href="#" className="text-[#58a6ff] hover:underline text-[11px] inline-flex items-center gap-1">
          View status page <i className="ti ti-external-link text-[11px]" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}