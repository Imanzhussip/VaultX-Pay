import { useState } from 'react';
import api from '../api/axios';
import CardFace from '../components/CardFace';
import ErrorNote from '../components/ErrorNote';
import PageHeader from '../components/PageHeader';
import { useApi } from '../hooks/useApi';
import { getErrorMessage } from '../lib/errors';
import type { Card } from '../types';

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})(?=.)/g, '$1 ');
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function Cards() {
  const { data, error: loadError, loading, reload } = useApi<{ cards: Card[] }>('/cards');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('Visa');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');
  const [toggleError, setToggleError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const cards = data?.cards ?? [];
  const anyActive = cards.some((c) => c.is_active);

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) {
      setError('Enter the 13 to 19 digits on the front of the card.');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError('Enter the expiry as MM/YY, for example 08/28.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/cards', { card_number: digits, card_type: cardType, expiry_date: expiry });
      setCardNumber('');
      setExpiry('');
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle() {
    setToggleError('');
    setToggling(true);
    try {
      await api.post('/account/active', { is_active: !anyActive });
      reload();
    } catch (err) {
      setToggleError(getErrorMessage(err));
    } finally {
      setToggling(false);
    }
  }

  return (
    <>
      <PageHeader title="Cards" subline={loading ? ' ' : cards.length === 1 ? '1 linked card' : `${cards.length} linked cards`} />

      <div className="max-w-[1152px]">
        <section className="grid gap-4 border-b border-line pb-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8" aria-labelledby="linked-title">
          <div className="pt-1">
            <h2 id="linked-title" className="text-[16px] font-medium leading-6">Linked cards</h2>
            <p className="mt-1 text-muted">Adding and withdrawing money go through your active card. Pause your cards to stop both at once.</p>
          </div>
          <div className="rounded-2xl bg-[#f8f9fa] p-4 border border-line">
            {loadError ? (
              <ErrorNote message={loadError} onRetry={reload} />
            ) : loading ? (
              <span className="skeleton aspect-[1.586] w-full max-w-[280px]" />
            ) : cards.length === 0 ? (
              <p className="rounded-md border border-dashed border-control px-3 py-2.5 text-muted">No cards yet. Add one below.</p>
            ) : (
              <>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {cards.map((c) => (
                    <li key={c.id}>
                      <div className="max-w-[280px]"><CardFace card={c} /></div>
                      <p className="mt-2 text-muted">
                        {c.card_type} ending {c.last_four} · <span className={c.is_active ? 'text-ink' : ''}>{c.is_active ? 'Active' : 'Paused'}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between gap-4 rounded-md bg-surface px-4 py-3 border border-line">
                  <div>
                    <p id="cards-switch-label" className="font-medium">Cards on</p>
                    <p className="text-muted">{anyActive ? 'You can add and withdraw money.' : 'Adding and withdrawing are paused.'}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={anyActive}
                    aria-labelledby="cards-switch-label"
                    disabled={toggling}
                    onClick={handleToggle}
                    className={`relative h-5 w-9 flex-none rounded-full transition-colors duration-200 ${anyActive ? 'bg-positive' : 'bg-control'}`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform duration-200 ${anyActive ? 'translate-x-4' : ''}`}
                    />
                  </button>
                </div>
                {toggleError && <div className="mt-3"><ErrorNote message={toggleError} /></div>}
              </>
            )}
          </div>
        </section>

        <section className="grid gap-4 pt-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8" aria-labelledby="add-title">
          <div className="pt-1">
            <h2 id="add-title" className="text-[16px] font-medium leading-6">Add a card</h2>
            <p className="mt-1 text-muted">We check the number before saving and keep only its last four digits.</p>
          </div>
          <form onSubmit={handleAddCard} className="rounded-2xl bg-[#f8f9fa] p-4 border border-line">
            {error && <div className="mb-4"><ErrorNote message={error} /></div>}
            <label htmlFor="card-number" className="field-label">Card number</label>
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
              className="input num tracking-[0.04em]"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-type" className="field-label">Network</label>
                <select id="card-type" value={cardType} onChange={(e) => setCardType(e.target.value)} className="input">
                  <option>Visa</option>
                  <option>Mastercard</option>
                </select>
              </div>
              <div>
                <label htmlFor="expiry" className="field-label">Expiry</label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  aria-describedby="expiry-hint"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  required
                  className="input num"
                />
                <p id="expiry-hint" className="sr-only">Month and year, for example 08/28</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Adding…' : 'Add card'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default Cards;
