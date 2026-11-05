import { formatMoney, formatSigned } from '../lib/format';

function BalancePreview({ balance, change, changeLabel }: { balance: number | null; change: number; changeLabel: string }) {
  const after = balance === null ? null : Math.round((balance + change) * 100) / 100;
  const short = after !== null && after < 0;
  return (
    <dl className="rounded-md bg-raised px-4 py-2" aria-live="polite">
      <div className="flex h-9 items-center justify-between">
        <dt className="text-muted">Balance now</dt>
        <dd className="num">{balance === null ? <span className="skeleton h-3.5 w-20" /> : formatMoney(balance)}</dd>
      </div>
      <div className="flex h-9 items-center justify-between">
        <dt className="text-muted">{changeLabel}</dt>
        <dd className="num">{change === 0 ? <span className="text-muted">—</span> : formatSigned(change)}</dd>
      </div>
      <div className="flex h-11 items-center justify-between border-t border-control font-medium">
        <dt>Balance after</dt>
        <dd className={`num text-[16px] font-bold ${short ? 'text-negative' : ''}`}>{after === null ? '—' : formatMoney(after)}</dd>
      </div>
      {short && <p className="pb-2 text-[12px] leading-4 text-negative">That is {formatMoney(-after)} more than you have.</p>}
    </dl>
  );
}

export default BalancePreview;
