import type { HttpMethod, HttpStatus } from '../../types/deck';
import { STATUS_LABELS, METHOD_STYLES } from '../../types/deck';
import { useAuth } from '../../context/AuthContext';


interface EndpointFormProps {
  path: string;
  method: HttpMethod;
  status: HttpStatus;
  description: string;
  onPathChange: (v: string) => void;
  onMethodChange: (v: HttpMethod) => void;
  onStatusChange: (v: HttpStatus) => void;
  onDescriptionChange: (v: string) => void;
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE'];
const STATUSES: HttpStatus[] = [200, 201, 400, 404, 500];

export default function EndpointForm({
  path, method, status, description,
  onPathChange, onMethodChange, onStatusChange, onDescriptionChange,
}: EndpointFormProps) {

  const {user} = useAuth();
  return (
    <div className="flex flex-col gap-4">
    
      <div>
        <label className="block text-[11px] text-[#8b949e] font-semibold uppercase tracking-widest mb-1.5">
          Method & Path
        </label>
        <div className="flex items-stretch gap-0 rounded-md overflow-hidden border border-[#30363d] focus-within:border-[#58a6ff] focus-within:ring-1 focus-within:ring-[#58a6ff] transition-colors">
         
          <select
            value={method}
            onChange={e => onMethodChange(e.target.value as HttpMethod)}
            className={`font-mono font-bold text-xs px-3 py-2 bg-[#0d1117] border-r border-[#30363d] outline-none cursor-pointer shrink-0 ${METHOD_STYLES[method]}`}
          >
            {METHODS.map(m => (
              <option key={m} value={m} className="text-white bg-[#0d1117]">{m}</option>
            ))}
          </select>
         
          <span className="flex items-center px-2.5 bg-[#161b22] text-[#6e7681] font-mono text-xs shrink-0 border-r border-[#30363d] select-none whitespace-nowrap">
            api/mock/{user?.username}
          </span>
          
          <input
            type="text"
            value={path}
            onChange={e => onPathChange(e.target.value)}
            placeholder="users/profile"
            className="flex-1 bg-[#0d1117] text-[#f0f6fc] font-mono text-xs px-3 py-2 outline-none placeholder-[#6e7681] min-w-0"
          />
        </div>
      </div>

      
      <div>
        <label className="block text-[11px] text-[#8b949e] font-semibold uppercase tracking-widest mb-1.5">
          Response Status
        </label>
        <select
          value={status}
          onChange={e => onStatusChange(Number(e.target.value) as HttpStatus)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs font-mono text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] cursor-pointer transition-colors"
        >
          {STATUSES.map(s => (
            <option key={s} value={s} className="bg-[#0d1117]">{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      
      <div>
        <label className="block text-[11px] text-[#8b949e] font-semibold uppercase tracking-widest mb-1.5">
          Description <span className="text-[#6e7681] normal-case tracking-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Returns the authenticated user profile..."
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs text-[#c9d1d9] placeholder-[#6e7681] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors"
        />
      </div>
    </div>
  );
}