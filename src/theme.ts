export const Colors = {
  paper: '#F1F3F2',
  surface: '#FFFFFF',
  ink: '#23211B',
  grey: '#79817C',
  faint: '#8C918B',
  line: '#E4E7E5',
  pine: '#26443A',
  tint: '#E7EDEA',
  cream: '#F4F2EC',
} as const;

export const FontFamily = {
  serif: 'Spectral_400Regular',
  serifItalic: 'Spectral_400Regular_Italic',
  serifMedium: 'Spectral_500Medium',
  sans: 'HankenGrotesk_400Regular',
  sansMedium: 'HankenGrotesk_500Medium',
  sansSemiBold: 'HankenGrotesk_600SemiBold',
} as const;

// 4-role type scale matching the mockups
export const Typography = {
  display: {
    fontFamily: FontFamily.serif,
    fontSize: 29,
    lineHeight: 32,
    color: Colors.ink,
  },
  read: {
    fontFamily: FontFamily.serif,
    fontSize: 19,
    lineHeight: 28,
    color: Colors.ink,
  },
  body: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 15,
    color: Colors.ink,
  },
  meta: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 13,
    color: Colors.grey,
  },
} as const;

export const Radius = {
  sm: 4,
  md: 14,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#23211B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cover: {
    shadowColor: '#23211B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    shadowColor: '#6B1D2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.34,
    shadowRadius: 22,
    elevation: 12,
  },
  tabbar: {
    shadowColor: '#23211B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 16,
  },
} as const;

// New direction — mirrors the Figma "colour" variables (ReadLog — UI Screens).
// Used by the capture flow first; the older tokens above stay until the rest is restyled.
export const Palette = {
  background: '#F5F2ED',
  primary: '#6B1D2A',
  secondary: '#D4645C',
  mainText: '#2A2828',
  secondaryText: '#7A6E6A',
  subtleOutline: '#EAE6E1',
  highlightOutline: '#B5493A',
  buttonText: '#FFFFFF',
  mutedText: '#6B7C74',
  cardBackground: '#FBFBFF',
  segmentSelected: '#D9D9D9',
  sheet: '#EAEBE6',
  tag: '#9BABA4',
  chipSelected: '#524E50',
  camera: '#1F1D1D',
} as const;

/** Figma colour/genre/1–6, used for genre chips. */
export const GenreColours = ['#6DA34D', '#D95F2C', '#4F7CAC', '#9B5DA8', '#C4504A', '#3E8E86'] as const;

/** Figma size/space/* and size/radius/*. */
export const Space = { 4: 4, 8: 8, 12: 12, 16: 16, 24: 24, 32: 32 } as const;
export const Radii = { sm: 4, md: 16, sheet: 28, full: 999 } as const;

/** Figma text styles, same names. */
export const Type = {
  titleScreen: { fontFamily: FontFamily.sansSemiBold, fontSize: 36 }, // Title/Screen
  titleBook: { fontFamily: FontFamily.serifMedium, fontSize: 32, lineHeight: 42 }, // Title/Book
  titleSheet: { fontFamily: FontFamily.serifMedium, fontSize: 20, lineHeight: 28 }, // Title/Sheet
  headingSection: { fontFamily: FontFamily.sans, fontSize: 20, lineHeight: 26 }, // Heading/Section
  transcript: { fontFamily: FontFamily.serifMedium, fontSize: 26, lineHeight: 38 }, // Reading/Transcript
  bodyLarge: { fontFamily: FontFamily.sans, fontSize: 18, lineHeight: 28 }, // Body/Large
  body: { fontFamily: FontFamily.sans, fontSize: 16, lineHeight: 22 }, // Body/Default
  bodyStrong: { fontFamily: FontFamily.sansSemiBold, fontSize: 16, lineHeight: 22 }, // Body/Strong
  meta: { fontFamily: FontFamily.sans, fontSize: 14, lineHeight: 18 }, // Meta
  labelButton: { fontFamily: FontFamily.sans, fontSize: 14, lineHeight: 18 }, // Label/Button
  labelSmall: { fontFamily: FontFamily.sans, fontSize: 12, lineHeight: 16 }, // Label/Small
} as const;

/** Figma effect styles. */
export const Effects = {
  coverLarge: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 }, // Shadow/Cover large
  cover: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12 }, // Shadow/Cover
  glow: { shadowColor: Palette.highlightOutline, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 }, // Glow/Highlight
} as const;
