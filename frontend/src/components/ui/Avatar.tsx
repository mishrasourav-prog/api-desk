interface AvatarProps {
  initials: string;
  size?: number;
}

export default function Avatar({ initials, size = 64 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1f6feb, #388bfd)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.3,
        flexShrink: 0,
        border: '2px solid #30363d',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}