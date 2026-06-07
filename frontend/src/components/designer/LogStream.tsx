import { useState, useEffect, useRef } from 'react';
import type { SubCardLog, HttpMethod } from '../../types/deck';
import { METHOD_STYLES } from '../../types/deck';
import { generateId, generateTimestamp, generateIp, generateLatency } from '../../utils/storage';

interface LogStreamProps {
  endpointPath: string;
  method: HttpMethod;
  initialLogs: SubCardLog[];
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function LogStream({ endpointPath, method, initialLogs }: LogStreamProps) {
  const [logs, setLogs] = useState<SubCardLog[]>(initialLogs);
  const [live, setLive] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simulate incoming log entries when live
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const newLog: SubCardLog = {
        id: generateId(),
        timestamp: generateTimestamp(),
        method,
        status: Math.random() > 0.85 ? 500 : 200,
        latency: generateLatency(),
        ipAddress: generateIp(),
        path: endpointPath,
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [live, method, endpointPath]);

  useEffect(() => {
    if (live) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, live]);

  function clearLogs() { setLogs([]); }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Stream header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${live ? 'bg-green-400 animate-pulse' : 'bg-[#6e7681]'}`}></span>
          <span className="text-xs font-semibold text-[#f0f6fc]">Live Request Log</span>
          <span className="text-[10px] text-[#8b949e] font-mono bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 rounded">
            {logs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive(v => !v)}
            className={`text-[10px] px-2 py-1 rounded border transition-colors font-mono ${
              live
                ? 'text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20'
                : 'text-[#8b949e] border-[#30363d] hover:bg-[#30363d]'
            }`}
          >
            {live ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button
            onClick={clearLogs}
            className="text-[10px] px-2 py-1 rounded border border-[#30363d] text-[#8b949e] hover:bg-[#30363d] transition-colors font-mono"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px]">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[#6e7681]">
            <span className="text-lg mb-1">📭</span>
            <span>No requests yet — waiting for traffic...</span>
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={log.id}
              className={`flex items-center gap-3 px-4 py-2 border-b border-[#30363d]/40 transition-colors hover:bg-[#161b22] ${
                i === 0 && live ? 'bg-[#58a6ff]/5' : ''
              }`}
            >
              {/* Timestamp */}
              <span className="text-[#6e7681] shrink-0 w-20">{timeAgo(log.timestamp)}</span>

              {/* Method badge */}
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${METHOD_STYLES[log.method]}`}>
                {log.method}
              </span>

              {/* Path */}
              <span className="text-[#c9d1d9] flex-1 truncate">/{log.path}</span>

              {/* Status */}
              <span className={`shrink-0 ${log.status >= 500 ? 'text-[#f85149]' : log.status >= 400 ? 'text-[#d29922]' : 'text-[#3fb950]'}`}>
                {log.status}
              </span>

              {/* Latency */}
              <span className="text-[#d29922] shrink-0">⚡ {log.latency}</span>

              {/* IP */}
              <span className="text-[#6e7681] shrink-0 hidden xl:block">{log.ipAddress}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}