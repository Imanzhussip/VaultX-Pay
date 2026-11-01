import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Transaction {
  id: number;
  amount: string;
  type: string;
  description: string;
  created_at: string;
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data.transactions);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            'Could not load your transactions.'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">Transaction History</h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && !error && transactions.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No transactions yet. Make a deposit to get started.
          </div>
        )}

        {transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md divide-y">
            {transactions.map((t) => {
              const value = Number(t.amount);
              const isPositive = value >= 0;
              return (
                <div key={t.id} className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : '-'}${Math.abs(value).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;