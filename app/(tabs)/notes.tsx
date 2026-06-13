import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Typography, Radius, Shadow } from '../../src/theme';
import { FAB } from '../../src/components';

export default function NotesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={[Typography.meta, { textAlign: 'center', marginTop: 8, lineHeight: 20 }]}>
            Tap the + button while reading to capture a thought.
          </Text>
        </View>
      </View>
      <FAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  content: { flex: 1, paddingTop: 4 },
  title: {
    ...Typography.display,
    fontSize: 30,
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    ...Typography.body,
    color: Colors.ink,
  },
});
