import { useState } from 'react';
import DeckCard from '../components/dashboard/DeckCard';
import EmptyState from '../components/dashboard/EmptyState';
import { useEndpoints } from '../context/EndpointContext';



export default function Dashboard() {
   const { endpoints, onCreateNew, onOpenEndpoint, onDeleteEndpoint } = useEndpoints();
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');

  const filtered = endpoints.filter(ep => {
    const matchesSearch = ep.path.toLowerCase().includes(search.toLowerCase()) ||
      (ep.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesMethod = filterMethod === 'ALL' || ep.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const totalCalls = endpoints.reduce((sum, ep) => sum + ep.totalCalls, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Command header */}
      <div className="px-6 py-4 border-b border-[#30363d] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#f0f6fc] font-bold text-xl">Mock Endpoints</h1>
            <p className="text-[#8b949e] text-xs mt-0.5">
              <span className="text-[#c9d1d9] font-semibold">{endpoints.length}</span> endpoints configured ·{' '}
              <span className="text-[#c9d1d9] font-semibold">{totalCalls.toLocaleString()}</span> total calls
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            <span>+</span> Create New Mock Endpoint
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-sm flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 focus-within:border-[#58a6ff] transition-colors">
            <svg className="w-3.5 h-3.5 text-[#6e7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search endpoints..."
              className="bg-transparent text-xs text-[#c9d1d9] placeholder-[#6e7681] outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-1">
            {(['ALL', 'GET', 'POST', 'PUT', 'DELETE'] as const).map(m => (
              <button
                key={m}
                onClick={() => setFilterMethod(m)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded border transition-colors ${
                  filterMethod === m
                    ? 'bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/30'
                    : 'text-[#6e7681] border-[#30363d] hover:bg-[#30363d]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {endpoints.length === 0 ? (
          <EmptyState onCreateNew={onCreateNew} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6e7681] text-sm">
            No endpoints match <span className="font-mono text-[#c9d1d9]">"{search}"</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(ep => (
              <DeckCard
                key={ep.id}
                card={ep}
                onOpen={onOpenEndpoint}
                onDelete={onDeleteEndpoint}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}