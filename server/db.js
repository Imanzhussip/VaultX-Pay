require('dotenv').config(); 
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const { use } = require('react');

const app = express();
app.use(express.json());
app.use(cors());
const con = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "1",
    database: "vaultx"
});

con.connect().then(() => console.log("Connection is succesful!"));

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const insert_query_users = 'INSERT INTO users(name,email,password) VALUES ($1,$2,$3)';
    try {
        await con.query(insert_query_users, [name, email, hashedPassword]);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const select_query_users = 'SELECT * FROM users WHERE email=$1';
    try {
        const result = await con.query(select_query_users, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "15m" });
        res.status(200).json({ message: 'Login successful', userId: user.id, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});

const authenticateToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized or expired token' });
    }
};

app.use(authenticateToken);

async function getAccountForUser(userId) {
    const result = await con.query('SELECT * FROM accounts WHERE user_id=$1', [userId]);
    return result.rows[0];
};

app.get('/account', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ account });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/account/create', async (req, res) => {
    const userId = req.user.userId;
    const insert_query_accounts = "INSERT INTO accounts(user_id) VALUES($1)";
    try {
        await con.query(insert_query_accounts, [userId]);
        res.status(200).json({ message: "Account created succesfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/account/deposit', async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.userId;
    const deposit_query_accounts = "UPDATE accounts SET balance=balance+$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions="INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const check=await con.query(deposit_query_accounts, [amount, userId]);
        let givenAccount;
            if (check.rows.length != 0) {
                givenAccount = check.rows[0].id;
            };
        if(!givenAccount){
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "Account does not exist" });
        }
        if(!amount || amount <= 0){
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "Invalid value" });
        }
        await con.query(insert_query_transactions,[givenAccount,amount,"Deposit to account","deposit"]);
        await con.query('COMMIT');
        res.status(200).json({ message: "Amount deposited succesfully" });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

app.post('/account/withdraw', async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.userId;
    const withdraw_query_accounts = "UPDATE accounts SET balance=balance-$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions="INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const check=await con.query(withdraw_query_accounts, [amount, userId]);
        let givenAccount;
            if (check.rows.length != 0) {
                givenAccount = check.rows[0].id;
            };
        if(!givenAccount){
            await con.query('ROLLBACK');
            return res.status(404).json({ message: "Account does not exist" });
        }
        await con.query(insert_query_transactions,[givenAccount,-amount,"Withdraw from account","withdraw"]);
        await con.query('COMMIT');
        res.status(200).json({ message: "Amount withdrawn succesfully" });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

app.post('/account/transfer', async (req, res) => {
    const { amount, receiverId } = req.body;
    const senderId = req.user.userId;
    const check_query = "SELECT * FROM accounts WHERE user_id=$1";
    const subtract_query = "UPDATE accounts SET balance=balance-$1 WHERE user_id=$2 RETURNING id";
    const add_query = "UPDATE accounts SET balance=balance+$1 WHERE user_id=$2 RETURNING id";
    const insert_query_transactions="INSERT INTO transactions(account_id,amount,description,type) VALUES($1,$2,$3,$4)";
    await con.query('BEGIN');
    try {
        const check = await con.query(check_query, [senderId]);
        const senderAccount = check.rows[0];
        if (!senderAccount) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: 'Sender account not found' });
        }
        if (senderAccount.balance < amount) {
            await con.query('ROLLBACK');
            return res.status(400).json({ message: 'Not enough cash' });
        }
        const checkSubtract=await con.query(subtract_query, [amount, senderId]);
        const givenAccount = checkSubtract.rows[0].id;
        await con.query(insert_query_transactions,[givenAccount,-amount,'Transfer to account','transfer_out'])

        const addResult = await con.query(add_query, [amount, receiverId]);
        if (addResult.rowCount === 0) {
            await con.query('ROLLBACK');
            return res.status(404).json({ message: 'Receiver account not found' });
        }
        const givenAccount1=addResult.rows[0].id;
        await con.query(insert_query_transactions,[givenAccount1,amount,'Transfer from account','transfer_in'])
        await con.query('COMMIT');
        res.status(200).json({ message: "Transfer completed successfully" });
    } catch (err) {
        await con.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const select_query_transactions = "SELECT * FROM transactions WHERE account_id=$1";
        const result = await con.query(select_query_transactions, [account.id]);
        res.status(200).json({ transactions: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/cards', async (req, res) => {
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const select_query_cards = "SELECT * FROM cards WHERE account_id=$1";
        const result = await con.query(select_query_cards, [account.id]);
        res.status(200).json({ cards: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/cards', async (req, res) => {
    const { card_number, card_type, expiry_date } = req.body;
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const last_four = String(card_number).slice(-4);
        const insert_query_cards = "INSERT INTO cards(account_id,last_four,card_type,expiry_date) VALUES($1,$2,$3,$4)";
        await con.query(insert_query_cards, [account.id, last_four, card_type, expiry_date]);
        res.status(200).json({ message: "The card linked succesfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/account/active', async (req, res) => {
    const { is_active } = req.body;
    try {
        const account = await getAccountForUser(req.user.userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const active_switch_query = "UPDATE cards SET is_active=$1 WHERE account_id=$2";
        await con.query(active_switch_query, [is_active, account.id]);
        res.status(200).json({ message: "The card(s) activated/deactivated succesfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));