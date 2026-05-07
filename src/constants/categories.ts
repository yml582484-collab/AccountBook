// 支出分类
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: '餐饮', icon: '🍔', color: '#FF6B35' },
  { id: 'transport', name: '交通', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: '购物', icon: '🛍️', color: '#FF69B4' },
  { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#9B59B6' },
  { id: 'housing', name: '住房', icon: '🏠', color: '#8B7355' },
  { id: 'medical', name: '医疗', icon: '💊', color: '#E74C3C' },
  { id: 'education', name: '教育', icon: '📚', color: '#3498DB' },
  { id: 'clothing', name: '服饰', icon: '👕', color: '#1ABC9C' },
  { id: 'communication', name: '通讯', icon: '📱', color: '#2ECC71' },
  { id: 'daily', name: '日用品', icon: '🧴', color: '#F39C12' },
  { id: 'other_expense', name: '其他', icon: '📦', color: '#95A5A6' },
] as const;

// 收入分类
export const INCOME_CATEGORIES = [
  { id: 'salary', name: '工资', icon: '💰', color: '#27AE60' },
  { id: 'bonus', name: '奖金', icon: '🎁', color: '#F39C12' },
  { id: 'investment', name: '投资', icon: '📈', color: '#3498DB' },
  { id: 'freelance', name: '兼职', icon: '💼', color: '#9B59B6' },
  { id: 'gift', name: '红包', icon: '🧧', color: '#E74C3C' },
  { id: 'refund', name: '退款', icon: '↩️', color: '#1ABC9C' },
  { id: 'other_income', name: '其他', icon: '📦', color: '#95A5A6' },
] as const;

export type CategoryItem = (typeof EXPENSE_CATEGORIES)[number] | (typeof INCOME_CATEGORIES)[number];

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  date: string; // ISO 8601
  createdAt: string;
}

export function getCategoryById(id: string): CategoryItem | undefined {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(c => c.id === id);
}

export function getCategoriesForType(type: TransactionType) {
  return type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}
