import { getPasswordStrength } from '../../types/auth';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-colors duration-300"
            style={{ background: i < score ? color : '#30363d' }}
          />
        ))}
      </div>
      <p className="text-[10px]" style={{ color }}>{label}</p>
    </div>
  );
}