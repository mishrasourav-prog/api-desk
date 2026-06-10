import { useState } from 'react';
import { buildMockUrl } from '../../utils/storage';
import MethodBadge from '../shared/MethodBadge';
import StatusBadge from '../shared/StatusBadge';
import type { Deck } from '../../types/deck';

interface DeckCardProps {
  deck: Deck;
  onOpen?: (deck: Deck) => void;
  onDeckDeleted?: (id: string) => void;
}

export default function DeckCard({
    deck,
  onOpen,
  onDeckDeleted,
}: DeckCardProps
) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const url = buildMockUrl(deck.creator, deck.path);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  const handleDelete = (e: React.MouseEvent) => {
  e.stopPropagation();

  const ok = window.confirm(
    `Delete endpoint: ${deck.method} /${deck.path}?`
  );

  if (!ok) return;

  onDeckDeleted?.(deck._id);
};

  const handleOpen = () => {
  onOpen?.(deck);
};


 return (
    <div
      onClick={handleOpen}
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden hover:border-[#8b949e] transition-all flex flex-col gap-3 shadow-sm cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MethodBadge method={deck.method} />
          <span className="font-mono text-sm font-semibold text-[#f0f6fc] truncate">
            /api/mock/{deck.creator}/{deck.path}
          </span>
        </div>
        <StatusBadge status={deck.responseStatus} />
      </div>

      {/* Description */}
      {/* {deck.description && (
        <p className="text-xs text-[#8b949e] line-clamp-1">{deck.description}</p>
      )} */}

      {/* Metrics row */}
      {/* <div className="flex items-center gap-4 text-[11px] text-[#8b949e]">
        <span>📊 <span className="text-[#c9d1d9] font-semibold">{card.totalCalls.toLocaleString()}</span> calls</span>
        <span>📅 {formatTimestamp(card.createdAt)}</span>
        {card.logs.length > 0 && (
          <span>⚡ Last: <span className="text-[#c9d1d9]">{card.logs[0].latency}</span></span>
        )}
      </div> */}

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#30363d]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-[#8b949e] hover:text-[#58a6ff] transition-colors px-2 py-1 rounded hover:bg-[#58a6ff]/10"
          >
            <span>{copied ? '✅' : '📋'}</span>
            <span className="font-mono">{copied ? 'Copied!' : 'Copy URL'}</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleOpen() }}
            className="flex items-center gap-1.5 text-[11px] text-[#8b949e] hover:text-[#c9d1d9] transition-colors px-2 py-1 rounded hover:bg-[#30363d]"
          >
            <span>⚙️</span>
            <span>Configure</span>
          </button>
        </div>
        <button
          onClick={handleDelete}
          className="text-[11px] text-[#6e7681] hover:text-[#f85149] transition-colors px-2 py-1 rounded hover:bg-[#f85149]/10 opacity-0 group-hover:opacity-100"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}