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
import type { Account, Card, Transaction } from '../types';

type Mode = 'deposit' | 'withdraw';

const modes: { id: Mode; label: string }[] = [
  { id: 'deposit', label: 'Add money' },
  { id: 'withdraw', label: 'Withdraw' },
];

function DepositWithdraw() {
  const account = useApi<{ account: Account }>('/account');
  const cards = useApi<{ cards: Card[] }>('/cards');
  const history = useApi<{ transactions: Transaction[] }>('/transactions');
  const [mode, setMode] = useState<Mode>('deposit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const balance = account.data ? Number(account.data.account.balance) : null;
  const value = Number(amount) > 0 ? Math.round(Number(amount) * 100) / 100 : 0;
  const card = cards.data?.cards.find((c) => c.is_active);
  const noCard = !cards.loading && !cards.error && !card;
  const tooMuch = mode === 'withdraw' && balance !== null && value > balance;
  const cardMovements = (history.data?.transactions ?? []).filter((t) => t.type === 'deposit' || t.type === 'withdraw').slice(0, 5);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post(`/account/${mode}`, { amount: value });
      setSuccess(mode === 'deposit' ? `Added ${formatMoney(value)} from your card.` : `Withdrew ${formatMoney(value)} to your card.`);
      setAmount('');
      account.reload();
      history.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setSuccess('');
  }

  return (
    <>
      <PageHeader title="Add or withdraw" subline="Move money between your linked card and your VaultX balance." />

      <div className="grid gap-3">
        <form onSubmit={handleSubmit} className="panel grid md:grid-cols-2" aria-label={mode === 'deposit' ? 'Add money' : 'Withdraw'}>
          <div className="p-5">
            <h2 className="sr-only">Direction and amount</h2>
            <div role="radiogroup" aria-label="Direction" className="inline-flex rounded-md bg-raised p-1">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  onClick={() => switchMode(m.id)}
                  className={`h-8 rounded-[5px] px-4 transition-colors duration-150 ${
                    mode === m.id ? 'bg-surface font-medium text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {success && (
              <div role="status" className="mt-4 flex items-start gap-2 rounded-md bg-[#dcfae5] px-3 py-2.5 text-[#04250e]">
                <Icon name="check" />
                <span>{success}</span>
              </div>
            )}
            {error && <div className="mt-4"><ErrorNote message={error} /></div>}

            <label htmlFor="amount" className="field-label mt-5">Amount</label>
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
                disabled={noCard}
                className="input num pl-12"
              />
            </div>

            <p className="mt-4 text-muted">
              {cards.loading ? (
                <span className="skeleton h-3.5 w-40 align-middle" />
              ) : card ? (
                <>
                  {mode === 'deposit' ? 'From' : 'To'} <span className="font-medium text-ink">{card.card_type} •••• {card.last_four}</span>
                </>
              ) : noCard ? (
                <>
                  You need an active card first. <Link to="/cards" className="link text-ink">Add or turn on a card</Link>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-col border-t border-line p-5 md:border-l md:border-t-0">
            <h2 className="text-[16px] font-medium leading-6">Your balance</h2>
            <div className="mt-4">
              <BalancePreview balance={balance} change={mode === 'deposit' ? value : -value} changeLabel={mode === 'deposit' ? 'Adding' : 'Withdrawing'} />
            </div>
            <button type="submit" disabled={loading || noCard || tooMuch} className="btn btn-primary mt-auto w-full">
              {loading ? 'Processing…' : `${mode === 'deposit' ? 'Add' : 'Withdraw'}${value > 0 ? ' ' + formatMoney(value) : ' money'}`}
            </button>
          </div>
        </form>

        <section className="panel overflow-hidden" aria-labelledby="card-moves-title">
          <div className="flex items-baseline justify-between px-5 pb-2 pt-5">
            <h2 id="card-moves-title" className="text-[16px] font-medium leading-6">Recent card movements</h2>
            <Link to="/transactions" className="link">All activity</Link>
          </div>
          {history.error ? (
            <div className="px-5 pb-5"><ErrorNote message={history.error} onRetry={history.reload} /></div>
          ) : history.loading ? (
            <LedgerSkeleton rows={3} />
          ) : cardMovements.length === 0 ? (
            <p className="mx-5 mb-5 rounded-md border border-dashed border-control px-3 py-2.5 text-muted">Nothing added or withdrawn yet.</p>
          ) : (
            <Ledger transactions={cardMovements} />
          )}
        </section>
      </div>
    </>
  );
}

export default DepositWithdraw;
