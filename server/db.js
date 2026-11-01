require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','),
}));

const con = new Client(
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
con.connect().then(() => console.log("Connection is succesful!"));

function getFriendlyErrorMessage(err) {
    if (err.code === '23505') { return 'An account with this email already exists.'; }
    if (err.code === '23514') { return "You don't have enough balance for this."; }
    if (err.code === '22003') { return 'That amount is too large.'; }
    return 'Something went wrong. Please try again.';
}

function parseAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
        return null;
    }
    return amount;
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
    const date = new Date(expiry);
    if (isNaN(date.getTime())) return true;
    // a card is valid until the end of its expiry month
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    return endOfMonth < new Date();
}
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const insert_query_users = 'INSERT INTO users(name,email,password) VALUES ($1,$2,$3)';
    try {
        await con.query(insert_query_users, [name, email, hashedPassword]);
        res.status(200).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const select_query_users = 'SELECT * FROM users WHERE email=$1';
    try {
        const result = await con.query(select_query_users, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'Incorrect email or password.' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect email or password.' });
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
    const result = await con.query('SELECT * FROM accounts WHERE user_id=$1', [userId]);
    return result.rows[0];
}
async function hasActiveCard(accountId) {
    const result = await con.query(
        'SELECT 1 FROM cards WHERE account_id=$1 AND is_active=true LIMIT 1',
        [accountId]
    );
    return result.rows.length > 0;
}
app.get('/account', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
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
    const insert_query_accounts = "INSERT INTO accounts(user_id) VALUES($1)";
    try {
        await con.query(insert_query_accounts, [userId]);
        res.status(200).json({ message: "Account created successfully." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/deposit', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const userId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter an amount greater than zero.' });
    }
    const account = await getAccountForUser(userId);
    if (!account) {
        return res.status(404).json({ message: "We couldn't find your account." });
    }
    if (!(await hasActiveCard(account.id))) {
        return res.status(400).json({ message: 'Please add an active card before depositing or withdrawing.' });
    }
    const deposit_query_accounts = "UPDATE accounts SET balance=balance+$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const check = await con.query(deposit_query_accounts, [amount, userId]);
        let givenAccount;
        if (check.rows.length != 0) {
            givenAccount = check.rows[0].id;
        }
        if (!givenAccount) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        await con.query(insert_query_transactions, [givenAccount, amount, "Deposit to account", "deposit"]);
        await con.query('COMMIT');
        res.status(200).json({ message: "Deposit successful." });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/withdraw', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const userId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter an amount greater than zero.' });
    }
    const account = await getAccountForUser(userId);
    if (!account) {
        return res.status(404).json({ message: "We couldn't find your account." });
    }
    if (!(await hasActiveCard(account.id))) {
        return res.status(400).json({ message: 'Please add an active card before depositing or withdrawing.' });
    }
    const withdraw_query_accounts = "UPDATE accounts SET balance=balance-$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const check = await con.query(withdraw_query_accounts, [amount, userId]);
        let givenAccount;
        if (check.rows.length != 0) {
            givenAccount = check.rows[0].id;
        }
        if (!givenAccount) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        await con.query(insert_query_transactions, [givenAccount, -amount, "Withdraw from account", "withdraw"]);
        await con.query('COMMIT');
        res.status(200).json({ message: "Withdrawal successful." });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/transfer', async (req, res) => {
    const amount = parseAmount(req.body.amount);
    const { receiverEmail } = req.body;
    const senderId = req.user.userId;
    if (amount === null) {
        return res.status(400).json({ message: 'Please enter an amount greater than zero.' });
    }
    if (!receiverEmail) {
        return res.status(400).json({ message: 'Please enter who to send money to.' });
    }
    const receiver_query = "SELECT id FROM users WHERE email=$1";
    const check_query = "SELECT * FROM accounts WHERE user_id=$1";
    const subtract_query = "UPDATE accounts SET balance=balance-$1 WHERE user_id=$2 RETURNING id";
    const add_query = "UPDATE accounts SET balance=balance+$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions = "INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const receiverLookup = await con.query(receiver_query, [receiverEmail]);
        if (receiverLookup.rows.length === 0) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find anyone with that email." });
        }
        const receiverId = receiverLookup.rows[0].id;
        if (receiverId === senderId) {
            await con.query('ROLLBACK');
            return res.status(400).json({ message: "You can't send money to yourself." });
        }
        const check = await con.query(check_query, [senderId]);
        const senderAccount = check.rows[0];
        if (!senderAccount) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        if (Number(senderAccount.balance) < amount) {
            await con.query('ROLLBACK');
            return res.status(400).json({ message: "You don't have enough balance for this transfer." });
        }
        const checkSubtract = await con.query(subtract_query, [amount, senderId]);
        const givenAccount = checkSubtract.rows[0].id;
        await con.query(insert_query_transactions, [givenAccount, -amount, 'Transfer to account', 'transfer_out']);
        const addResult = await con.query(add_query, [amount, receiverId]);
        if (addResult.rowCount === 0) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "The person you're sending to doesn't have an account yet." });
        }
        const givenAccount1 = addResult.rows[0].id;
        await con.query(insert_query_transactions, [givenAccount1, amount, 'Transfer from account', 'transfer_in']);
        await con.query('COMMIT');
        res.status(200).json({ message: 'Transfer completed successfully.' });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const select_query_transactions = "SELECT * FROM transactions WHERE account_id=$1 ORDER BY created_at DESC, id DESC";
        const result = await con.query(select_query_transactions, [account.id]);
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
        const result = await con.query(select_query_cards, [account.id]);
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
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const last_four = String(card_number).slice(-4);
        const insert_query_cards = "INSERT INTO cards(account_id,last_four,card_type,expiry_date) VALUES($1,$2,$3,$4)";
        await con.query(insert_query_cards, [account.id, last_four, card_type, expiry_date]);
        res.status(200).json({ message: "Card added successfully." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

app.post('/account/active', async (req, res) => {
    const { is_active } = req.body;
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: "We couldn't find your account." });
        }
        const active_switch_query = "UPDATE cards SET is_active=$1 WHERE account_id=$2";
        await con.query(active_switch_query, [is_active, account.id]);
        res.status(200).json({ message: "Card status updated." });
    } catch (err) {
        res.status(500).json({ error: getFriendlyErrorMessage(err) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));