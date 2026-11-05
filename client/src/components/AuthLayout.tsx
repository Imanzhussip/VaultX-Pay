import type { ReactNode } from 'react';
import Mark, { Wordmark } from './Mark';

function AuthLayout({ title, subline, children, footer }: { title: string; subline: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-8">
        <Wordmark />
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[24px] font-bold leading-8 tracking-[-0.015em]">{title}</h1>
          <p className="mt-1 text-muted">{subline}</p>
          <div className="panel mt-6 p-6">{children}</div>
          <p className="mt-4 text-muted">{footer}</p>
        </main>
      </div>
      <aside className="sticky top-0 hidden h-screen flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex" aria-label="How VaultX moves money">
        <div className="flex items-center gap-4">
          <Mark size={40} inverted />
          <p className="max-w-[360px] text-white/80">Every transfer runs as one database transaction.</p>
        </div>
        <pre className="my-10 max-w-[560px] overflow-x-auto rounded-lg bg-white/[0.06] p-6 font-mono text-[13px] leading-6 text-white/90">
          <code>
            <span className="text-white/60">BEGIN;</span>
            {'\n'}SELECT id, balance FROM accounts
            {'\n'}  WHERE user_id = ANY($1) ORDER BY id FOR UPDATE;
            {'\n'}UPDATE accounts SET balance = balance - $1 WHERE id = $2;
            {'\n'}UPDATE accounts SET balance = balance + $1 WHERE id = $3;
            {'\n'}<span className="text-white/60">COMMIT;</span>
          </code>
        </pre>
        <div>
          <p className="max-w-[560px] text-[32px] font-medium leading-[40px] tracking-[-0.02em]">
            Both balances change, or neither does.
          </p>
          <dl className="mt-10 grid max-w-[560px] grid-cols-3 gap-6 border-t border-white/20 pt-6 text-[13px] leading-5">
            <div>
              <dt className="text-white/70">Transfers</dt>
              <dd className="mt-1">Locked, then committed together</dd>
            </div>
            <div>
              <dt className="text-white/70">Cards</dt>
              <dd className="mt-1">Only the last four digits kept</dd>
            </div>
            <div>
              <dt className="text-white/70">Sessions</dt>
              <dd className="mt-1">Signed tokens that expire in 15 minutes</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

export default AuthLayout;
