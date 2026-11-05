import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import ErrorNote from '../components/ErrorNote';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/errors';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subline="Your balance, transfers and cards in one place."
      footer={
        <>
          New to VaultX Pay? <Link to="/register" className="link text-ink">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4"><ErrorNote message={error} /></div>}
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
        <label htmlFor="password" className="field-label mt-4">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
