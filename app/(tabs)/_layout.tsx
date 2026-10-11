// Tab bar — the Figma "Menu" component (Home · Library · Notes · Quotes).
// Native tabs, so iOS draws it as a floating Liquid Glass bar. Icons are exported
// from the Figma icon components (assets/tab-icons) to keep their line weight.
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Palette, FontFamily } from '../../src/theme';

const TABS = [
  {
    name: 'index', label: 'Home',
    icon: require('../../assets/tab-icons/home.png'),
    selectedIcon: require('../../assets/tab-icons/home-filled.png'),
  },
  {
    name: 'library', label: 'Library',
    icon: require('../../assets/tab-icons/library.png'),
    selectedIcon: require('../../assets/tab-icons/library-filled.png'),
  },
  {
    name: 'notes', label: 'Notes',
    icon: require('../../assets/tab-icons/notes.png'),
    selectedIcon: require('../../assets/tab-icons/notes-filled.png'),
  },
  {
    name: 'quotes', label: 'Quotes',
    icon: require('../../assets/tab-icons/quotes.png'),
    selectedIcon: require('../../assets/tab-icons/quotes-filled.png'),
  },
];

export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={Palette.highlightOutline}
      iconColor={{ default: Palette.mainText, selected: Palette.highlightOutline }}
      labelStyle={{ fontFamily: FontFamily.sans, color: Palette.mainText }}
    >
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Icon src={{ default: tab.icon, selected: tab.selectedIcon }} renderingMode="template" />
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
