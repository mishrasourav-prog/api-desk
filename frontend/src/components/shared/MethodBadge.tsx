import type { HttpMethod } from '../../types/deck';
import { METHOD_STYLES } from '../../types/deck';

interface MethodBadgeProps {
  method: HttpMethod;
  size?: 'sm' | 'md';
}

export default function MethodBadge({ method, size = 'sm' }: MethodBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`font-mono font-bold rounded ${sizeClass} ${METHOD_STYLES[method]}`}>
      {method}
    </span>
  );
}