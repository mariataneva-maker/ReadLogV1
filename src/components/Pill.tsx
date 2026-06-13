import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily, Radius } from '../theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Pill({ label, active = false, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.pill, active && styles.active, style]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  active: {
    backgroundColor: Colors.pine,
    borderColor: Colors.pine,
  },
  label: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 14,
    color: Colors.grey,
  },
  activeLabel: {
    color: Colors.cream,
  },
});
