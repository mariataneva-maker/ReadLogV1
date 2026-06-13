import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, Shadow } from '../../src/theme';

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <View style={{ opacity: focused ? 1 : 0.55 }}>{icon}</View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

// SVG-free icon components using just Views
function LibraryIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.bookIcon, { borderColor: color }]}>
        <View style={[styles.bookSpine, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function QuoteIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
      <View style={[styles.quoteMark, { backgroundColor: color }]} />
      <View style={[styles.quoteMark, { backgroundColor: color }]} />
    </View>
  );
}

function NotesIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.noteLines]}>
        <View style={[styles.noteLine, { backgroundColor: color, width: 14 }]} />
        <View style={[styles.noteLine, { backgroundColor: color, width: 10 }]} />
        <View style={[styles.noteLine, { backgroundColor: color, width: 12 }]} />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<LibraryIcon color={focused ? Colors.pine : Colors.faint} />}
              label="Library"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<QuoteIcon color={focused ? Colors.pine : Colors.faint} />}
              label="Quotes"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<NotesIcon color={focused ? Colors.pine : Colors.faint} />}
              label="Notes"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 22,
    left: 40,
    right: 40,
    height: 68,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: Colors.line,
    backgroundColor: Colors.surface,
    paddingBottom: 0,
    ...Shadow.tabbar,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 19,
  },
  tabItemActive: {
    backgroundColor: Colors.tint,
  },
  tabLabel: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 11,
    color: Colors.faint,
  },
  tabLabelActive: {
    color: Colors.pine,
  },
  // book icon
  bookIcon: {
    width: 16,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bookSpine: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 1,
  },
  // quote icon
  quoteMark: {
    width: 6,
    height: 9,
    borderRadius: 3,
  },
  // notes icon
  noteLines: {
    gap: 3,
  },
  noteLine: {
    height: 2,
    borderRadius: 1,
  },
});
