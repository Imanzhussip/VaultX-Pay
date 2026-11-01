import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Transfer() {
  const [receiverEmail, setReceiverEmail] = useState('');
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
      const response = await api.post('/account/transfer', {
        receiverEmail,
        amount: Number(amount),
      });
      setSuccess(response.data.message);
      setReceiverEmail('');
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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">
          &larr; Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h1 className="text-xl font-bold mb-1">Send Money</h1>
          <p className="text-gray-500 text-sm mb-6">
            Enter the email of the person you want to pay.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{success}</div>
          )}

          <label className="block mb-1 text-sm font-medium">Recipient email</label>
          <input
            type="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

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
            {loading ? 'Sending...' : 'Send Money'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transfer;