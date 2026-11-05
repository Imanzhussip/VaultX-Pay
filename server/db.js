require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit=require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','),
}));
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
	skipSuccessfulRequests:true,
    message: { message: "Too many failed attempts. Please try again later." },
})
const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 10,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
    message: { message: "Please try again later." },
})
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        }
        : {
            host: "localhost",
            user: "postgres",
            port: 5432,
            password: process.env.DB_PASSWORD || "1",
            database: "vaultx",
        }
);
pool.query('SELECT 1')
    .then(() => console.log("Connection is successful!"))
    .catch((err) => console.error("Database connection failed:", err.message));

function getFriendlyErrorMessage(err) {
    if (err.code === '23505') { return 'An account with this email already exists.'; }
    if (err.code === '23514') { return "You don't have enough balance for this."; }
    if (err.code === '22003') { return 'That amount is too large.'; }
    return 'Something went wrong. Please try again.';
}
function parseAmount(value) {
    if (!Number.isFinite(value) || value < 0.01 || value>999999.99 ) {
        return null;
    }
    const decimals=String(value).split('.')[1];
    if (decimals && decimals.length > 2) { return null; }
    return value;
}
function isValidCardNumber(number) {
    const digits = String(number).replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(digits)) return false;

    let sum = 0;
    let doubleIt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = Number(digits[i]);
        if (doubleIt) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        doubleIt = !doubleIt;
    }
    return sum % 10 === 0;
}

function isCardExpired(expiry) {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(expiry));
    if (!match) return true;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth < new Date();
}
app.post('/register',registerLimiter, async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (String(password).length < 8) {
        return res.status(400).json({ message: 'Your password needs at least 8 characters.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const insert_query_users = 'INSERT INTO users(name,email,password) VALUES ($1,$2,$3) RETURNING id';
    const insert_query_accounts = 'INSERT INTO accounts(user_id) VALUES ($1)';
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(insert_query_users, [name, email, hashedPassword]);
        await client.query(insert_query_accounts, [result.rows[0].id]);
        await client.query('COMMIT');
        res.status(200).json({ message: 'User registered successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    } finally {
        client.release();
    }
});

app.post('/login',loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    const select_query_users = 'SELECT * FROM users WHERE email=$1';
    try {
        const result = await pool.query(select_query_users, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "15m" });
        res.status(200).json({ message: 'Login successful.', userId: user.id, token });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
});

const authenticateToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Please log in to continue.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
};

app.use(authenticateToken);

async function getAccountForUser(userId) {
    const result = await pool.query('SELECT * FROM accounts WHERE user_id=$1', [userId]);
    return result.rows[0];
}
async function hasActiveCard(accountId) {
    const result = await pool.query(
        'SELECT 1 FROM cards WHERE account_id=$1 AND is_active=true LIMIT 1',
        [accountId]
    );
    return result.rows.length > 0;
}
app.get('/account', async (req, res) => {
    try {
        const select_query_account = "SELECT a.id, a.balance, a.created_at, u.name, u.email FROM accounts a JOIN users u ON u.id=a.user_id WHERE a.user_id=$1";
        const result = await pool.query(select_query_account, [req.user.userId]);
        const account = result.rows[0];
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        res.status(200).json({ account });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/create', async (req, res) => {
    const userId = req.user.userId;
    const insert_query_accounts = "INSERT INTO accounts(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING";
    try {
        await pool.query(insert_query_accounts, [userId]);
        res.status(200).json({ message: "Account created successfully." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/deposit', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const userId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter a valid amount between HK$0.01 and HK$999,999.99.' });
    }
    const account = await getAccountForUser(userId);
    if (!account) {
        return res.status(404).json({ message: "We couldn't find your account." });
    }
    if (!(await hasActiveCard(account.id))) {
        return res.status(400).json({ message: 'Please add an active card before depositing or withdrawing.' });
    }
    const deposit_query_accounts = "UPDATE accounts SET balance=balance+$1 WHERE id=$2";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(deposit_query_accounts, [amount, account.id]);
        await client.query(insert_query_transactions, [account.id, amount, "Deposit to account", "deposit"]);
        await client.query('COMMIT');
        res.status(200).json({ message: "Deposit successful." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    } finally {
        client.release();
    }
});

app.post('/account/withdraw', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const userId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter a valid amount between HK$0.01 and HK$999,999.99.' });
    }
    const account = await getAccountForUser(userId);
    if (!account) {
        return res.status(404).json({ message: "We couldn't find your account." });
    }
    if (!(await hasActiveCard(account.id))) {
        return res.status(400).json({ message: 'Please add an active card before depositing or withdrawing.' });
    }
    const withdraw_query_accounts = "UPDATE accounts SET balance=balance-$1 WHERE id=$2";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(withdraw_query_accounts, [amount, account.id]);
        await client.query(insert_query_transactions, [account.id, -amount, "Withdraw from account", "withdraw"]);
        await client.query('COMMIT');
        res.status(200).json({ message: "Withdrawal successful." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    } finally {
        client.release();
    }
});

app.post('/account/transfer', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const { receiverEmail } = req.body;
    const senderId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter a valid amount between HK$0.01 and HK$999,999.99.' });
    }
    if (!receiverEmail) {
        return res.status(400).json({ message: 'Please enter who to send money to.' });
    }
    const receiver_query = "SELECT id FROM users WHERE email=$1";
    const lock_query = "SELECT id, user_id, balance FROM accounts WHERE user_id = ANY($1) ORDER BY id FOR UPDATE";
    const subtract_query = "UPDATE accounts SET balance=balance-$1 WHERE id=$2";
    const add_query = "UPDATE accounts SET balance=balance+$1 WHERE id=$2";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type,counterparty_id) VALUES($1,$2,$3,$4,$5)";
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const receiverLookup = await client.query(receiver_query, [receiverEmail]);
        if (receiverLookup.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find anyone with that email." });
        }
        const receiverId = receiverLookup.rows[0].id;
        if (receiverId === senderId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "You can't send money to yourself." });
        }
        const locked = await client.query(lock_query, [[senderId, receiverId]]);
        const senderAccount = locked.rows.find((a) => a.user_id === senderId);
        const receiverAccount = locked.rows.find((a) => a.user_id === receiverId);
        if (!senderAccount) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        if (!receiverAccount) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "The person you're sending to doesn't have an account yet." });
        }
        if (Number(senderAccount.balance) < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "You don't have enough balance for this transfer." });
        }
        await client.query(subtract_query, [amount, senderAccount.id]);
        await client.query(insert_query_transactions, [senderAccount.id, -amount, 'Transfer to account', 'transfer_out', receiverAccount.id]);
        await client.query(add_query, [amount, receiverAccount.id]);
        await client.query(insert_query_transactions, [receiverAccount.id, amount, 'Transfer from account', 'transfer_in', senderAccount.id]);
        await client.query('COMMIT');
        res.status(200).json({ message: 'Transfer completed successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    } finally {
        client.release();
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const select_query_transactions = `
            SELECT t.id, t.amount, t.type, t.description, t.created_at,
                   SUM(t.amount) OVER (ORDER BY t.created_at, t.id) AS balance_after,
                   u.name AS counterparty_name, u.email AS counterparty_email
            FROM transactions t
            LEFT JOIN accounts a ON a.id = t.counterparty_id
            LEFT JOIN users u ON u.id = a.user_id
            WHERE t.account_id=$1
            ORDER BY t.created_at DESC, t.id DESC`;
        const result = await pool.query(select_query_transactions, [account.id]);
        res.status(200).json({ transactions: result.rows });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.get('/cards', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const select_query_cards = "SELECT * FROM cards WHERE account_id=$1 ORDER BY id";
        const result = await pool.query(select_query_cards, [account.id]);
        res.status(200).json({ cards: result.rows });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/cards', async (req, res) => {
    const { card_number, card_type, expiry_date } = req.body;
    if (!isValidCardNumber(card_number)) {
    return res.status(400).json({ message: 'That card number does not look right. Please check it.' });
    }
    if (isCardExpired(expiry_date)) {
        return res.status(400).json({ message: 'This card has expired.' });
    }
    if (!['Visa', 'Mastercard'].includes(card_type)) {
        return res.status(400).json({ message: 'Please choose Visa or Mastercard.' });
    }
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const last_four = String(card_number).slice(-4);
        const insert_query_cards = "INSERT INTO cards(account_id,last_four,card_type,expiry_date) VALUES($1,$2,$3,$4)";
        await pool.query(insert_query_cards, [account.id, last_four, card_type, expiry_date]);
        res.status(200).json({ message: "Card added successfully." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/active', async (req, res) => {
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
        return res.status(400).json({ message: 'Card status must be on or off.' });
    }
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const active_switch_query = "UPDATE cards SET is_active=$1 WHERE account_id=$2";
        await pool.query(active_switch_query, [is_active, account.id]);
        res.status(200).json({ message: "Card status updated." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));