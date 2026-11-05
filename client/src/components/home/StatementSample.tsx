import type { CSSProperties } from 'react';
import { useInView } from '../../hooks/useInView';

const rows = [
  { date: '1 Nov', title: 'From Priya Nair', detail: 'Transfer', amount: '+HK$12.75', balance: 'HK$1,320.25', incoming: true },
  { date: '31 Oct', title: 'To Wong Tsz Hin', detail: 'Transfer', amount: '−HK$250.00', balance: 'HK$1,307.50', incoming: false },
  { date: '27 Oct', title: 'Withdrawn to card', detail: 'Visa •••• 4242', amount: '−HK$60.00', balance: 'HK$1,557.50', incoming: false },
  { date: '24 Oct', title: 'From Wong Tsz Hin', detail: 'Transfer', amount: '+HK$80.00', balance: 'HK$1,617.50', incoming: true },
  { date: '20 Oct', title: 'Added from card', detail: 'Visa •••• 4242', amount: '+HK$350.00', balance: 'HK$1,537.50', incoming: true },
];

function StatementSample() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.3 });
  return (
    <figure className="lg:col-span-7">
      <div ref={ref} className={`stmt overflow-hidden rounded-[20px] border border-line bg-white ${inView ? 'is-in' : ''}`}>
        <div className="flex items-baseline justify-between px-5 pb-3 pt-5 sm:px-6">
          <span className="font-display text-[20px] font-bold">Activity</span>
          <span className="text-[14px] text-muted">Leung Ka Yan</span>
        </div>
        <table className="w-full text-[15px] leading-6">
          <thead>
            <tr className="text-left text-[13px] text-muted">
              <th scope="col" className="hidden h-9 pl-6 font-normal sm:table-cell">Date</th>
              <th scope="col" className="h-9 pl-5 font-normal sm:pl-0">Movement</th>
              <th scope="col" className="pr-5 text-right font-normal sm:pr-0">Amount</th>
              <th scope="col" className="hidden pl-4 pr-6 text-right font-normal sm:table-cell">Balance after</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.date + row.title} className="stmt-row border-t border-rule" style={{ '--i': i } as CSSProperties}>
                <td className="num hidden h-[60px] pl-6 text-muted sm:table-cell">{row.date}</td>
                <td className="h-[64px] pl-5 pr-3 sm:h-[60px] sm:pl-0">
                  <span className="block font-medium">{row.title}</span>
                  <span className="block whitespace-nowrap text-[13px] leading-5 text-muted">
                    <span className="sm:hidden">{row.date} · </span>
                    {row.detail}
                  </span>
                </td>
                <td className="whitespace-nowrap pr-5 text-right sm:pr-0">
                  <span className={`num block font-medium ${row.incoming ? 'text-positive' : ''}`}>{row.amount}</span>
                  <span className="num block text-[13px] leading-5 text-muted sm:hidden">{row.balance}</span>
                </td>
                <td className="num hidden whitespace-nowrap pl-4 pr-6 text-right text-muted sm:table-cell">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-[13px] leading-5 text-muted">Sample statement</figcaption>
    </figure>
  );
}

export default StatementSample;
