import { Transaction, TransactionType } from '../constants/categories';

/**
 * 获取指定月份的交易记录
 */
export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter(t => {
    const d = new Date(t.date);
    const transactionYear = d.getFullYear();
    const transactionMonth = d.getMonth();
    return transactionYear === year && transactionMonth === month;
  });
}

/**
 * 计算总收入
 */
export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 计算总支出
 */
export function getTotalExpense(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 按分类汇总
 */
export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}

export function getCategorySummary(
  transactions: Transaction[],
  type: TransactionType
): CategorySummary[] {
  const { getCategoryById } = require('../constants/categories');
  const filtered = transactions.filter(t => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  
  const grouped: Record<string, { total: number; count: number }> = {};
  filtered.forEach(t => {
    if (!grouped[t.categoryId]) {
      grouped[t.categoryId] = { total: 0, count: 0 };
    }
    grouped[t.categoryId].total += t.amount;
    grouped[t.categoryId].count += 1;
  });
  
  return Object.entries(grouped)
    .map(([categoryId, data]) => {
      const cat = getCategoryById(categoryId);
      return {
        categoryId,
        categoryName: cat?.name || '其他',
        icon: cat?.icon || '📦',
        color: cat?.color || '#95A5A6',
        total: data.total,
        percentage: total > 0 ? data.total / total : 0,
        count: data.count,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * 格式化金额
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * 格式化日期
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays === 2) return '前天';
  
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekDays[d.getDay()]}`;
}

/**
 * 按日期分组交易
 */
export function groupByDate(transactions: Transaction[]): { date: string; transactions: Transaction[] }[] {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(t => {
    const dateKey = new Date(t.date).toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(t);
  });
  
  return Object.entries(grouped).map(([dateKey, trans]) => ({
    date: dateKey,
    transactions: trans,
  }));
}
