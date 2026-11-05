import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BalancePreview from '../components/BalancePreview';
import ErrorNote from '../components/ErrorNote';
import Icon from '../components/Icon';
import Ledger, { LedgerSkeleton } from '../components/Ledger';
import PageHeader from '../components/PageHeader';
import { useApi } from '../hooks/useApi';
import { getErrorMessage } from '../lib/errors';
import { formatMoney } from '../lib/format';
import { summarise } from '../lib/ledger';
import type { Account, Transaction } from '../types';

const ALL_TIME = new Date(0);

function Transfer() {
  const account = useApi<{ account: Account }>('/account');
  const history = useApi<{ transactions: Transaction[] }>('/transactions');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ amount: number; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const balance = account.data ? Number(account.data.account.balance) : null;
  const value = Number(amount) > 0 ? Math.round(Number(amount) * 100) / 100 : 0;
  const transactions = history.data?.transactions ?? [];
  const people = summarise(transactions, ALL_TIME).people.slice(0, 4);
  const transfers = transactions.filter((t) => t.type === 'transfer_in' || t.type === 'transfer_out').slice(0, 5);
  const tooMuch = balance !== null && value > balance;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSent(null);
    setLoading(true);
    try {
      await api.post('/account/transfer', { receiverEmail, amount: value });
      setSent({ amount: value, email: receiverEmail });
      setReceiverEmail('');
      setAmount('');
      account.reload();
      history.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Send money" subline="Transfers arrive at once and cannot be reversed." />

      <div className="grid gap-3">
        <form onSubmit={handleSubmit} className="panel grid md:grid-cols-2" aria-label="Send money">
          <div className="p-5">
            <h2 className="text-[16px] font-medium leading-6">Who and how much</h2>

            {sent && (
              <div role="status" className="mt-4 flex items-start gap-2 rounded-md bg-[#dcfae5] px-3 py-2.5 text-[#04250e]">
                <Icon name="check" />
                <span>
                  Sent <span className="num font-medium">{formatMoney(sent.amount)}</span> to {sent.email}.
                </span>
              </div>
            )}
            {error && <div className="mt-4"><ErrorNote message={error} /></div>}

            <label htmlFor="receiver" className="field-label mt-5">Recipient email</label>
            <input
              id="receiver"
              type="email"
              autoComplete="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
              className="input"
            />

            {people.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="People you have paid before">
                {people.map((p) => (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => setReceiverEmail(p.email)}
                    aria-pressed={receiverEmail === p.email}
                    className={`h-8 rounded-md border px-3 text-[13px] transition-colors duration-150 ${
                      receiverEmail === p.email ? 'border-ink bg-ink text-white' : 'border-control bg-surface hover:border-ink'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            <label htmlFor="amount" className="field-label mt-4">Amount</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">HK$</span>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input num pl-12"
              />
            </div>
          </div>

          <div className="flex flex-col border-t border-line p-5 md:border-l md:border-t-0">
            <h2 className="text-[16px] font-medium leading-6">After this transfer</h2>
            <div className="mt-4">
              <BalancePreview balance={balance} change={-value} changeLabel="This transfer" />
            </div>
            <p className="mt-3 text-[12px] leading-4 text-muted">
              Your balance and theirs change in one step. If either side fails, neither changes.
            </p>
            <button type="submit" disabled={loading || tooMuch} className="btn btn-primary mt-auto w-full">
              {loading ? 'Sending…' : value > 0 ? `Send ${formatMoney(value)}` : 'Send money'}
            </button>
          </div>
        </form>

        <section className="panel overflow-hidden" aria-labelledby="transfers-title">
          <div className="flex items-baseline justify-between px-5 pb-2 pt-5">
            <h2 id="transfers-title" className="text-[16px] font-medium leading-6">Recent transfers</h2>
            <Link to="/transactions" className="link">All activity</Link>
          </div>
          {history.error ? (
            <div className="px-5 pb-5"><ErrorNote message={history.error} onRetry={history.reload} /></div>
          ) : history.loading ? (
            <LedgerSkeleton rows={3} />
          ) : transfers.length === 0 ? (
            <p className="mx-5 mb-5 rounded-md border border-dashed border-control px-3 py-2.5 text-muted">No transfers yet.</p>
          ) : (
            <Ledger transactions={transfers} />
          )}
        </section>
      </div>
    </>
  );
}

export default Transfer;
