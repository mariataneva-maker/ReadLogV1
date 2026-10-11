import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
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

// Layout numbers shared by the styles and the animation, so options can start inside the +.
const FAB_SIZE = 56;
const FAB_BOTTOM = 104;
const MENU_BOTTOM = 176;
const ITEM_HEIGHT = 46;
const ITEM_GAP = 12;
const STAGGER_MS = 40;
const SPRING = { damping: 14, stiffness: 220, mass: 0.8, useNativeDriver: true };

/** How far an option sits above the + button's centre; k = 0 is the option nearest the button. */
function distanceFromFab(k: number) {
  return MENU_BOTTOM + ITEM_HEIGHT / 2 + k * (ITEM_HEIGHT + ITEM_GAP) - (FAB_BOTTOM + FAB_SIZE / 2);
}

/**
 * The "+" button that opens the Figma "FAB menu" (Add book / Add quote / Add note).
 * Options spring out of the button nearest-first and shrink back into it on close.
 */
export function FABMenu({ actions }: { actions: FABAction[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReduceMotion();
  const progress = useRef(actions.map(() => new Animated.Value(0))).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Index 0 is the top option; the nearest to the button is the last one.
  const nearestFirst = progress.map((_, i) => progress[progress.length - 1 - i]);

  function show() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpen(true);
    setMounted(true);
    if (reduceMotion) {
      progress.forEach((p) => p.setValue(1));
      rotation.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(rotation, { toValue: 1, ...SPRING }),
      Animated.stagger(STAGGER_MS, nearestFirst.map((p) => Animated.spring(p, { toValue: 1, ...SPRING }))),
    ]).start();
  }

  function hide() {
    setOpen(false);
    if (reduceMotion) {
      progress.forEach((p) => p.setValue(0));
      rotation.setValue(0);
      setMounted(false);
      return;
    }
    // Farthest first, so the options fold back into the button.
    const shrink = (p: Animated.Value) =>
      Animated.timing(p, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true });
    Animated.parallel([
      Animated.spring(rotation, { toValue: 0, ...SPRING }),
      Animated.stagger(STAGGER_MS / 2, [...nearestFirst].reverse().map(shrink)),
    ]).start(({ finished }) => finished && setMounted(false));
  }

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <>
      {open && <Pressable style={StyleSheet.absoluteFill} onPress={hide} accessibilityLabel="Close menu" />}
      {mounted && (
        <View style={styles.menu} pointerEvents={open ? 'box-none' : 'none'}>
          {actions.map((a, i) => {
            const p = progress[i];
            const k = actions.length - 1 - i;
            const animated = reduceMotion
              ? { opacity: p }
              : {
                  opacity: p.interpolate({ inputRange: [0, 0.4], outputRange: [0, 1], extrapolate: 'clamp' }),
                  transform: [
                    { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [distanceFromFab(k), 0] }) },
                    { scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                  ],
                };
            return (
              <Animated.View key={a.label} style={[styles.itemWrap, animated]}>
                <Pressable style={({ pressed }) => [styles.item, pressed && styles.pressed]}
                  onPress={() => { hide(); a.onPress(); }}>
                  <MaterialCommunityIcons name={a.icon} size={22} color={Palette.mainText} />
                  <Text style={styles.itemLabel}>{a.label}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      )}
      <Pressable onPress={open ? hide : show} accessibilityLabel={open ? 'Close menu' : 'Add'}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <MaterialCommunityIcons name="plus" size={28} color={Palette.buttonText} />
        </Animated.View>
      </Pressable>
    </>
  );
}

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: FAB_BOTTOM,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    ...Shadow.fab,
  },
  pressed: { opacity: 0.8 },
  menu: { position: 'absolute', right: 16, bottom: MENU_BOTTOM, alignItems: 'flex-end', gap: ITEM_GAP, zIndex: 30 },
  // Grow from the right edge, which lines up with the + button.
  itemWrap: { transformOrigin: 'right' },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: ITEM_HEIGHT, paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: Palette.buttonText,
    // Terracotta outline and glow (the progress-bar colour) so options stand out over content.
    borderWidth: 1, borderColor: Palette.highlightOutline,
    shadowColor: Palette.highlightOutline, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12,
    elevation: 6,
  },
  itemLabel: { fontFamily: FontFamily.sans, fontSize: 15, color: Palette.mainText },
});
