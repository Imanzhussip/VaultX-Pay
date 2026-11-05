import { useDemoLoop } from '../../hooks/useDemoLoop';
import { formatMoney } from '../../lib/format';
import Icon from '../Icon';
import LoopToggle from './LoopToggle';

const BALANCE = 1320.25;

const frames: { amount: string; pressed?: boolean; sent?: boolean; ms: number }[] = [
  { amount: '', ms: 900 },
  { amount: '1', ms: 140 },
  { amount: '12', ms: 140 },
  { amount: '121', ms: 140 },
  { amount: '121.', ms: 140 },
  { amount: '121.5', ms: 140 },
  { amount: '121.50', ms: 1100 },
  { amount: '121.50', pressed: true, ms: 220 },
  { amount: '121.50', sent: true, ms: 2600 },
];

const FINAL = 6;
const DURATIONS = frames.map((f) => f.ms);

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? 'h-10 border-t border-control font-semibold' : 'h-8'}`}>
      <span className={strong ? '' : 'text-muted'}>{label}</span>
      <span className="num">{value}</span>
    </div>
  );
}

function PhoneMock() {
  const { ref: loopRef, index: loopIndex, playing, stopped, toggle, controllable } = useDemoLoop<HTMLDivElement>(DURATIONS, FINAL);
  const frame = frames[loopIndex];
  const amount = Number(frame.amount) || 0;
  const typing = playing && loopIndex < FINAL;

  return (
    <figure className="mx-auto w-[300px]">
      <div
        ref={loopRef}
        className="rounded-[46px] bg-ink p-3 shadow-[0_32px_64px_-24px_rgb(11_16_32/0.5)]"
        role="img"
        aria-label="The VaultX Pay app sending HK$121.50 to Wong Tsz Hin, leaving a balance of HK$1,198.75"
      >
        <div className="relative flex h-[588px] flex-col overflow-hidden rounded-[36px] bg-ground px-4 pb-5 pt-3 text-[13px] leading-5" aria-hidden="true">
          <div className="flex items-center justify-between px-2 text-[12px] font-semibold">
            <span className="num">9:41</span>
            <span className="h-[22px] w-[84px] rounded-full bg-ink" />
            <span className="num">100%</span>
          </div>
          <p className="mt-5 font-display text-[22px] font-bold leading-7">Send money</p>

          <p className="mt-4 text-[12px] text-muted">Paid before</p>
          <div className="mt-2 flex gap-3">
            {[
              ['WT', 'Tsz Hin', '#dcebf7', '#0f3b66', true],
              ['PN', 'Priya', '#f6e8d5', '#6b3d0e', false],
              ['CL', 'Hoi Lam', '#dff1e3', '#1d4d27', false],
            ].map(([initials, name, bg, ink, selected]) => (
              <span key={name as string} className="flex w-14 flex-col items-center gap-1">
                <span
                  className={`grid size-11 place-items-center rounded-full text-[13px] font-semibold ${selected ? 'ring-2 ring-brand ring-offset-2 ring-offset-ground' : ''}`}
                  style={{ background: bg as string, color: ink as string }}
                >
                  {initials}
                </span>
                <span className="text-[11px] leading-4 text-muted">{name}</span>
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-[12px] text-muted">To</p>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-[#dcebf7] text-[12px] font-semibold text-[#0f3b66]">WT</span>
              <span className="min-w-0">
                <span className="block font-semibold">Wong Tsz Hin</span>
                <span className="block text-[12px] text-muted">Paid 3 times before</span>
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 text-center">
            <p className="text-[12px] text-muted">Amount</p>
            <p className={`num font-display text-[36px] font-bold leading-[44px] tracking-[-0.02em] ${frame.amount ? '' : 'text-control'}`}>
              HK${frame.amount || '0.00'}
              {typing && <span className="phone-caret ml-0.5 inline-block h-8 w-[2px] translate-y-1 bg-brand" />}
            </p>
            <p className="text-[12px] text-muted">Dim sum, Saturday</p>
          </div>

          <div className="mt-3 rounded-2xl bg-white px-4 py-2">
            <Row label="Balance now" value={formatMoney(BALANCE)} />
            <Row label="This transfer" value={amount ? formatMoney(-amount) : '—'} />
            <Row label="Balance after" value={formatMoney(BALANCE - amount)} strong />
          </div>

          <span
            className={`mt-auto flex h-12 items-center justify-center rounded-full text-[15px] font-semibold text-white transition-[transform,background-color] duration-150 ${
              frame.pressed ? 'scale-[0.96] bg-brand-hover' : 'bg-brand'
            }`}
          >
            Send {amount ? formatMoney(amount) : 'money'}
          </span>

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-white px-8 text-center transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              frame.sent ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <span className={`grid size-16 place-items-center rounded-full bg-brand text-white transition-transform delay-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${frame.sent ? 'scale-100' : 'scale-50'}`}>
              <Icon name="check" size={30} />
            </span>
            <p className="mt-5 font-display text-[22px] font-bold leading-7">HK$121.50 sent</p>
            <p className="mt-1 text-muted">to Wong Tsz Hin</p>
            <p className="mt-6 text-[12px] text-muted">Balance after</p>
            <p className="num text-[17px] font-semibold">HK$1,198.75</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-center gap-2 text-[13px] leading-5 text-muted">
        Illustration of the VaultX Pay app
        {controllable && <LoopToggle stopped={stopped} onToggle={toggle} label="the app demo" />}
      </figcaption>
    </figure>
  );
}

export default PhoneMock;
