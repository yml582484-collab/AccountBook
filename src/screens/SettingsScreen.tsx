import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../data/TransactionContext';
import { getCategoryById } from '../constants/categories';
import { formatAmount } from '../utils/helpers';

export default function SettingsScreen() {
  const { transactions, clearAll } = useTransactions();

  const handleExport = async () => {
    if (transactions.length === 0) {
      Alert.alert('提示', '暂无数据可导出');
      return;
    }

    let csv = '日期,类型,分类,金额,备注\n';
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sorted.forEach((t) => {
      const cat = getCategoryById(t.categoryId);
      const date = new Date(t.date).toLocaleString('zh-CN');
      const type = t.type === 'expense' ? '支出' : '收入';
      const category = cat?.name || '其他';
      const amount = formatAmount(t.amount);
      const note = t.note.replace(/,/g, '，');
      csv += `${date},${type},${category},${amount},${note}\n`;
    });

    try {
      await Share.share({
        message: csv,
        title: '记账数据导出',
      });
    } catch (e) {
      Alert.alert('导出失败', '请重试');
    }
  };

  const handleClear = () => {
    Alert.alert('确认清除', '确定要清除所有记账数据吗？此操作不可撤销。', [
      { text: '取消', style: 'cancel' },
      {
        text: '清除',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          Alert.alert('已清除', '所有数据已删除');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>设置</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 数据管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={handleExport}>
              <Text style={styles.menuIcon}>📤</Text>
              <Text style={styles.menuText}>导出数据</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleClear}>
              <Text style={styles.menuIcon}>🗑️</Text>
              <Text style={[styles.menuText, { color: '#E74C3C' }]}>清除所有数据</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <Text style={styles.menuIcon}>📱</Text>
              <Text style={styles.menuText}>版本</Text>
              <Text style={styles.menuValue}>1.0.0</Text>
            </View>
            <View style={styles.menuDivider} />
            <View style={styles.menuItem}>
              <Text style={styles.menuIcon}>📋</Text>
              <Text style={styles.menuText}>交易记录数</Text>
              <Text style={styles.menuValue}>{transactions.length} 条</Text>
            </View>
          </View>
        </View>

        {/* 使用说明 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>使用说明</Text>
          <View style={styles.card}>
            <View style={styles.helpItem}>
              <Text style={styles.helpText}>• 点击账单页右下角 + 添加记录</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpText}>• 支持记录收入和支出，选择分类和备注</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpText}>• 统计页可按月查看各分类消费排行</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpText}>• 长按记录可删除</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpText}>• 所有数据保存在本地，安全可靠</Text>
            </View>
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuValue: {
    fontSize: 14,
    color: '#999',
  },
  menuArrow: {
    fontSize: 20,
    color: '#CCC',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
    marginLeft: 48,
  },
  helpItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
