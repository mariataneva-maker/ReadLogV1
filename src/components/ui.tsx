// Building blocks from the Figma Components page (Primary button, Chips, Tab, close Icon button).
import React from 'react';
import { Pressable, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, FontFamily } from '../theme';

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close"
      style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
      <MaterialCommunityIcons name="close" size={26} color={Palette.mainText} />
    </Pressable>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export function Button({ label, variant = 'primary', onPress, disabled, style, onDark }: {
  label: string;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onDark?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles[variant], disabled && styles.disabled, pressed && styles.pressed, style]}>
      <Text style={[styles.buttonLabel, variant === 'primary' ? styles.labelOnPrimary : styles.labelPrimary, onDark && styles.labelOnDark]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>{label}</Text>
    </Pressable>
  );
}

export function TagChip({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.tag, pressed && styles.pressed]}>
      <Text style={styles.tagLabel}>{label}</Text>
    </Pressable>
  );
}

export function SheetHeader({ title, subtitle, onClose, onSubtitlePress }: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubtitlePress?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} onPress={onSubtitlePress} suppressHighlighting>{subtitle}</Text>
        ) : null}
      </View>
      <CloseButton onPress={onClose} />
    </View>
  );
}

export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export const ui = StyleSheet.create({
  field: {
    backgroundColor: Palette.buttonText,
    borderColor: Palette.subtleOutline,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  body: { fontFamily: FontFamily.sans, fontSize: 16, lineHeight: 24, color: Palette.mainText },
  meta: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.secondaryText },
});

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  close: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Palette.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  button: {
    height: 48, borderRadius: 999, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  primary: { backgroundColor: Palette.primary },
  secondary: { borderWidth: 1, borderColor: Palette.primary },
  tertiary: { paddingHorizontal: 12 },
  disabled: { opacity: 0.4 },
  buttonLabel: { fontFamily: FontFamily.sansMedium, fontSize: 15 },
  labelOnPrimary: { color: Palette.buttonText },
  labelPrimary: { color: Palette.primary },
  labelOnDark: { color: Palette.buttonText },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    backgroundColor: Palette.buttonText, borderWidth: 1, borderColor: Palette.subtleOutline,
  },
  chipOn: { backgroundColor: Palette.chipSelected, borderColor: Palette.chipSelected },
  chipLabel: { fontFamily: FontFamily.sans, fontSize: 15, color: Palette.mainText },
  chipLabelOn: { color: Palette.buttonText },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: Palette.tag },
  tagLabel: { fontFamily: FontFamily.sans, fontSize: 13, color: Palette.buttonText },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontFamily: FontFamily.serifMedium, fontSize: 20, lineHeight: 28, color: Palette.mainText },
  subtitle: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.secondaryText, marginTop: 2 },
  fieldLabel: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.secondaryText, marginBottom: 6 },
});
