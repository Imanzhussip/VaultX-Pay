import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import type { Account } from '../types';
import Icon, { type IconName } from './Icon';
import { Wordmark } from './Mark';

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: '/dashboard', label: 'Account', icon: 'account' },
  { to: '/transactions', label: 'Activity', icon: 'activity' },
  { to: '/transfer', label: 'Send money', icon: 'send' },
  { to: '/funds', label: 'Add or withdraw', icon: 'funds' },
  { to: '/cards', label: 'Cards', icon: 'cards' },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nav.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex h-9 items-center gap-2.5 rounded-md px-3 transition-colors duration-150 lg:h-8 ${
                isActive ? 'bg-active text-ink' : 'text-muted hover:bg-raised hover:text-ink'
              }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function UserRow({ account, onLogout }: { account: Account | null; onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{account?.name ?? <span className="skeleton h-3.5 w-24 align-middle" />}</p>
        <p className="truncate text-[12px] leading-4 text-muted">{account?.email ?? ' '}</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="grid size-8 flex-none place-items-center rounded-md text-muted transition-colors duration-150 hover:bg-raised hover:text-ink"
      >
        <Icon name="logout" />
      </button>
    </div>
  );
}

function AppShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = useApi<{ account: Account }>('/account');
  const account = data?.account ?? null;
  const current = nav.find((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col py-6 pl-3 lg:flex">
        <div className="px-3">
          <Wordmark />
          <p className="mt-1 pl-[32px] text-[12px] leading-4 text-muted">Personal account</p>
        </div>
        <nav aria-label="Main" className="mt-8">
          <NavItems />
        </nav>
        <div className="mt-auto">
          <UserRow account={account} onLogout={handleLogout} />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-12 items-center justify-between bg-ground pl-5 pr-2 lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="grid size-11 place-items-center rounded-md transition-colors duration-150 hover:bg-raised"
        >
          <Icon name="menu" size={18} />
        </button>
      </header>

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-30 flex flex-col bg-ground pb-6 pl-5 pr-2 lg:hidden">
          <div className="flex h-12 items-center justify-between">
            <Wordmark />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-md hover:bg-raised"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <nav aria-label="Main" className="mt-4 text-[16px]">
            <NavItems onNavigate={() => setMenuOpen(false)} />
          </nav>
          <div className="mt-auto">
            <UserRow account={account} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <main className="min-w-0 px-5 pb-16 pt-4 sm:px-6 lg:px-8 lg:pt-8" aria-label={current?.label}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default AppShell;
