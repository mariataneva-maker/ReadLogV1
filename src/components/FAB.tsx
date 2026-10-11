import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FontFamily, Palette, Shadow } from '../theme';
import type { IconName } from './ui';

interface Props {
  onPress: () => void;
}

/** The "+" button (Figma FAB). */
export function FAB({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityLabel="Add" style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <MaterialCommunityIcons name="plus" size={28} color={Palette.buttonText} />
    </Pressable>
  );
}

export interface FABAction {
  label: string;
  icon: IconName;
  onPress: () => void;
}

/** The "+" button that opens the Figma "FAB menu" (Add book / Add quote / Add note). */
export function FABMenu({ actions }: { actions: FABAction[] }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    Haptics.selectionAsync();
    setOpen((o) => !o);
  }

  return (
    <>
      {open && <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="Close menu" />}
      {open && (
        <View style={styles.menu}>
          {actions.map((a) => (
            <Pressable key={a.label} style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              onPress={() => { setOpen(false); a.onPress(); }}>
              <MaterialCommunityIcons name={a.icon} size={22} color={Palette.mainText} />
              <Text style={styles.itemLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable onPress={toggle} accessibilityLabel={open ? 'Close menu' : 'Add'}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <MaterialCommunityIcons name={open ? 'close' : 'plus'} size={28} color={Palette.buttonText} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 104,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    ...Shadow.fab,
  },
  pressed: { opacity: 0.8 },
  menu: { position: 'absolute', right: 16, bottom: 176, alignItems: 'flex-end', gap: 12, zIndex: 30 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: Palette.buttonText, ...Shadow.card, shadowOpacity: 0.12, shadowRadius: 12,
  },
  itemLabel: { fontFamily: FontFamily.sans, fontSize: 15, color: Palette.mainText },
});
