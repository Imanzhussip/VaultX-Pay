import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import ErrorNote from '../components/ErrorNote';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/errors';

function Register() {
  const [name, setName] = useState('');
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
      await api.post('/register', { name, email, password });
      const loginResponse = await api.post('/login', { email, password });
      login(loginResponse.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subline="Open a VaultX balance, link a card and send money by email."
      footer={
        <>
          Already have an account? <Link to="/login" className="link text-ink">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4"><ErrorNote message={error} /></div>}
        <label htmlFor="name" className="field-label">Full name</label>
        <input id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
        <label htmlFor="email" className="field-label mt-4">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
        <label htmlFor="password" className="field-label mt-4">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          aria-describedby="password-rule"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <p id="password-rule" className="mt-2 text-[12px] leading-4 text-muted">At least 8 characters.</p>
        <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
