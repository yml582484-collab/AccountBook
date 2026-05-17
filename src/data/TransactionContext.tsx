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

  // 初始化加载和手动下拉刷新时使用
  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 【修复核心】：添加记录时，先存硬盘，再直接修改内存状态，实现秒刷
  const addTransaction = async (t: Transaction) => {
    await storageAdd(t);
    // 使用前一个状态(prev)将新记录放在最前面，替代之前的 await refresh()
    setTransactions(prevTransactions => [t, ...prevTransactions]);
  };

  // 【修复核心】：删除记录时，同样直接在内存中过滤掉该项，实现秒删
  const removeTransaction = async (id: string) => {
    await storageDelete(id);
    // 过滤掉被删除的 ID，替代之前的 await refresh()
    setTransactions(prevTransactions => prevTransactions.filter(item => item.id !== id));
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