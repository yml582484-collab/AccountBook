import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTransactions } from '../data/TransactionContext';
import {
  TransactionType,
  Transaction,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoriesForType,
} from '../constants/categories';
import { generateId } from '../data/storage';

interface AddTransactionScreenProps {
  navigation: any;
}

export default function AddTransactionScreen({ navigation }: AddTransactionScreenProps) {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = useMemo(() => getCategoriesForType(type), [type]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // 切换类型时重置分类为第一个
    const cats = getCategoriesForType(newType);
    setCategoryId(cats[0].id);
  };

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }

    const transaction: Transaction = {
      id: generateId(),
      amount: numAmount,
      type,
      categoryId,
      note: note.trim(),
      date: date.toISOString(),
      createdAt: new Date().toISOString(),
    };

    await addTransaction(transaction);
    navigation.goBack();
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.cancelBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>记一笔</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 类型切换 */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text style={styles.typeIcon}>📤</Text>
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>支出</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={styles.typeIcon}>📥</Text>
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>收入</Text>
          </TouchableOpacity>
        </View>

        {/* 金额输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>金额</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>¥</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => {
                const filtered = text.replace(/[^0-9.]/g, '');
                setAmount(filtered);
              }}
              placeholder="0.00"
              placeholderTextColor="#CCC"
              keyboardType="decimal-pad"
              autoFocus
              selectTextOnFocus
            />
          </View>
        </View>

        {/* 分类选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>分类</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setCategoryId(cat.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIconCircle,
                    {
                      backgroundColor: categoryId === cat.id ? cat.color : cat.color + '20',
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    categoryId === cat.id && { color: cat.color },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 备注 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>备注</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="添加备注（选填）"
            placeholderTextColor="#CCC"
            maxLength={100}
          />
        </View>

        {/* 日期 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>日期</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dateText}>
              {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
            </Text>
            <Text style={styles.dateArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            locale="zh-CN"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    minHeight: 90,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  typeButtonActiveExpense: {
    backgroundColor: '#FFF0F0',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#F0FFF4',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  typeTextActive: {
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 28,
    color: '#999',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    padding: 0,
    height: 50,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  dateArrow: {
    fontSize: 20,
    color: '#CCC',
  },
});
