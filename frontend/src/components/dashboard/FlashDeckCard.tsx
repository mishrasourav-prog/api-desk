import type { FC } from "react";
import type { Deck } from "../../types/deck";

interface FlashDeckCardProps {
  deck: Deck;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FlashDeckCard: FC<FlashDeckCardProps> = ({
  deck,
  onOpen,
  onDelete,
}) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff]/40 transition-colors">

      {/* Path + Method */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[#58a6ff]">
            {deck.method}
          </span>

          <h2 className="text-sm font-semibold text-[#f0f6fc] font-mono">
            {deck.path}
          </h2>
        </div>

        {/* Response Status */}
        <p className="text-xs text-[#8b949e] mt-2">
          Status: {deck.responseStatus}
        </p>
      </div>

      {/* Response Preview */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#8b949e] mb-3 overflow-hidden">
        <pre className="truncate">
          {deck.responseBody}
        </pre>
      </div>

      {/* Creator */}
      <div className="text-xs text-[#6e7681] mb-4">
        Created by: {deck.creator}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onOpen?.(deck._id)}
          className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-md text-sm"
        >
          Open
        </button>

        <button
          onClick={() => onDelete?.(deck._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FlashDeckCard;