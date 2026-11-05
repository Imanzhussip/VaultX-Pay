import type { Card } from '../types';
import Mark from './Mark';

function CardFace({ card, fluid = false, className = '' }: { card: Card; fluid?: boolean; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[1.586] w-full flex-col justify-between rounded-[10px] p-5 text-white transition-colors duration-200 ${
        fluid ? '' : 'max-w-[320px]'
      } ${card.is_active ? 'bg-primary' : 'bg-[#646a7d]'} ${className}`}
      aria-label={`${card.card_type} card ending ${card.last_four}, ${card.is_active ? 'active' : 'paused'}`}
      role="img"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium">
          <Mark size={18} inverted />
          VaultX
        </span>
        <span className="flex items-center gap-2 text-[13px] font-medium">
          {!card.is_active && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] leading-4">Paused</span>}
          {card.card_type}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="num text-[18px] font-medium tracking-[0.08em]">•••• {card.last_four}</span>
        <span className="num text-[12px] text-white/80">{card.expiry_date}</span>
      </div>
    </div>
  );
}

export default CardFace;
