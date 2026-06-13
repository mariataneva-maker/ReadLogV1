import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Colors, Radius, Shadow } from '../theme';

type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { width: number; height: number }> = {
  sm: { width: 54, height: 80 },
  md: { width: 80, height: 120 },
  lg: { width: 148, height: 222 },
};

interface Props {
  uri: string | null | undefined;
  size?: Size;
  style?: object;
}

export function BookCover({ uri, size = 'md', style }: Props) {
  const dims = SIZES[size];
  return (
    <View style={[styles.wrapper, dims, style]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.img, dims]} resizeMode="cover" />
      ) : (
        <View style={[styles.placeholder, dims]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Shadow.cover,
  },
  img: {
    borderRadius: Radius.sm,
  },
  placeholder: {
    backgroundColor: Colors.line,
    borderRadius: Radius.sm,
  },
});
