# VaultX Pay

A simple online payments app. You can hold a balance in Hong Kong dollars, add money from a card, send money to friends by email, and see every movement on your account.

**Live demo:** https://vaultx-pay.vercel.app/

> This is a portfolio project, not a real bank. No real money moves, so please don't enter real card details or passwords you use elsewhere.

## What you can do

- **Create an account** and log in
- **Split a bill** with the calculator on the home page
- **Send money** to another user with just their email
- **Add or withdraw money** using a linked card
- **See your activity**, with your balance after every movement
- **Explore your balance** on a chart, and drag a window to choose any dates

## How money stays safe

The hardest part of a payments app is making sure money never gets lost or created by accident. Here is how VaultX Pay handles it:

- **All or nothing:** a transfer takes money from one account and adds it to another. Both steps run in one database transaction, so either both happen or neither does.
- **No double spending:** both accounts are locked while a transfer runs, so two payments at the same moment can't spend the same money.
- **Exact amounts:** amounts must be between HK$0.01 and HK$999,999.99, with at most 2 decimal places. Negative amounts are rejected.

## How your data stays safe

- **Passwords** are stored only as bcrypt hashes, never as plain text.
- **Card numbers** are checked, then only the last 4 digits are kept.
- **Logins** use tokens that expire after 15 minutes.
- **Repeated failed logins** are blocked for a while, which stops password guessing.
- **Database queries** use parameters, which prevents SQL injection.
- **Your account** is always identified from your login token, so nobody can act on someone else's account by changing a request.

## Built with

| Part | Tools |
|---|---|
| Website | React, TypeScript, Tailwind CSS, Vite |
| Server | Node.js, Express |
| Database | PostgreSQL |

## Run it on your computer

You need [Node.js](https://nodejs.org) and [PostgreSQL](https://www.postgresql.org) installed.

**1. Download the project**

```bash
git clone https://github.com/Imanzhussip/VaultX-Pay.git
cd VaultX-Pay
```

**2. Create the database**

```bash
createdb vaultx
psql -d vaultx -f server/schema.sql
```

**3. Start the server**

Create a file called `server/.env` containing:

```
SECRET_KEY=any-long-random-text
DB_PASSWORD=your-postgres-password
PORT=3000
CLIENT_URL=http://localhost:5173
```

Then run:

```bash
cd server
npm install
node db.js
```

**4. Start the website**

In a second terminal, from the `VaultX-Pay` folder:

```bash
cd client
npm install
npm run dev
```

Now open http://localhost:5173 and create an account.

## Photo credits

The photos on the home page are openly licensed and from Wikimedia Commons. Their creators and licences are listed in the website's footer.

## License

[MIT](LICENSE)
