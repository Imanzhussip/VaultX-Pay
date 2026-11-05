import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ErrorNote from '../components/ErrorNote';
import Ledger, { LedgerSkeleton } from '../components/Ledger';
import PageHeader from '../components/PageHeader';
import PeriodSummary from '../components/PeriodSummary';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../lib/format';
import { addDays, inRange, parseDayKey, startOfMonth } from '../lib/ledger';
import type { Transaction } from '../types';

const views = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'in', label: 'Money in', test: (t: Transaction) => Number(t.amount) > 0 },
  { id: 'out', label: 'Money out', test: (t: Transaction) => Number(t.amount) < 0 },
] as const;

type ViewId = (typeof views)[number]['id'];

function Transactions() {
  const { data, error, loading, reload } = useApi<{ transactions: Transaction[] }>('/transactions');
  const [view, setView] = useState<ViewId>('all');
  const [params, setParams] = useSearchParams();
  const from = parseDayKey(params.get('from'));
  const to = parseDayKey(params.get('to'));
  const ranged = from && to && from <= to ? { since: from, until: addDays(to, 1) } : null;
  const all = data?.transactions ?? [];
  const transactions = ranged ? inRange(all, ranged.since, ranged.until) : all;
  const shown = transactions.filter(views.find((v) => v.id === view)!.test);
  const first = all[all.length - 1];
  const [monthStart] = useState(startOfMonth);
  const monthName = monthStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const rangeText = ranged ? `${formatDate(ranged.since.toISOString())} – ${formatDate(addDays(ranged.until, -1).toISOString())}` : '';

  return (
    <>
      <PageHeader
        title="Activity"
        subline={
          ranged
            ? `${transactions.length} ${transactions.length === 1 ? 'movement' : 'movements'} from ${rangeText}`
            : first
              ? `${all.length} movements since ${formatDate(first.created_at)}`
              : 'Every movement on your account, newest first'
        }
      />

      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="panel overflow-hidden" aria-labelledby="ledger-title">
          <h2 id="ledger-title" className="sr-only">Ledger</h2>
          {ranged && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sky px-5 py-2.5">
              <span>
                Showing <span className="num font-medium">{rangeText}</span>
              </span>
              <button type="button" onClick={() => setParams({})} className="link text-brand">
                Clear dates
              </button>
            </div>
          )}
          <div role="tablist" aria-label="Filter movements" className="flex gap-6 border-b border-line px-5">
            {views.map((v) => {
              const count = transactions.filter(v.test).length;
              const selected = v.id === view;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setView(v.id)}
                  className={`-mb-px flex h-11 items-center gap-1.5 border-b-2 transition-colors duration-150 ${
                    selected ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {v.label}
                  <span className="num text-[12px] text-muted">{count}</span>
                </button>
              );
            })}
          </div>
          {error ? (
            <div className="p-5"><ErrorNote message={error} onRetry={reload} /></div>
          ) : loading ? (
            <LedgerSkeleton rows={8} />
          ) : shown.length === 0 ? (
            <p className="m-5 rounded-md border border-dashed border-control px-3 py-2.5 text-muted">
              {all.length === 0 ? 'No movements yet. Add money from your card to start.' : ranged && transactions.length === 0 ? 'No movements in these dates.' : 'Nothing in this view.'}
            </p>
          ) : (
            <Ledger transactions={shown} />
          )}
        </section>

        {!loading && !error && (
          <div className="xl:sticky xl:top-8">
            {ranged ? (
              <PeriodSummary transactions={all} since={ranged.since} until={ranged.until} title={rangeText} />
            ) : (
              <PeriodSummary transactions={all} since={monthStart} title={monthName} />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Transactions;
