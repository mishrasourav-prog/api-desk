interface ErrorPageProps {
  code: 404 | 500;
  onGoHome: () => void;
  onGoBack: () => void;
}
import { useState } from "react";

export default function ErrorPage({ code, onGoHome, onGoBack }: ErrorPageProps) {
  const is404 = code === 404;
  const [errorId] = useState(
  () => `ERR_${Math.random().toString(36).slice(2, 10).toUpperCase()}`
);

const [timestamp] = useState(
  () => new Date().toISOString().slice(0, 19) + "Z"
);

  

  return (
    
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-[460px] bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center">
        <div className="font-mono font-bold text-7xl leading-none mb-4"
          style={{ color: is404 ? '#30363d' : 'rgba(248,81,73,.25)' }}>
          {code}
        </div>

        {!is404 && (
          <div className="w-12 h-12 rounded-full bg-[#f85149]/10 border border-[#f85149]/30 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-alert-triangle text-[#f85149] text-xl" aria-hidden="true" />
          </div>
        )}

        <h1 className="text-lg font-semibold text-[#f0f6fc] mb-2">
          {is404 ? 'Page not found' : 'Internal server error'}
        </h1>
        <p className="text-[12px] text-[#8b949e] leading-relaxed mb-5">
          {is404
            ? "The page you're looking for doesn't exist or has been moved. Double-check the URL or head back."
            : 'Something went wrong on our end. Our engineers have been notified and are looking into it.'}
        </p>

        {!is404 && (
          <div className="bg-[#0d1117] border border-[#f85149]/20 rounded-md p-3 mb-5 text-left">
            <p className="text-[10px] text-[#f85149] font-mono uppercase mb-2">Error details</p>
            <div className="font-mono text-[10px] text-[#8b949e] space-y-1">
              <div>Error ID: <span className="text-[#c9d1d9]">{errorId}</span></div>
              <div>Time: <span className="text-[#c9d1d9]">{timestamp}</span></div>
              <div>Service: <span className="text-[#c9d1d9]">api-gateway/v2</span></div>
            </div>
          </div>
        )}

        {is404 && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 mb-5 text-left">
            <p className="text-[10px] text-[#6e7681] font-mono uppercase mb-2">Quick links</p>
            {[['ti-home', 'Dashboard'], ['ti-api', 'API Endpoints'], ['ti-book', 'Documentation']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                <i className={`ti ${icon} text-[#58a6ff] text-sm`} aria-hidden="true" />
                <span className="text-[11px] text-[#58a6ff] group-hover:underline">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onGoHome}
            className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
          >
            Go to dashboard
          </button>
          <button
            onClick={onGoBack}
            className="flex-1 bg-transparent border border-[#30363d] hover:bg-[#21262d] text-[#8b949e] text-xs font-medium py-2.5 rounded-md transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}