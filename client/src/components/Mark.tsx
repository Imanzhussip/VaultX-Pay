import { Link } from 'react-router-dom';

function Mark({ size = 22, inverted = false }: { size?: number; inverted?: boolean }) {
  const fill = inverted ? '#ffffff' : '#2341e0';
  const ink = inverted ? '#2341e0' : '#ffffff';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
      <circle cx="12" cy="12" r="11" fill={fill} />
      <circle cx="12" cy="12" r="5" fill="none" stroke={ink} strokeWidth="1.8" />
      <path d="M12 3.5v3.5M12 17v3.5M3.5 12H7M17 12h3.5" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ inverted = false, size = 'md' }: { inverted?: boolean; size?: 'md' | 'lg' }) {
  return (
    <Link
      to="/"
      aria-label="VaultX Pay home"
      className={`flex items-center gap-2.5 rounded-md transition-opacity duration-150 hover:opacity-80 ${inverted ? 'text-white' : 'text-ink'}`}
    >
      <Mark size={size === 'lg' ? 28 : 22} inverted={inverted} />
      <span className={`font-display font-bold tracking-[-0.01em] ${size === 'lg' ? 'text-[20px]' : 'text-[17px]'}`}>VaultX Pay</span>
    </Link>
  );
}

export default Mark;
