export default function AuthDivider({ text = 'or continue with email' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#30363d]" />
      <span className="text-[10px] text-[#6e7681]">{text}</span>
      <div className="flex-1 h-px bg-[#30363d]" />
    </div>
  );
}