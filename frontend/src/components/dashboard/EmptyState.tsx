interface EmptyStateProps {
  onCreateNew: () => void;
}

export default function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#30363d] flex items-center justify-center mb-4 text-2xl">
        🏗️
      </div>
      <h3 className="text-[#f0f6fc] font-semibold text-base mb-1">No mock endpoints yet</h3>
      <p className="text-[#8b949e] text-sm mb-6 max-w-xs leading-relaxed">
        Create your first mock API endpoint to start intercepting requests and streaming logs.
      </p>
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
      >
        <span>+</span> Create New Mock Endpoint
      </button>
    </div>
  );
}