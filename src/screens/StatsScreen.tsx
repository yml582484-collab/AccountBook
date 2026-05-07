import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../data/TransactionContext';
import { TransactionType } from '../constants/categories';
import {
  getTransactionsForMonth,
  getTotalIncome,
  getTotalExpense,
  formatAmount,
  getCategorySummary,
} from '../utils/helpers';

export default function StatsScreen() {
  const { transactions } = useTransactions();
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  // 月份选择
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const monthTransactions = useMemo(
    () => getTransactionsForMonth(transactions, selectedYear, selectedMonth),
    [transactions, selectedYear, selectedMonth]
  );

  const monthIncome = useMemo(() => getTotalIncome(monthTransactions), [monthTransactions]);
  const monthExpense = useMemo(() => getTotalExpense(monthTransactions), [monthTransactions]);

  const categoryData = useMemo(
    () => getCategorySummary(monthTransactions, selectedType),
    [monthTransactions, selectedType]
  );

  const totalForType = selectedType === 'expense' ? monthExpense : monthIncome;

  const changeMonth = (offset: number) => {
    let newMonth = selectedMonth + offset;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>统计</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 月份选择 */}
        <View style={styles.monthPicker}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthArrow}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{selectedYear}年{selectedMonth + 1}月</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthArrow}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 总额卡片 */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>总支出</Text>
            <Text style={[styles.summaryAmount, { color: '#E74C3C' }]}>
              ¥{formatAmount(monthExpense)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>总收入</Text>
            <Text style={[styles.summaryAmount, { color: '#27AE60' }]}>
              ¥{formatAmount(monthIncome)}
            </Text>
          </View>
        </View>

        {/* 类型切换 */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeTab, selectedType === 'expense' && styles.typeTabActive]}
            onPress={() => setSelectedType('expense')}
          >
            <Text style={[styles.typeTabText, selectedType === 'expense' && styles.typeTabTextActive]}>
              支出分类
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeTab, selectedType === 'income' && styles.typeTabActive]}
            onPress={() => setSelectedType('income')}
          >
            <Text style={[styles.typeTabText, selectedType === 'income' && styles.typeTabTextActive]}>
              收入分类
            </Text>
          </TouchableOpacity>
        </View>

        {/* 分类排行 */}
        <View style={styles.rankCard}>
          <Text style={styles.rankTitle}>分类排行</Text>
          {categoryData.length === 0 ? (
            <View style={styles.emptyRank}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>暂无数据</Text>
            </View>
          ) : (
            categoryData.map((item, index) => (
              <View key={item.categoryId} style={styles.rankItem}>
                <View style={styles.rankHeader}>
                  <View style={styles.rankLeft}>
                    <Text style={styles.rankEmoji}>{item.icon}</Text>
                    <Text style={styles.rankName}>{item.categoryName}</Text>
                  </View>
                  <View style={styles.rankRight}>
                    <Text style={styles.rankAmount}>¥{formatAmount(item.total)}</Text>
                    <Text style={styles.rankPercent}>{Math.round(item.percentage * 100)}%</Text>
                  </View>
                </View>
                {/* 进度条 */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.percentage * 100}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '300',
  },
  monthText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  typeTabTextActive: {
    color: '#333',
  },
  rankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  rankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyRank: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  rankItem: {
    marginBottom: 16,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankEmoji: {
    fontSize: 18,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  rankRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rankPercent: {
    fontSize: 12,
    color: '#999',
    width: 36,
    textAlign: 'right',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
