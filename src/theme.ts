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
    shadowColor: '#26443A',
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
