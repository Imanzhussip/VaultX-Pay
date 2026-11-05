export interface Account {
  id: number;
  balance: string;
  created_at: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;
  amount: string;
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
  description: string;
  created_at: string;
  balance_after: string;
  counterparty_name: string | null;
  counterparty_email: string | null;
}

export interface Card {
  id: number;
  last_four: string;
  card_type: string;
  expiry_date: string;
  is_active: boolean;
}
