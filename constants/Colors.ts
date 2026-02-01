// 테마 색상 타입 정의
export type ColorScheme = 'light' | 'dark' | 'system'

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string

  // Activity type colors
  training: string
  match: string
  plab: string
  other: string

  // Result colors
  win: string
  lose: string
  draw: string

  // Weekend colors (for calendar)
  sunday: string
  saturday: string
}

// 파스텔 다크 테마 색상
export const darkColors: ThemeColors = {
  background: '#2D2A26',      // 웜 브라운
  foreground: '#F5F0EB',
  card: '#3A3633',
  cardForeground: '#F5F0EB',
  primary: '#8EDAD0',         // 파스텔 민트
  primaryForeground: '#2D2A26',
  secondary: '#4A4643',
  secondaryForeground: '#F5F0EB',
  muted: '#3A3633',
  mutedForeground: '#A8A29E',
  accent: '#4A4643',
  accentForeground: '#F5F0EB',
  destructive: '#F5A9A9',     // 파스텔 코랄
  destructiveForeground: '#2D2A26',
  border: '#4A4643',
  input: '#3A3633',
  ring: '#8EDAD0',

  // Activity type colors (파스텔)
  training: '#FFD4A3',        // 피치
  match: '#A8E6CF',           // 민트 그린
  plab: '#DDA0DD',            // 라벤더
  other: '#C4B8E0',           // 소프트 퍼플

  // Result colors (파스텔)
  win: '#A8E6CF',
  lose: '#F5A9A9',
  draw: '#FFE4B5',

  // Weekend colors
  sunday: '#F5A9A9',
  saturday: '#A0C4E8',
}

// 파스텔 라이트 테마 색상
export const lightColors: ThemeColors = {
  background: '#FFF9F5',      // 크림 베이지
  foreground: '#4A4A4A',      // 소프트 차콜
  card: '#FFFFFF',
  cardForeground: '#4A4A4A',
  primary: '#7ECEC0',         // 민트
  primaryForeground: '#FFFFFF',
  secondary: '#F5EDE6',
  secondaryForeground: '#4A4A4A',
  muted: '#F5EDE6',
  mutedForeground: '#8B8B8B',
  accent: '#F5EDE6',
  accentForeground: '#4A4A4A',
  destructive: '#F5A9A9',     // 코랄
  destructiveForeground: '#FFFFFF',
  border: '#E8DFD6',
  input: '#F5EDE6',
  ring: '#7ECEC0',

  // Activity type colors (파스텔)
  training: '#FFD4A3',        // 피치
  match: '#A8E6CF',           // 민트 그린
  plab: '#DDA0DD',            // 라벤더
  other: '#C4B8E0',           // 소프트 퍼플

  // Result colors (파스텔)
  win: '#A8E6CF',
  lose: '#F5A9A9',
  draw: '#FFE4B5',

  // Weekend colors
  sunday: '#F5A9A9',
  saturday: '#A0C4E8',
}

// 스타일 상수
export const StyleConstants = {
  borderRadius: {
    button: 16,
    card: 20,
    input: 14,
    badge: 9999,
  },
  shadow: {
    light: {
      shadowColor: '#D4C4B5',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 4,
    },
  },
}

// 기존 호환성을 위한 기본 Colors (다크 테마)
export const Colors = darkColors
