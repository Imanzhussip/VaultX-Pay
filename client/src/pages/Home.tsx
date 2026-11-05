import { Link } from 'react-router-dom';
import CardFace from '../components/CardFace';
import Icon, { type IconName } from '../components/Icon';
import PhoneMock from '../components/home/PhoneMock';
import SiteFooter from '../components/home/SiteFooter';
import SiteHeader from '../components/home/SiteHeader';
import DriftPhoto from '../components/home/DriftPhoto';
import SplitBill from '../components/home/SplitBill';
import StatementSample from '../components/home/StatementSample';
import TransferSteps from '../components/home/TransferSteps';
import { useAuth } from '../context/AuthContext';

const quickLinks: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: '#split', icon: 'split', title: 'Split a bill', text: 'Work out who owes what in seconds.' },
  { href: '#send', icon: 'mail', title: 'Send money', text: 'Pay anyone on VaultX with their email.' },
  { href: '#cards', icon: 'cards', title: 'Top up from a card', text: 'Add money from Visa or Mastercard.' },
  { href: '#statement', icon: 'ledger', title: 'Read your statement', text: 'Every movement, with your balance after it.' },
];

const stories = [
  {
    src: '/images/dim-sum-breakfast.jpg',
    alt: 'Bamboo steamers of dim sum on a restaurant table',
    title: 'Dim sum for six',
    text: 'One person pays the bill. Five people pay them back before the tea goes cold.',
  },
  {
    src: '/images/on-the-star-ferry-hong-kong-9066236142.jpg',
    alt: 'The deck of a Star Ferry crossing Victoria Harbour towards Tsim Sha Tsui',
    title: 'A day out on the harbour',
    text: 'Ferry, lunch and snacks, split between friends by email.',
  },
  {
    src: '/images/mong-kok-road-and-tung-choi-street.jpg',
    alt: 'Crowds crossing Mong Kok Road at Tung Choi Street under a footbridge',
    title: 'Weekend shopping in Mong Kok',
    text: 'Keep track of who paid for what, line by line.',
  },
];

const safeguards: { icon: IconName; title: string; text: string }[] = [
  { icon: 'lock', title: 'No double spending', text: 'Your balance is locked while a transfer runs, so two payments can never spend the same money.' },
  { icon: 'key', title: 'Passwords never stored', text: 'We keep a one-way bcrypt hash of your password, never the password itself.' },
  { icon: 'cards', title: 'Only the last four digits', text: 'Your card number is checked when you add it, then only its last four digits are kept.' },
  { icon: 'clock', title: 'Sessions that end', text: 'You are signed out 15 minutes after logging in, so an unlocked phone does not stay open.' },
];

const questions = [
  { q: 'Who can I send money to?', a: 'Anyone with a VaultX Pay account. Enter the email address they signed up with, and the money arrives straight away.' },
  { q: 'How do I add money?', a: 'Link a Visa or Mastercard in Cards, then go to Add or withdraw and enter an amount. You can withdraw back to the same card at any time.' },
  { q: 'What happens if a transfer fails halfway?', a: 'Nothing moves. Your balance and theirs are updated together in one step, so either both change or neither does.' },
  { q: 'Can I send more than I have?', a: 'No. VaultX checks your balance before every transfer and withdrawal, and an account can never go below HK$0.00.' },
  { q: 'How is my card stored?', a: 'We check the card number when you add it, then keep only the last four digits, the network and the expiry date.' },
  { q: 'Can I cancel a transfer?', a: 'Transfers arrive at once and cannot be reversed, so check the email address before you send.' },
];

function Home() {
  const { isLoggedIn } = useAuth();
  const primary = isLoggedIn ? { to: '/dashboard', label: 'Go to your account' } : { to: '/register', label: 'Open an account' };

  return (
    <div className="home text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        <section className="on-dark bg-brand text-white" aria-labelledby="hero-title">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
            <div className="lg:col-span-6">
              <h1 id="hero-title" className="font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[60px] lg:text-[72px]">
                <span className="hero-line" style={{ '--i': 0 } as React.CSSProperties}><span>Pay your friends</span></span>{' '}
                <span className="hero-line" style={{ '--i': 1 } as React.CSSProperties}><span>back in seconds.</span></span>
              </h1>
              <p className="hero-fade mt-6 max-w-[520px] text-[19px] leading-[30px] text-[#dfe5ff]" style={{ '--d': '260ms' } as React.CSSProperties}>
                One HK$ account for everyday life in Hong Kong. Top up from your card, send money with just an email, and see every dollar you spend.
              </p>
              <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ '--d': '360ms' } as React.CSSProperties}>
                <Link to={primary.to} className="btn btn-lg btn-on-brand">{primary.label}</Link>
                {!isLoggedIn && <Link to="/login" className="btn btn-lg btn-outline-on-brand">Log in</Link>}
              </div>
            </div>

            <div className="relative lg:col-span-6">
              <DriftPhoto
                className="hero-photo rounded-[20px] lg:ml-16"
                src="/images/hong-kong-tramways-double-decker-tram-ank.jpg"
                alt="A double-decker tram on a busy Hong Kong street in the afternoon"
                width={1920}
                height={1280}
                fetchPriority="high"
                imgClassName="aspect-[4/3] w-full object-cover object-[62%_100%] lg:aspect-[4/4]"
              />
              <div
                className="hero-rise relative z-10 mx-auto -mt-24 w-[calc(100%-24px)] max-w-[420px] lg:absolute lg:-bottom-10 lg:left-0 lg:mt-0 lg:w-[380px]"
                style={{ '--d': '300ms' } as React.CSSProperties}
              >
                <SplitBill />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="quick-title" className="border-b border-line">
          <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:px-8 lg:pt-24">
            <h2 id="quick-title" className="font-display text-[26px] font-bold leading-8 tracking-[-0.01em]">What would you like to do?</h2>
            <ul className="mt-6 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((item) => (
                <li key={item.href} className="border-b border-line sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <a href={item.href} className="group flex h-full items-start gap-4 px-1 py-6 transition-colors duration-150 hover:bg-sky sm:px-5">
                    <span className="mt-0.5 text-brand"><Icon name={item.icon} size={22} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[18px] font-semibold leading-7">
                        {item.title}
                        <span className="text-brand transition-transform duration-200 group-hover:translate-x-1"><Icon name="arrow" size={16} /></span>
                      </span>
                      <span className="mt-1 block text-[15px] leading-6 text-muted">{item.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="send" aria-labelledby="send-title" className="py-20 lg:py-32">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
            <div className="order-last lg:order-first">
              <PhoneMock />
            </div>
            <div>
              <h2 id="send-title" className="font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
                Send money with just an email.
              </h2>
              <p className="mt-5 max-w-[560px] text-muted">
                No account numbers to copy and no codes to scan. If your friend has VaultX Pay, their email is all you need.
              </p>
              <ol className="mt-10 space-y-8">
                {[
                  ['Type their email', 'People you have paid before are one tap away.'],
                  ['Enter the amount', 'You see your balance after the transfer before you send it.'],
                  ['Send', 'The money lands in their account straight away.'],
                ].map(([title, text], i) => (
                  <li key={title} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
                    <span className="num grid size-10 place-items-center rounded-full bg-sky font-display text-[17px] font-bold text-brand" aria-hidden="true">{i + 1}</span>
                    <span>
                      <span className="block text-[19px] font-semibold leading-7">{title}</span>
                      <span className="mt-1 block text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link to={isLoggedIn ? '/transfer' : '/register'} className="btn btn-primary btn-lg mt-10">
                {isLoggedIn ? 'Send money now' : 'Open an account to send'}
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="life-title" className="pb-20 lg:pb-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="life-title" className="font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
                Made for life in Hong Kong.
              </h2>
              <p className="max-w-[420px] text-muted">From dim sum to the Star Ferry, VaultX keeps shared costs simple.</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
              {stories.map((s, i) => (
                <figure
                  key={s.src}
                  className={`story photo-zoom relative overflow-hidden rounded-[20px] bg-ink ${
                    i === 0 ? 'aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[560px]' : 'aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[272px]'
                  }`}
                >
                  <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgb(11_16_32/0.85),rgb(11_16_32/0))] px-6 pb-6 pt-24 text-white">
                    <span className="block font-display text-[24px] font-bold leading-8 tracking-[-0.01em]">{s.title}</span>
                    <span className="mt-1 block max-w-[440px] text-[16px] leading-6 text-white/90">{s.text}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="cards" aria-labelledby="cards-title" className="bg-sky py-20 lg:py-32">
          <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <h2 id="cards-title" className="font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
                Top up from your card. Withdraw any time.
              </h2>
              <p className="mt-5 max-w-[560px] text-muted">Link the card you already use. Add money when you need it, and send it back when you don't.</p>
              <ul className="mt-8 space-y-4">
                {[
                  'Link a Visa or Mastercard in under a minute.',
                  'Your card number is checked before it is saved, and only the last four digits are kept.',
                  'Pause your cards with one switch, and turn them back on when you are ready.',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-1 grid size-6 flex-none place-items-center rounded-full bg-brand text-white"><Icon name="check" size={14} /></span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <Link to={isLoggedIn ? '/cards' : '/register'} className="btn btn-primary btn-lg mt-10">
                {isLoggedIn ? 'Manage your cards' : 'Open an account'}
              </Link>
            </div>
            <div className="relative mx-auto h-[300px] w-full max-w-[460px] sm:h-[340px]" aria-label="Two linked cards, one active and one paused" role="img">
              <div className="card-fan-back absolute right-0 top-0 w-[74%] rotate-[6deg]">
                <CardFace fluid card={{ id: 2, last_four: '5100', card_type: 'Mastercard', expiry_date: '03/28', is_active: false }} />
              </div>
              <div className="card-fan-front absolute bottom-0 left-0 w-[78%] -rotate-[4deg]">
                <CardFace
                  fluid
                  className="shadow-[0_28px_48px_-20px_rgb(18_28_107/0.6)]"
                  card={{ id: 1, last_four: '4242', card_type: 'Visa', expiry_date: '08/29', is_active: true }}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="statement" aria-labelledby="statement-title" className="py-20 lg:py-32">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="statement-title" className="font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
                A statement that always adds up.
              </h2>
              <p className="mt-5 text-muted">
                Every movement shows who it was with and your balance right after it, so you can check your account line by line.
              </p>
            </div>
            <StatementSample />
          </div>
        </section>

        <section id="security" aria-labelledby="security-title" className="on-dark bg-brand-deep py-20 text-white lg:py-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 id="security-title" className="font-display text-[40px] font-bold leading-[1.04] tracking-[-0.025em] sm:text-[56px] lg:col-span-7">
                Both balances change, or neither does.
              </h2>
              <p className="text-[18px] leading-[30px] text-[#d6dcff] lg:col-span-5 lg:pt-3">
                When you send money, VaultX locks both accounts, moves the money and saves both changes together. If anything goes wrong on the way, nothing changes at all.
              </p>
            </div>

            <TransferSteps />

            <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {safeguards.map((s) => (
                <li key={s.title}>
                  <span className="text-[#aebcff]"><Icon name={s.icon} size={26} /></span>
                  <h3 className="mt-4 text-[19px] font-semibold leading-7">{s.title}</h3>
                  <p className="mt-2 text-[16px] leading-[26px] text-[#d6dcff]">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="help" aria-labelledby="help-title" className="py-20 lg:py-32">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="help-title" className="font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">Questions, answered.</h2>
              <p className="mt-5 text-muted">The things people ask before they open an account.</p>
            </div>
            <div className="lg:col-span-8">
              {questions.map((item) => (
                <details key={item.q} className="faq group border-b border-line first:border-t">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[19px] font-semibold leading-7 transition-colors duration-150 hover:text-brand">
                    {item.q}
                    <span className="faq-chevron flex-none text-brand transition-transform duration-200"><Icon name="chevron" size={20} /></span>
                  </summary>
                  <p className="-mt-2 max-w-[640px] pb-6 text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="close-title" className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="on-dark relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-brand-deep">
            <DriftPhoto
              className="close-photo relative aspect-[16/10] md:absolute md:inset-0 md:aspect-auto"
              src="/images/hong-kong-harbour-night-2019-06-11.jpg"
              alt="Victoria Harbour and the Hong Kong skyline lit up at night"
              loading="lazy"
              decoding="async"
              imgClassName="size-full object-cover object-[50%_40%]"
            />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(18_28_107/0.94)_0%,rgb(18_28_107/0.82)_42%,rgb(18_28_107/0.1)_85%)] md:block" />
            <div className="relative px-6 pb-14 pt-10 text-white sm:px-14 md:py-20 lg:py-28">
              <h2 id="close-title" className="max-w-[720px] font-display text-[40px] font-bold leading-[1.04] tracking-[-0.025em] sm:text-[60px]">
                Open your VaultX account tonight.
              </h2>
              <p className="mt-5 max-w-[520px] text-[18px] leading-[30px] text-[#dfe5ff]">All it takes is your name, an email address and a password.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={primary.to} className="btn btn-lg btn-on-brand">{primary.label}</Link>
                {!isLoggedIn && <Link to="/login" className="btn btn-lg btn-outline-on-brand">Log in</Link>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default Home;
