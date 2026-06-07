import type { ReactNode } from 'react';

interface AuthBrandProps {
  icon?: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthBrand({ icon, title, subtitle }: AuthBrandProps) {
  return (
    <div className="flex flex-col items-center mb-6 gap-2 text-center">
      {icon ? (
        <div className="w-10 h-10 rounded-xl bg-[#1f6feb]/10 border border-[#1f6feb]/30 flex items-center justify-center">
          {icon}
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-[#1f6feb]/10 border border-[#1f6feb]/30 flex items-center justify-center text-xl">
          🏗️
        </div>
      )}
      <p className="font-mono font-bold text-[15px] text-[#f0f6fc] tracking-wide">{title}</p>
      <p className="text-[11px] text-[#6e7681] leading-relaxed max-w-[240px]">{subtitle}</p>
    </div>
  );
}