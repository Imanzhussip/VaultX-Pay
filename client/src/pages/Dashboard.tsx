import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Account {
  id: number;
  user_id: number;
  balance: string;
  created_at: string;
}

const actions = [
  { to: '/funds', title: 'Deposit / Withdraw', text: 'Add or take out money' },
  { to: '/transfer', title: 'Send Money', text: 'Pay someone by email' },
  { to: '/transactions', title: 'History', text: 'See all your activity' },
  { to: '/cards', title: 'Cards', text: 'Manage your linked cards' },
];

function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchAccount() {
      try {
        const response = await api.get('/account');
        setAccount(response.data.account);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            'Could not load your account.'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">VaultX Pay</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-black"
          >
            Log out
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
        )}

        {account && (
          <div className="bg-black text-white p-6 rounded-xl shadow-md mb-6">
            <p className="text-sm text-gray-300">Current Balance</p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">
              $
              {Number(account.balance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-gray-500 mt-1">{a.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;