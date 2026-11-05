import { useEffect, useRef } from 'react';
import '../lib/charts.js';
import { formatMoney } from '../lib/format';

export type ChartMode = 'step' | 'line';

function BalanceChart({ labels, values, mode }: { labels: string[]; values: number[]; mode: ChartMode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    window.Charts.line(ref.current, {
      labels,
      series: [{ name: 'Balance', values, colour: '#2341e0' }],
      step: mode === 'step',
      height: 216,
      format: formatMoney,
      tickFormat: (v: number) => 'HK$' + new Intl.NumberFormat('en-HK').format(v),
    });
  }, [labels, values, mode]);

  return <div ref={ref} className="chart" />;
}

export default BalanceChart;
