import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FilterChipProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FilterChip({ title, isSelected, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
