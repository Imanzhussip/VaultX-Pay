import type { Transaction } from '../types';

export function startOfDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function dayKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDayKey(key: string | null) {
  const match = key && /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function balanceHistory(transactions: Transaction[], today: Date, minDays = 90) {
  const ordered = [...transactions].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  const firstMovement = ordered.length ? new Date(ordered[0].created_at) : today;
  const earliest = addDays(today, -(minDays - 1));
  const start = firstMovement < earliest ? new Date(firstMovement.getFullYear(), firstMovement.getMonth(), firstMovement.getDate()) : earliest;
  const dates: Date[] = [];
  const values: number[] = [];
  let index = 0;
  let balance = 0;
  for (let day = start; day <= today; day = addDays(day, 1)) {
    const end = addDays(day, 1);
    while (index < ordered.length && new Date(ordered[index].created_at) < end) {
      balance = Number(ordered[index].balance_after);
      index++;
    }
    dates.push(day);
    values.push(balance);
  }
  return { dates, values };
}

export function inRange(transactions: Transaction[], since: Date, until?: Date) {
  return transactions.filter((t) => {
    const at = new Date(t.created_at);
    return at >= since && (!until || at < until);
  });
}

export function summarise(transactions: Transaction[], since: Date, until?: Date) {
  const recent = inRange(transactions, since, until);
  let moneyIn = 0;
  let moneyOut = 0;
  const people = new Map<string, { name: string; email: string; net: number; count: number }>();
  for (const t of recent) {
    const amount = Number(t.amount);
    if (amount > 0) moneyIn += amount;
    else moneyOut -= amount;
    if (t.counterparty_email) {
      const person = people.get(t.counterparty_email) ?? { name: t.counterparty_name ?? t.counterparty_email, email: t.counterparty_email, net: 0, count: 0 };
      person.net += amount;
      person.count += 1;
      people.set(t.counterparty_email, person);
    }
  }
  return {
    count: recent.length,
    moneyIn: Math.round(moneyIn * 100) / 100,
    moneyOut: Math.round(moneyOut * 100) / 100,
    people: [...people.values()].sort((a, b) => b.count - a.count || Math.abs(b.net) - Math.abs(a.net)),
  };
}
