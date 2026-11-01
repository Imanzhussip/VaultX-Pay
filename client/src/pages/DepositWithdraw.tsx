import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

type Mode = 'deposit' | 'withdraw';

function DepositWithdraw() {
  const [mode, setMode] = useState<Mode>('deposit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // the route is /account/deposit or /account/withdraw depending on the toggle
      const response = await api.post(`/account/${mode}`, {
        amount: Number(amount),
      });
      setSuccess(response.data.message);
      setAmount('');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setError('');
    setSuccess('');
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <div className="flex mb-6 border rounded overflow-hidden">
            <button
              type="button"
              onClick={() => switchMode('deposit')}
              className={`flex-1 py-2 text-sm font-medium ${
                mode === 'deposit' ? 'bg-black text-white' : 'bg-white text-gray-600'
              }`}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => switchMode('withdraw')}
              className={`flex-1 py-2 text-sm font-medium ${
                mode === 'withdraw' ? 'bg-black text-white' : 'bg-white text-gray-600'
              }`}
            >
              Withdraw
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">
                {success}
              </div>
            )}

            <label className="block mb-1 text-sm font-medium">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : mode === 'deposit' ? 'Add Money' : 'Withdraw Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DepositWithdraw;
