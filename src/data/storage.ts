import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../constants/categories';

const STORAGE_KEY = 'accountbook_transactions';

let transactionsCache: Transaction[] | null = null;

export async function loadTransactions(): Promise<Transaction[]> {
  if (transactionsCache) return transactionsCache;

  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      transactionsCache = JSON.parse(data);
      return transactionsCache!;
    }
  } catch (e) {
    console.error('Failed to load transactions:', e);
  }

  transactionsCache = [];
  return [];
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  transactionsCache = transactions;

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const transactions = await loadTransactions();
  transactions.unshift(transaction);
  await saveTransactions(transactions);
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await loadTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  await saveTransactions(filtered);
}

export async function clearAllTransactions(): Promise<void> {
  transactionsCache = [];
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear transactions:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
