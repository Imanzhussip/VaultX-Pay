import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { describeTransaction, formatDay, formatMoney, formatSigned } from '../lib/format';
import { addDays, dayKey, inRange, summarise } from '../lib/ledger';
import type { Transaction } from '../types';

export type Range = [number, number];

const HEIGHT = 56;
const MIN_SPAN = 2;

type Drag = { kind: 'move' | 'start' | 'end'; x: number; range: Range; moved: boolean };

function clampRange([a, b]: Range, n: number): Range {
  const span = Math.max(MIN_SPAN, b - a);
  const start = Math.max(0, Math.min(a, n - 1 - span));
  return [start, Math.min(n - 1, start + span)];
}

function label(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function RangeBrush({
  dates,
  values,
  range,
  onChange,
  transactions,
}: {
  dates: Date[];
  values: number[];
  range: Range;
  onChange: (range: Range) => void;
  transactions: Transaction[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const drag = useRef<Drag | null>(null);
  const closeTimer = useRef(0);
  const n = dates.length;
  const [a, b] = range;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!delta) return;
      e.preventDefault();
      const days = Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) / 24));
      onChange(clampRange([a + days, b + days], n));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [a, b, n, onChange]);

  const x = (i: number) => (n > 1 ? (i / (n - 1)) * width : 0);
  const max = Math.max(1, ...values) * 1.15;
  const y = (v: number) => HEIGHT - 6 - (v / max) * (HEIGHT - 12);
  const path = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const area = width ? `${path}L${x(n - 1).toFixed(1)} ${HEIGHT}L0 ${HEIGHT}Z` : '';

  function startDrag(kind: Drag['kind'], e: ReactPointerEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { kind, x: e.clientX, range, moved: false };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || !width) return;
    const days = Math.round(((e.clientX - d.x) / width) * (n - 1));
    if (days !== 0) d.moved = true;
    const [s, t] = d.range;
    if (d.kind === 'move') onChange(clampRange([s + days, t + days], n));
    if (d.kind === 'start') onChange([Math.max(0, Math.min(s + days, t - MIN_SPAN)), t]);
    if (d.kind === 'end') onChange([s, Math.min(n - 1, Math.max(t + days, s + MIN_SPAN))]);
  }

  function endDrag(e: ReactPointerEvent<HTMLElement>) {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved && e.pointerType !== 'mouse') setOpen((o) => !o);
  }

  function jumpTo(e: ReactPointerEvent<HTMLDivElement>) {
    if (!width) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centre = Math.round(((e.clientX - rect.left) / width) * (n - 1));
    const span = b - a;
    onChange(clampRange([centre - Math.round(span / 2), centre - Math.round(span / 2) + span], n));
  }

  function keyMove(kind: Drag['kind'], e: KeyboardEvent<HTMLElement>) {
    const step = e.shiftKey ? 7 : 1;
    const delta = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : 0;
    if (e.key === 'Escape') setOpen(false);
    if (!delta) return;
    e.preventDefault();
    if (kind === 'move') onChange(clampRange([a + delta, b + delta], n));
    if (kind === 'start') onChange([Math.max(0, Math.min(a + delta, b - MIN_SPAN)), b]);
    if (kind === 'end') onChange([a, Math.min(n - 1, Math.max(b + delta, a + MIN_SPAN))]);
  }

  function show() {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  }

  const since = dates[a];
  const until = addDays(dates[b], 1);
  const { moneyIn, moneyOut, count } = summarise(transactions, since, until);
  const recent = inRange(transactions, since, until).slice(0, 3);
  const rangeText = `${label(dates[a])} – ${label(dates[b])}`;
  const left = x(a);
  const right = x(b);
  const popLeft = Math.max(0, Math.min(width - 300, (left + right) / 2 - 150));

  return (
    <div className="relative mt-4 select-none" onPointerLeave={hide}>
      <div className="mb-1.5 flex items-baseline justify-between text-[12px] leading-4 text-muted">
        <span>Drag or resize the window to choose dates</span>
        <span className="num">{b - a + 1} days</span>
      </div>
      <div
        ref={trackRef}
        className="relative touch-pan-y rounded-md bg-raised"
        style={{ height: HEIGHT }}
        onPointerDown={jumpTo}
      >
        {width > 0 && (
          <svg width={width} height={HEIGHT} className="absolute inset-0 block" aria-hidden="true">
            <path d={area} fill="#2341e0" opacity={0.1} />
            <path d={path} fill="none" stroke="#2341e0" strokeOpacity={0.55} strokeWidth={1.5} />
          </svg>
        )}
        <div className="absolute inset-y-0 left-0 rounded-l-md bg-ground/70" style={{ width: left }} aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 rounded-r-md bg-ground/70" style={{ width: Math.max(0, width - right) }} aria-hidden="true" />

        <div
          role="slider"
          tabIndex={0}
          aria-label="Date range"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={a}
          aria-valuetext={rangeText}
          aria-expanded={open}
          className="absolute inset-y-0 cursor-grab rounded-[5px] border-2 border-brand bg-brand/[0.06] active:cursor-grabbing"
          style={{ left, width: Math.max(8, right - left) }}
          onPointerDown={(e) => startDrag('move', e)}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
          onFocus={show}
          onBlur={hide}
          onKeyDown={(e) => keyMove('move', e)}
        />
        {(['start', 'end'] as const).map((kind) => (
          <div
            key={kind}
            role="slider"
            tabIndex={0}
            aria-label={kind === 'start' ? 'Start date' : 'End date'}
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={kind === 'start' ? a : b}
            aria-valuetext={label(dates[kind === 'start' ? a : b])}
            className="group absolute inset-y-0 z-10 flex w-4 -translate-x-1/2 cursor-ew-resize items-center justify-center"
            style={{ left: kind === 'start' ? left : right }}
            onPointerDown={(e) => startDrag(kind, e)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
            onFocus={show}
            onBlur={hide}
            onKeyDown={(e) => keyMove(kind, e)}
          >
            <span className="h-6 w-1.5 rounded-full bg-brand transition-transform duration-150 group-hover:scale-y-125" />
          </div>
        ))}
      </div>
      <div className="relative mt-1 h-4 text-[12px] leading-4 text-muted" aria-hidden="true">
        <span className="num absolute" style={{ left: Math.max(0, Math.min(left, width - 110)) }}>{rangeText}</span>
      </div>

      {open && width > 0 && (
        <div
          role="dialog"
          aria-label={`Summary for ${rangeText}`}
          className="absolute z-30 mt-2 w-[300px] rounded-xl border border-line bg-surface p-4 shadow-[0_16px_40px_-12px_rgb(11_16_32/0.28)]"
          style={{ left: popLeft }}
          onPointerEnter={show}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          <p className="font-medium">{rangeText}</p>
          <p className="text-[12px] leading-4 text-muted">{count === 1 ? '1 movement' : `${count} movements`}</p>
          <dl className="mt-3 rounded-md bg-raised px-3 py-1">
            <div className="flex h-8 items-center justify-between">
              <dt className="text-muted">Spent</dt>
              <dd className="num font-medium">{formatMoney(moneyOut)}</dd>
            </div>
            <div className="flex h-8 items-center justify-between">
              <dt className="text-muted">Received</dt>
              <dd className="num">{formatMoney(moneyIn)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[12px] leading-4 text-muted">Recent in this range</p>
          {recent.length === 0 ? (
            <p className="mt-1 text-muted">No movements in these dates.</p>
          ) : (
            <ul className="mt-1">
              {recent.map((t) => (
                <li key={t.id} className="flex h-10 items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate">{describeTransaction(t).title}</span>
                    <span className="num block text-[12px] leading-4 text-muted">{formatDay(t.created_at)}</span>
                  </span>
                  <span className={`num flex-none ${Number(t.amount) > 0 ? 'text-positive' : ''}`}>{formatSigned(Number(t.amount))}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/transactions?from=${dayKey(dates[a])}&to=${dayKey(dates[b])}`} className="btn btn-primary mt-3 w-full">
            View all {count} in this range
          </Link>
        </div>
      )}
    </div>
  );
}

export default RangeBrush;
