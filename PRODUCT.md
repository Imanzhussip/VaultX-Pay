# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Students and young people in Hong Kong who share costs with friends and flatmates (rent, meals, trips, MTR top-ups) and want one account to hold money, top it up from a card and pay each other by email. Secondary audience: internship employers reviewing the project, who will open the site, register and try a transfer.

## Product Purpose
VaultX Pay is a personal payments account: one HK$ balance, money added or withdrawn through a linked card, instant transfers to other VaultX users by email, and a ledger of every movement with the balance after it. Success means a visitor understands what it does within one screen, opens an account, and completes a transfer without help.

## Positioning
Every transfer runs as one database transaction: both accounts are locked, both balances change together, or neither does. Each movement in the ledger shows the balance after it, so the account always reconciles.

## Operating Context
- Public home page at `/`, then Register / Log in, then the signed-in app (Account, Activity, Send money, Add or withdraw, Cards).
- Transfers are addressed by the recipient's email; there are no account numbers in the UI.
- Sessions are JWTs that expire after 15 minutes.

## Capabilities and Constraints
- Real features: register / log in, one account per user, add money and withdraw via an active linked card, transfers by email, transaction history with running balance and counterparty names, add a card (Luhn-checked, only the last four digits stored), pause/resume cards.
- Currency: Hong Kong dollars, shown as HK$1,320.25.
- Stack: React 19 + Vite + Tailwind v4 (client), Node/Express + PostgreSQL (server).
- Not built: interest, loans, savings goals, FX, mobile apps, business accounts, customer support channels.

## Brand Commitments
- Name: VaultX Pay. Mark: a vault-door dial (client/src/components/Mark.tsx).
- The owner wants the public site to present VaultX as a real retail bank would (no "demo" label). It is a portfolio project shown to internship employers.

## Evidence on Hand
- No customers, testimonials, press, ratings, user counts, licences or rates exist. Do not fabricate any of them, including licence or registration numbers.
- Real technical facts that may be stated: atomic transfers with row locks, bcrypt-hashed passwords, parameterised SQL, card numbers checked and reduced to last four digits, 15-minute sessions.

## Product Principles
- Say what the product actually does; proof comes from how it works, never from invented numbers.
- Money is exact: amounts reconcile, every movement shows its balance after.
- Fewest steps to the common job: paying a friend back.
- Speak to students plainly, without banking jargon.
