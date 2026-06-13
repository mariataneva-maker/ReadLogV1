import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, Radius } from '../theme';

interface Props {
  label: string;
}

export function Tag({ label }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: Colors.tint,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  label: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 12.5,
    color: Colors.pine,
  },
});
