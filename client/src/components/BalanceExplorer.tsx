import { useCallback, useMemo, useState } from 'react';
import { formatSigned } from '../lib/format';
import { addDays, balanceHistory, summarise } from '../lib/ledger';
import type { Transaction } from '../types';
import BalanceChart, { type ChartMode } from './BalanceChart';
import RangeBrush, { type Range } from './RangeBrush';

const MODE_KEY = 'vaultx-chart-mode';

function readMode(): ChartMode {
  try {
    return localStorage.getItem(MODE_KEY) === 'line' ? 'line' : 'step';
  } catch {
    return 'step';
  }
}

function BalanceExplorer({ transactions }: { transactions: Transaction[] }) {
  const [today] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const { dates, values } = useMemo(() => balanceHistory(transactions, today), [transactions, today]);
  const n = dates.length;
  const [range, setRange] = useState<Range>(() => [Math.max(0, n - 30), n - 1]);
  const [mode, setMode] = useState<ChartMode>(readMode);
  const a = Math.min(range[0], n - 1);
  const b = Math.min(Math.max(range[1], a), n - 1);

  const labels = useMemo(() => dates.slice(a, b + 1).map((d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })), [dates, a, b]);
  const linear = useMemo(() => {
    const anchors = values.map((_, i) => i).filter((i) => i === 0 || i === values.length - 1 || values[i] !== values[i - 1]);
    const out = [...values];
    for (let k = 1; k < anchors.length; k++) {
      const from = anchors[k - 1];
      const to = anchors[k];
      for (let i = from + 1; i < to; i++) {
        out[i] = Math.round((values[from] + ((values[to] - values[from]) * (i - from)) / (to - from)) * 100) / 100;
      }
    }
    return out;
  }, [values]);
  const shown = useMemo(() => (mode === 'line' ? linear : values).slice(a, b + 1), [mode, linear, values, a, b]);
  const change = useMemo(() => {
    const { moneyIn, moneyOut } = summarise(transactions, dates[a], addDays(dates[b], 1));
    return Math.round((moneyIn - moneyOut) * 100) / 100;
  }, [transactions, dates, a, b]);

  const onRange = useCallback((next: Range) => setRange(next), []);

  function chooseMode(next: ChartMode) {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      return;
    }
  }

  const days = b - a + 1;
  const period =
    b === n - 1
      ? `in the last ${days} days`
      : `from ${dates[a].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} to ${dates[b].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;

  return (
    <>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          {change === 0 ? (
            `No change ${period}`
          ) : (
            <>
              <span className={`num font-medium ${change > 0 ? 'text-positive' : 'text-negative'}`}>{formatSigned(change)}</span> {period}
            </>
          )}
        </p>
        <div role="radiogroup" aria-label="Chart style" className="inline-flex rounded-md bg-raised p-0.5 text-[13px]">
          {(
            [
              ['step', 'Steps'],
              ['line', 'Line'],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => chooseMode(value)}
              className={`flex h-7 items-center gap-1.5 rounded-[5px] px-2.5 transition-colors duration-150 ${
                mode === value ? 'bg-surface font-medium text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d={value === 'step' ? 'M1 8h3V5h4V7h2V2h3' : 'M1 8 4 5l4 2 2-5 3 0'} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {text}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <BalanceChart labels={labels} values={shown} mode={mode} />
      </div>
      <RangeBrush dates={dates} values={values} range={[a, b]} onChange={onRange} transactions={transactions} />
    </>
  );
}

export default BalanceExplorer;
