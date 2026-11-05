import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../lib/format';
import Icon from '../Icon';

const MIN_PEOPLE = 2;
const MAX_PEOPLE = 12;

function useRollingNumber(target: number) {
  const [shown, setShown] = useState(0);
  const current = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = current.current;
    const duration = first.current ? 1100 : 450;
    const delay = first.current ? 450 : 0;
    first.current = false;
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.max(0, Math.min(1, (now - start) / duration));
      const value = from + (target - from) * (1 - Math.pow(1 - t, 4));
      current.current = value;
      setShown(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}

function SplitBill() {
  const [total, setTotal] = useState('486');
  const [people, setPeople] = useState(4);

  const cents = Math.round(Number(total) * 100);
  const valid = Number.isFinite(cents) && cents > 0 && cents <= 9_999_999;
  const shareCents = valid ? Math.floor(cents / people) : 0;
  const friends = people - 1;
  const share = shareCents / 100;
  const collect = (shareCents * friends) / 100;
  const shown = useRollingNumber(share);
  const shownCents = Math.round(shown * 100);

  return (
    <section
      id="split"
      aria-labelledby="split-title"
      className="on-light rounded-[20px] bg-white p-6 text-ink shadow-[0_24px_48px_-16px_rgb(11_16_32/0.45)] sm:p-7"
    >
      <h2 id="split-title" className="font-display text-[24px] font-bold leading-8 tracking-[-0.01em]">Split a bill</h2>
      <p className="mt-1 text-[15px] leading-6 text-muted">See what everyone owes before anyone pays.</p>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div>
          <label htmlFor="split-total" className="field-label text-[14px]">Bill total</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-muted">HK$</span>
            <input
              id="split-total"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="input num h-12 pl-12 text-[17px]"
            />
          </div>
        </div>
        <div>
          <span id="split-people-label" className="field-label text-[14px]">People</span>
          <div role="group" aria-labelledby="split-people-label" className="flex h-12 items-center rounded-md border border-control">
            <button
              type="button"
              onClick={() => setPeople((p) => Math.max(MIN_PEOPLE, p - 1))}
              disabled={people <= MIN_PEOPLE}
              aria-label="Fewer people"
              className="grid h-full w-11 place-items-center transition-[background-color,scale] duration-150 hover:bg-sky active:scale-90 disabled:opacity-40"
            >
              <Icon name="minus" />
            </button>
            <output aria-live="polite" className="num w-8 text-center text-[17px] font-semibold">{people}</output>
            <button
              type="button"
              onClick={() => setPeople((p) => Math.min(MAX_PEOPLE, p + 1))}
              disabled={people >= MAX_PEOPLE}
              aria-label="More people"
              className="grid h-full w-11 place-items-center transition-[background-color,scale] duration-150 hover:bg-sky active:scale-90 disabled:opacity-40"
            >
              <Icon name="plus" />
            </button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {valid ? `Each friend sends you ${formatMoney(share)}. You collect ${formatMoney(collect)}.` : 'Enter the bill total to split it.'}
      </p>
      <div className="mt-5 rounded-2xl bg-sky px-5 py-4" aria-hidden="true">
        <p className="text-[14px] leading-5 text-muted">Each friend sends you</p>
        <p className="num font-display text-[40px] font-bold leading-[48px] tracking-[-0.02em] text-brand">
          {valid ? formatMoney(shownCents / 100) : '—'}
        </p>
        <p className="text-[14px] leading-5 text-muted">
          {valid ? (
            <>
              You collect <span className="num font-semibold text-ink">{formatMoney((shownCents * friends) / 100)}</span> from {friends} {friends === 1 ? 'friend' : 'friends'}.
            </>
          ) : (
            'Enter the bill total to split it.'
          )}
        </p>
      </div>

      <Link to="/register" className="btn btn-primary btn-lg mt-5 w-full">
        Open an account to collect it
      </Link>
    </section>
  );
}

export default SplitBill;
