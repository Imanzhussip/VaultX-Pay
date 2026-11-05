import { Link } from 'react-router-dom';
import { Wordmark } from '../Mark';

const credits = [
  { title: 'Hong Kong Tramways Double Decker Tram (Ank Kumar) 03', page: 'https://commons.wikimedia.org/wiki/File:Hong_Kong_Tramways_Double_Decker_Tram_(Ank_Kumar)_03.jpg', by: 'Ank Kumar', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  { title: 'Dim Sum Breakfast', page: 'https://commons.wikimedia.org/wiki/File:Dim_Sum_Breakfast.jpg', by: 'afterdog', licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en' },
  { title: 'On the Star Ferry Hong Kong', page: 'https://commons.wikimedia.org/wiki/File:On_the_Star_Ferry_Hong_Kong._(9066236142).jpg', by: 'Bernard Spragg', licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en' },
  { title: 'Mong Kok Road and Tung Choi Street', page: 'https://commons.wikimedia.org/wiki/File:Mong_Kok_Road_and_Tung_Choi_Street_(Hong_Kong).jpg', by: 'Mk2010', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0' },
  { title: 'Hong Kong Harbour Night 2019-06-11', page: 'https://commons.wikimedia.org/wiki/File:Hong_Kong_Harbour_Night_2019-06-11.jpg', by: 'Benh LIEU SONG', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
];

const columns = [
  {
    title: 'Your account',
    links: [
      { to: '/register', label: 'Open an account' },
      { to: '/login', label: 'Log in' },
      { to: '/transfer', label: 'Send money' },
      { to: '/cards', label: 'Cards' },
    ],
  },
  {
    title: 'How it works',
    links: [
      { to: '/#send', label: 'Paying by email' },
      { to: '/#cards', label: 'Card top-ups' },
      { to: '/#statement', label: 'Your statement' },
      { to: '/#security', label: 'Security' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/#help', label: 'Questions and answers' },
      { to: '/#split', label: 'Split a bill' },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark inverted size="lg" />
            <p className="mt-4 max-w-[320px] text-[15px] leading-6 text-white/75">
              One HK$ account for paying friends back, topping up from your card and keeping track of every dollar.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[14px] font-semibold text-white/60">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-6">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to.startsWith('/#') ? (
                      <a href={l.to} className="text-white/90 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-4">{l.label}</a>
                    ) : (
                      <Link to={l.to} className="text-white/90 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-4">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 border-t border-white/15 pt-6 text-[13px] leading-5 text-white/65">
          <p>© 2026 VaultX Pay. Portfolio project, not a real bank. No real money moves, so please do not enter real card details.</p>
          <p className="mt-3">
            Photos:{' '}
            {credits.map((c, i) => (
              <span key={c.page}>
                <a href={c.page} className="underline decoration-white/30 underline-offset-2 hover:text-white">“{c.title}”</a> by {c.by},{' '}
                <a href={c.licenceUrl} className="underline decoration-white/30 underline-offset-2 hover:text-white">{c.licence}</a>, via Wikimedia Commons
                {i < credits.length - 1 ? '; ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
