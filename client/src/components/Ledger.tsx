import { describeTransaction, formatDay, formatMoney, formatSigned, formatTime } from '../lib/format';
import type { Transaction } from '../types';

function Amount({ value }: { value: number }) {
  return <span className={`num font-medium ${value > 0 ? 'text-positive' : 'text-ink'}`}>{formatSigned(value)}</span>;
}

export function LedgerSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex h-14 items-center justify-between border-t border-rule px-5 first:border-t-0">
          <span className="skeleton h-3.5 w-40" />
          <span className="skeleton h-3.5 w-20" />
        </li>
      ))}
    </ul>
  );
}

function Ledger({ transactions }: { transactions: Transaction[] }) {
  return (
    <>
      <table className="hidden w-full sm:table">
        <thead>
          <tr className="text-left text-[12px] text-muted">
            <th scope="col" className="h-9 w-[96px] pl-5 font-normal">Date</th>
            <th scope="col" className="font-normal">Movement</th>
            <th scope="col" className="text-right font-normal">Amount</th>
            <th scope="col" className="w-[132px] pr-5 text-right font-normal">Balance after</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const { title, detail } = describeTransaction(t);
            return (
              <tr key={t.id} className="border-t border-rule transition-colors duration-150 hover:bg-[#fafbfc]">
                <td className="h-14 pl-5 align-middle">
                  <span className="num block">{formatDay(t.created_at)}</span>
                  <span className="num block text-[12px] leading-4 text-muted">{formatTime(t.created_at)}</span>
                </td>
                <td className="max-w-0 pr-4">
                  <span className="block truncate font-medium">{title}</span>
                  <span className="block truncate text-[12px] leading-4 text-muted">{detail}</span>
                </td>
                <td className="text-right">
                  <Amount value={Number(t.amount)} />
                </td>
                <td className="num pr-5 text-right text-muted">{formatMoney(Number(t.balance_after))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="sm:hidden">
        {transactions.map((t) => {
          const { title } = describeTransaction(t);
          return (
            <li key={t.id} className="flex items-center justify-between gap-4 border-t border-rule px-4 py-3 first:border-t-0">
              <div className="min-w-0">
                <p className="truncate font-medium">{title}</p>
                <p className="num text-[12px] leading-4 text-muted">
                  {formatDay(t.created_at)}, {formatTime(t.created_at)}
                </p>
              </div>
              <div className="flex-none text-right">
                <Amount value={Number(t.amount)} />
                <p className="num text-[12px] leading-4 text-muted">{formatMoney(Number(t.balance_after))}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Ledger;
