import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Shadow } from '../theme';

interface Props {
  onPress: () => void;
}

export function FAB({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.fab}>
      <View style={styles.icon}>
        {/* Plus icon drawn with two rectangles */}
        <View style={styles.h} />
        <View style={styles.v} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 104,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    ...Shadow.fab,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: Colors.cream,
    borderRadius: 1,
  },
  v: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: Colors.cream,
    borderRadius: 1,
  },
});
