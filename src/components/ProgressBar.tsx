import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme';

interface Props {
  progress: number; // 0–1
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 3, style }: Props) {
  const pct = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.line,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.pine,
    borderRadius: 2,
  },
});
