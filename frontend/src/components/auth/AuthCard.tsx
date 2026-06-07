import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  wide?: boolean;
}

export default function AuthCard({ children, wide }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4 py-10">
      <div className={`w-full ${wide ? 'max-w-[460px]' : 'max-w-sm'} bg-[#161b22] border border-[#30363d] rounded-xl p-7`}>
        {children}
      </div>
    </div>
  );
}