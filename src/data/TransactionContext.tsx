import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction } from '../constants/categories';
import { loadTransactions, addTransaction as storageAdd, deleteTransaction as storageDelete, clearAllTransactions } from '../data/storage';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (t: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  loading: true,
  addTransaction: async () => {},
  removeTransaction: async () => {},
  clearAll: async () => {},
  refresh: async () => {},
});

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = async (t: Transaction) => {
    await storageAdd(t);
    await refresh();
  };

  const removeTransaction = async (id: string) => {
    await storageDelete(id);
    await refresh();
  };

  const clearAll = async () => {
    await clearAllTransactions();
    setTransactions([]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, removeTransaction, clearAll, refresh }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
