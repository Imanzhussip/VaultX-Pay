import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Card {
  id: number;
  last_four: string;
  card_type: string;
  expiry_date: string;
  is_active: boolean;
}

function getMessage(err: any) {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Something went wrong. Please try again.'
  );
}

function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('Visa');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await api.get('/cards');
        setCards(response.data.cards);
      } catch (err: any) {
        setError(getMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [refresh]);

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{12,19}$/.test(digits)) {
      setError('Please enter a valid card number.');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError('Please enter the expiry date as MM/YY, for example 08/28.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/cards', {
        card_number: digits,
        card_type: cardType,
        expiry_date: expiry,
      });
      setCardNumber('');
      setExpiry('');
      setRefresh((r) => r + 1);
    } catch (err: any) {
      setError(getMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle() {
    setError('');
    const anyActive = cards.some((c) => c.is_active);
    try {
      await api.post('/account/active', { is_active: !anyActive });
      setRefresh((r) => r + 1);
    } catch (err: any) {
      setError(getMessage(err));
    }
  }

  const anyActive = cards.some((c) => c.is_active);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">Cards</h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && cards.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 mb-6">
            You haven't added a card yet.
          </div>
        )}

        {cards.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-md divide-y mb-3">
              {cards.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">
                      {c.card_type} •••• {c.last_four}
                    </p>
                    <p className="text-xs text-gray-500">Expires {c.expiry_date}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleToggle}
              className="text-sm text-gray-700 underline hover:text-black"
            >
              {anyActive ? 'Deactivate my cards' : 'Activate my cards'}
            </button>
          </div>
        )}

        <form onSubmit={handleAddCard} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Add a card</h2>

          <label className="block mb-1 text-sm font-medium">Card number</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={23}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Card type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Visa</option>
                <option>Mastercard</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Expiry (MM/YY)</label>
              <input
                type="text"
                maxLength={5}
                placeholder="08/28"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {saving ? 'Adding...' : 'Add Card'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cards;