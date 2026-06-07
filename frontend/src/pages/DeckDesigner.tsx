import { useState } from 'react';
import type { DeckCardData, HttpMethod, HttpStatus } from '../types/deck';
import EndpointForm from '../components/designer/EndpointForm';
import CodeEditor from '../components/shared/CodeEditor';
import LogStream from '../components/designer/LogStream';

interface DeckDesignerProps {
  editingEndpoint: DeckCardData | null;
  onSave: (path: string, method: HttpMethod, status: HttpStatus, body: string, desc: string) => void;
  onCancel: () => void;
}

const DEFAULT_BODY = JSON.stringify({ message: 'Hello from API-Deck!', success: true }, null, 2);

export default function DeckDesigner({ editingEndpoint, onSave, onCancel }: DeckDesignerProps) {
  const [path, setPath] = useState(editingEndpoint?.path ?? '');
  const [method, setMethod] = useState<HttpMethod>(editingEndpoint?.method ?? 'GET');
  const [status, setStatus] = useState<HttpStatus>(editingEndpoint?.responseStatus ?? 200);
  const [body, setBody] = useState(editingEndpoint?.responseBody ?? DEFAULT_BODY);
  const [description, setDescription] = useState(editingEndpoint?.description ?? '');
  const [saveAttempted, setSaveAttempted] = useState(false);

  function isValidJson(str: string): boolean {
    try { JSON.parse(str); return true; } catch { return false; }
  }

  function handleSave() {
    setSaveAttempted(true);
    if (!path.trim() || !isValidJson(body)) return;
    onSave(path.trim(), method, status, body, description);
  }

  const isNew = !editingEndpoint;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Designer header */}
      <div className="px-6 py-4 border-b border-[#30363d] shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-[#f0f6fc] font-bold text-lg">
            {isNew ? 'New Mock Endpoint' : `Edit — /${editingEndpoint.path}`}
          </h1>
          <p className="text-[#8b949e] text-xs mt-0.5">
            {isNew ? 'Configure a new mock endpoint and its response schema.' : 'Editing live endpoint — changes take effect immediately.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="text-sm text-[#8b949e] hover:text-[#c9d1d9] px-4 py-2 rounded-md border border-[#30363d] hover:bg-[#30363d] transition-colors"
          >
            ← Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            💾 Save Configuration
          </button>
        </div>
      </div>

      {/* Split body */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: 45% — config */}
        <div className="w-[45%] border-r border-[#30363d] flex flex-col overflow-y-auto">
          <div className="p-5 flex flex-col gap-5">
            {/* Validation hint */}
            {saveAttempted && !path.trim() && (
              <div className="flex items-center gap-2 bg-[#f85149]/10 border border-[#f85149]/30 rounded-md px-3 py-2">
                <span className="text-[#f85149] text-xs">⚠️ Path is required before saving.</span>
              </div>
            )}

            {/* Endpoint Form */}
            <div>
              <p className="text-[10px] text-[#6e7681] font-semibold uppercase tracking-widest mb-3">
                Endpoint Configuration
              </p>
              <EndpointForm
                path={path}
                method={method}
                status={status}
                description={description}
                onPathChange={setPath}
                onMethodChange={setMethod}
                onStatusChange={setStatus}
                onDescriptionChange={setDescription}
              />
            </div>

            {/* Code Editor */}
            <div>
              <p className="text-[10px] text-[#6e7681] font-semibold uppercase tracking-widest mb-3">
                Response Body Schema
              </p>
              <CodeEditor value={body} onChange={setBody} />
            </div>

            {/* Preview URL */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2.5">
              <p className="text-[10px] text-[#6e7681] mb-1">Live URL Preview</p>
              <p className="font-mono text-[11px] text-[#58a6ff] break-all">
                https://api-deck.com/api/mock/arjun/{path || '<path>'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: 55% — log stream */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
          <div className="px-4 py-3 border-b border-[#30363d] shrink-0">
            <p className="text-[10px] text-[#6e7681] font-semibold uppercase tracking-widest">
              Real-Time Telemetry
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <LogStream
              endpointPath={path || 'new/endpoint'}
              method={method}
              initialLogs={editingEndpoint?.logs ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}