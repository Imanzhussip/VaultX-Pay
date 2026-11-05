import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../Icon';
import { Wordmark } from '../Mark';

const links = [
  { href: '#send', label: 'Send money' },
  { href: '#cards', label: 'Cards' },
  { href: '#statement', label: 'Statement' },
  { href: '#security', label: 'Security' },
  { href: '#help', label: 'Help' },
];

function Actions({ onNavigate }: { onNavigate?: () => void }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return (
      <Link to="/dashboard" onClick={onNavigate} className="btn btn-primary h-11 rounded-full px-5">
        Go to your account
      </Link>
    );
  }
  return (
    <>
      <Link to="/login" onClick={onNavigate} className="btn h-11 rounded-full px-4 text-ink hover:bg-sky">
        Log in
      </Link>
      <Link to="/register" onClick={onNavigate} className="btn btn-primary h-11 rounded-full px-5">
        Open an account
      </Link>
    </>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3.5 py-2 text-ink transition-colors duration-150 hover:bg-sky hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-1 text-[15px] lg:flex">
          <Actions />
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn h-10 rounded-full px-4 text-[15px] text-brand hover:bg-sky">My account</Link>
          ) : (
            <Link to="/login" className="btn h-10 rounded-full px-4 text-[15px] text-brand hover:bg-sky">Log in</Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full transition-colors duration-150 hover:bg-sky"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-white px-5 pb-8 lg:hidden">
          <div className="flex h-[72px] items-center justify-between">
            <Wordmark />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-11 place-items-center rounded-full hover:bg-sky">
              <Icon name="close" size={20} />
            </button>
          </div>
          <nav aria-label="Main" className="mt-4">
            <ul className="font-display text-[28px] font-semibold leading-[44px]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-1 hover:text-brand">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-2 text-[16px] [&>a]:w-full">
            <Actions onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
