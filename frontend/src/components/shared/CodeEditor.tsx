import { useState, useCallback } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function isValidJson(str: string): boolean {
  if (!str.trim()) return true;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export default function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const [touched, setTouched] = useState(false);
  const valid = isValidJson(value);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    onChange(e.target.value);
  }, [onChange]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(value), null, 2);
      onChange(formatted);
    } catch {
      // invalid — don't format
    }
  }, [value, onChange]);

  return (
    <div className="relative">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] border-b-0 rounded-t-md px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f85149]/70"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#d29922]/70"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/70"></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6e7681] font-mono">response.json</span>
          <button
            type="button"
            onClick={handleFormat}
            disabled={!valid || !value.trim()}
            className="text-[10px] text-[#58a6ff] hover:text-[#79c0ff] disabled:text-[#6e7681] disabled:cursor-not-allowed transition-colors font-mono"
          >
            Format
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className={`relative h-56 bg-[#0d1117] border rounded-b-md overflow-hidden transition-colors ${
        touched && !valid
          ? 'border-[#f85149] focus-within:border-[#f85149]'
          : 'border-[#30363d] focus-within:border-[#58a6ff] focus-within:ring-1 focus-within:ring-[#58a6ff]'
      }`}>
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-[#30363d] flex flex-col pt-4 items-end pr-1.5 select-none overflow-hidden pointer-events-none">
          {(value || '').split('\n').map((_, i) => (
            <span key={i} className="text-[10px] text-[#6e7681] font-mono leading-[1.6]">{i + 1}</span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          placeholder={placeholder ?? '{\n  "key": "value"\n}'}
          className="absolute inset-0 pl-10 pr-3 pt-4 pb-8 bg-transparent font-mono text-xs text-[#3fb950] placeholder-[#6e7681]/50 resize-none outline-none w-full h-full leading-[1.6]"
          spellCheck={false}
        />
        {/* Invalid JSON warning */}
        {touched && !valid && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#f85149]/10 border-t border-[#f85149]/30">
            <span className="text-[10px] text-[#f85149] font-mono">⚠️ Invalid JSON — fix syntax before saving</span>
          </div>
        )}
      </div>
    </div>
  );
}