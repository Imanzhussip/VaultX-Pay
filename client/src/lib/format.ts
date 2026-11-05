import type { Transaction } from '../types';

const money = new Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD' });
const MINUS = '−';

export function formatMoney(value: number) {
  return (value < 0 ? MINUS : '') + money.format(Math.abs(value));
}

export function formatSigned(value: number) {
  return (value > 0 ? '+' : value < 0 ? MINUS : '') + money.format(Math.abs(value));
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function describeTransaction(t: Transaction) {
  switch (t.type) {
    case 'deposit':
      return { title: 'Added from card', detail: 'Card top-up' };
    case 'withdraw':
      return { title: 'Withdrawn to card', detail: 'Card withdrawal' };
    case 'transfer_out':
      return { title: t.counterparty_name ? `To ${t.counterparty_name}` : 'Sent', detail: t.counterparty_email || 'Transfer' };
    case 'transfer_in':
      return { title: t.counterparty_name ? `From ${t.counterparty_name}` : 'Received', detail: t.counterparty_email || 'Transfer' };
    default:
      return { title: t.description, detail: t.type };
  }
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
