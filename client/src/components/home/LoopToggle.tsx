import Icon from '../Icon';

function LoopToggle({ stopped, onToggle, label, onDark = false }: { stopped: boolean; onToggle: () => void; label: string; onDark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${stopped ? 'Play' : 'Pause'} ${label}`}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors duration-150 ${
        onDark ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-muted hover:bg-sky hover:text-ink'
      }`}
    >
      <Icon name={stopped ? 'play' : 'pause'} size={14} />
      {stopped ? 'Play' : 'Pause'}
    </button>
  );
}

export default LoopToggle;
