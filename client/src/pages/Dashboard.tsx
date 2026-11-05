import { useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceExplorer from '../components/BalanceExplorer';
import CardFace from '../components/CardFace';
import ErrorNote from '../components/ErrorNote';
import Ledger, { LedgerSkeleton } from '../components/Ledger';
import PageHeader from '../components/PageHeader';
import PeriodSummary from '../components/PeriodSummary';
import { useApi } from '../hooks/useApi';
import { formatDate, formatMoney, formatTime } from '../lib/format';
import { startOfDaysAgo } from '../lib/ledger';
import type { Account, Card, Transaction } from '../types';

const NO_TRANSACTIONS: Transaction[] = [];

function Dashboard() {
  const account = useApi<{ account: Account }>('/account');
  const history = useApi<{ transactions: Transaction[] }>('/transactions');
  const cards = useApi<{ cards: Card[] }>('/cards');
  const [since] = useState(() => startOfDaysAgo(29));

  const balance = account.data ? Number(account.data.account.balance) : null;
  const transactions = history.data?.transactions ?? NO_TRANSACTIONS;
  const latest = transactions[0];
  const card = cards.data?.cards.find((c) => c.is_active) ?? cards.data?.cards[0];

  return (
    <>
      <PageHeader
        title="Account"
        subline={latest ? `Last movement ${formatDate(latest.created_at)}, ${formatTime(latest.created_at)}` : 'No movements yet'}
        actions={
          <>
            <Link to="/funds" className="btn btn-secondary">Add money</Link>
            <Link to="/transfer" className="btn btn-primary">Send money</Link>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="panel p-5" aria-labelledby="balance-title">
          <h2 id="balance-title" className="text-muted">Available balance</h2>
          {account.error ? (
            <div className="mt-3"><ErrorNote message={account.error} onRetry={account.reload} /></div>
          ) : (
            <p className="num mt-1 text-[32px] font-bold leading-10 tracking-[-0.02em]">
              {balance === null ? <span className="skeleton h-8 w-48 align-middle" /> : formatMoney(balance)}
            </p>
          )}
          {history.error ? (
            <div className="mt-4"><ErrorNote message={history.error} onRetry={history.reload} /></div>
          ) : history.loading ? (
            <div className="mt-2 min-h-[320px]"><span className="skeleton h-3.5 w-52" /></div>
          ) : (
            <BalanceExplorer transactions={transactions} />
          )}
        </section>

        <section className="panel order-last flex flex-col p-5 xl:order-none" aria-labelledby="card-title">
          <div className="flex items-baseline justify-between">
            <h2 id="card-title" className="text-[16px] font-medium leading-6">Linked card</h2>
            <Link to="/cards" className="link">Manage</Link>
          </div>
          <div className="mt-4 flex flex-1 flex-col">
            {cards.error ? (
              <ErrorNote message={cards.error} onRetry={cards.reload} />
            ) : cards.loading ? (
              <span className="skeleton aspect-[1.586] w-full max-w-[320px]" />
            ) : card ? (
              <>
                <CardFace card={card} />
                <dl className="mt-auto pt-4">
                  <div className="flex h-8 items-center justify-between">
                    <dt className="text-muted">Status</dt>
                    <dd className={card.is_active ? '' : 'text-muted'}>{card.is_active ? 'Active' : 'Paused'}</dd>
                  </div>
                  <div className="flex h-8 items-center justify-between">
                    <dt className="text-muted">Used for</dt>
                    <dd>Adding and withdrawing</dd>
                  </div>
                </dl>
              </>
            ) : (
              <div className="flex flex-1 flex-col justify-center rounded-md border border-dashed border-control p-4">
                <p>Link a card to add or withdraw money.</p>
                <Link to="/cards" className="link mt-2 self-start">Add a card</Link>
              </div>
            )}
          </div>
        </section>

        <section className="panel overflow-hidden" aria-labelledby="recent-title">
          <div className="flex items-baseline justify-between px-5 pb-2 pt-5">
            <h2 id="recent-title" className="text-[16px] font-medium leading-6">Recent activity</h2>
            {transactions.length > 0 && (
              <Link to="/transactions" className="link">View all {transactions.length}</Link>
            )}
          </div>
          {history.loading ? (
            <LedgerSkeleton />
          ) : transactions.length === 0 ? (
            <p className="mx-5 mb-5 rounded-md border border-dashed border-control px-3 py-2.5 text-muted">
              No movements yet. Add money from your card to start.
            </p>
          ) : (
            <Ledger transactions={transactions.slice(0, 5)} />
          )}
        </section>

        {history.loading ? (
          <div className="panel p-5"><span className="skeleton h-4 w-32" /></div>
        ) : (
          <PeriodSummary transactions={transactions} since={since} title="Last 30 days" />
        )}
      </div>
    </>
  );
}

export default Dashboard;
