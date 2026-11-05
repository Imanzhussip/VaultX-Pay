const paths = {
  account: 'M3 10.5 12 4l9 6.5M5 9.5V20h14V9.5M9.5 20v-5.5h5V20',
  activity: 'M4 6h16M4 12h16M4 18h10',
  send: 'M5 12h13M13 6l6 6-6 6',
  funds: 'M7 4v16M3.5 7.5 7 4l3.5 3.5M17 20V4M13.5 16.5 17 20l3.5-3.5',
  cards: 'M3 6.5h18v11H3zM3 10h18M6.5 14.5h4',
  logout: 'M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5 10 17 19 7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  minus: 'M5 12h14',
  pause: 'M9 6v12M15 6v12',
  play: 'M8 5.5v13l10.5-6.5z',
  plus: 'M12 5v14M5 12h14',
  chevron: 'M6 9l6 6 6-6',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2',
  key: 'M14.5 9.5a4 4 0 1 1-1.2-2.9M14.5 9.5H21M18 9.5V13M21 9.5V12',
  clock: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17M12 7.5V12l3 2',
  split: 'M12 4v6M12 10 6 18M12 10l6 8M4 18h4M16 18h4',
  mail: 'M3.5 6.5h17v11h-17zM4 7l8 6 8-6',
  ledger: 'M6 3.5h12v17H6zM9 8h6M9 12h6M9 16h3',
};

export type IconName = keyof typeof paths;

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default Icon;
