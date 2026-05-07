import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../data/TransactionContext';
import { Transaction, TransactionType, getCategoryById } from '../constants/categories';
import { FilterChip } from '../components/FilterChip';
import { EmptyState } from '../components/EmptyState';
import {
  getTransactionsForMonth,
  getTotalIncome,
  getTotalExpense,
  formatAmount,
  formatDate,
  groupByDate,
} from '../utils/helpers';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { transactions, loading, refresh, removeTransaction } = useTransactions();
  const [filter, setFilter] = useState<TransactionType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 本月交易
  const monthTransactions = useMemo(
    () => getTransactionsForMonth(transactions, currentYear, currentMonth),
    [transactions, currentYear, currentMonth]
  );

  const monthIncome = useMemo(() => getTotalIncome(monthTransactions), [monthTransactions]);
  const monthExpense = useMemo(() => getTotalExpense(monthTransactions), [monthTransactions]);

  // 过滤后的交易
  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (filter) {
      list = list.filter(t => t.type === filter);
    }
    return list;
  }, [transactions, filter]);

  // 按日期分组
  const grouped = useMemo(() => groupByDate(filteredTransactions), [filteredTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('确认删除', '确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => removeTransaction(id) },
    ]);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const cat = getCategoryById(item.categoryId);
    const isExpense = item.type === 'expense';

    return (
      <TouchableOpacity
        style={styles.transactionRow}
        onLongPress={() => handleDelete(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconCircle, { backgroundColor: (cat?.color || '#95A5A6') + '20' }]}>
          <Text style={styles.categoryIcon}>{cat?.icon || '📦'}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.categoryName}>{cat?.name || '其他'}</Text>
          {item.note ? (
            <Text style={styles.note} numberOfLines={1}>{item.note}</Text>
          ) : null}
        </View>
        <Text style={[styles.amount, { color: isExpense ? '#E74C3C' : '#27AE60' }]}>
          {isExpense ? '-' : '+'}¥{formatAmount(item.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDateSection = ({ item }: { item: { date: string; transactions: Transaction[] } }) => {
    const dayExpense = item.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const dayIncome = item.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    return (
      <View style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <View style={styles.dateSummary}>
            {dayExpense > 0 && <Text style={styles.dateExpense}>支 ¥{formatAmount(dayExpense)}</Text>}
            {dayIncome > 0 && <Text style={styles.dateIncome}>收 ¥{formatAmount(dayIncome)}</Text>}
          </View>
        </View>
        {item.transactions.map(t => (
          <View key={t.id}>{renderTransaction({ item: t })}</View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 月度概览卡片 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>本月概览</Text>
          <Text style={styles.summaryMonth}>{currentMonth + 1}月</Text>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>支出</Text>
            <Text style={[styles.summaryAmount, { color: '#E74C3C' }]}>
              ¥{formatAmount(monthExpense)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>收入</Text>
            <Text style={[styles.summaryAmount, { color: '#27AE60' }]}>
              ¥{formatAmount(monthIncome)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>结余</Text>
            <Text
              style={[
                styles.summaryAmount,
                { color: monthIncome - monthExpense >= 0 ? '#007AFF' : '#E67E22' },
              ]}
            >
              ¥{formatAmount(monthIncome - monthExpense)}
            </Text>
          </View>
        </View>
      </View>

      {/* 筛选栏 */}
      <View style={styles.filterBar}>
        <FilterChip title="全部" isSelected={filter === null} onPress={() => setFilter(null)} />
        <FilterChip title="支出" isSelected={filter === 'expense'} onPress={() => setFilter('expense')} />
        <FilterChip title="收入" isSelected={filter === 'income'} onPress={() => setFilter('income')} />
      </View>

      {/* 交易列表 */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="暂无记录"
          subtitle="点击右下角 + 开始记账"
        />
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.date}
          renderItem={renderDateSection}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
          }
        />
      )}

      {/* 添加按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryMonth: {
    fontSize: 14,
    color: '#999',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  dateSection: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#999',
  },
  dateSummary: {
    flexDirection: 'row',
    gap: 12,
  },
  dateExpense: {
    fontSize: 12,
    color: '#E74C3C',
  },
  dateIncome: {
    fontSize: 12,
    color: '#27AE60',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 30,
  },
});
