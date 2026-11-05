import { formatMoney, formatSigned, initials } from '../lib/format';
import { summarise } from '../lib/ledger';
import type { Transaction } from '../types';

const tints = [
  ['#dcebf7', '#0f3b66'],
  ['#dff1e3', '#1d4d27'],
  ['#d9f0ee', '#0e4a45'],
  ['#f6e8d5', '#6b3d0e'],
];

function tintFor(email: string) {
  let hash = 0;
  for (const ch of email) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return tints[hash % tints.length];
}

function PeriodSummary({ transactions, since, until, title }: { transactions: Transaction[]; since: Date; until?: Date; title: string }) {
  const { moneyIn, moneyOut, people, count } = summarise(transactions, since, until);
  const net = Math.round((moneyIn - moneyOut) * 100) / 100;
  return (
    <section className="panel flex flex-col p-5" aria-labelledby="summary-title">
      <h2 id="summary-title" className="text-[16px] font-medium leading-6">{title}</h2>
      <dl className="mt-3 rounded-md bg-raised px-3 py-1">
        <div className="flex h-8 items-center justify-between">
          <dt className="text-muted">Money in</dt>
          <dd className="num">{formatMoney(moneyIn)}</dd>
        </div>
        <div className="flex h-8 items-center justify-between">
          <dt className="text-muted">Money out</dt>
          <dd className="num">{formatMoney(moneyOut)}</dd>
        </div>
        <div className="flex h-8 items-center justify-between font-medium">
          <dt>Net change</dt>
          <dd className={`num ${net > 0 ? 'text-positive' : net < 0 ? 'text-negative' : 'text-muted'}`}>{formatSigned(net)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-[12px] leading-4 text-muted">
        {count === 1 ? '1 movement' : `${count} movements`}
      </p>

      <h3 className="mt-5 font-medium">People</h3>
      {people.length === 0 ? (
        <p className="mt-2 rounded-md border border-dashed border-control px-3 py-2.5 text-muted">No transfers in this period.</p>
      ) : (
        <ul className="mt-1">
          {people.slice(0, 4).map((p) => {
            const [bg, ink] = tintFor(p.email);
            return (
              <li key={p.email} className="flex h-12 items-center gap-3">
                <span className="grid size-8 flex-none place-items-center rounded-full text-[12px] font-medium" style={{ background: bg, color: ink }} aria-hidden="true">
                  {initials(p.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{p.name}</span>
                  <span className="block text-[12px] leading-4 text-muted">{p.count === 1 ? '1 transfer' : `${p.count} transfers`}</span>
                </span>
                <span className={`num flex-none ${p.net > 0 ? 'text-positive' : ''}`}>{formatSigned(p.net)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default PeriodSummary;
