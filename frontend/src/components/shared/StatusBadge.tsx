import { STATUS_STYLE, STATUS_LABELS } from '../../types/deck';

interface StatusBadgeProps {
  status: number;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const label = (STATUS_LABELS as Record<number, string>)[status] ?? `${status}`;
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`font-mono font-semibold rounded ${sizeClass} ${STATUS_STYLE(status)}`}>
      {label}
    </span>
  );
}