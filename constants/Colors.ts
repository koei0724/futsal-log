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
  teamkakao: string
  lesson: string

  // Result colors
  win: string
  lose: string
  draw: string

  // Weekend colors (for calendar)
  sunday: string
  saturday: string
}

// 다크 테마 색상 (쿨 다크)
export const darkColors: ThemeColors = {
  background: '#111827',      // 쿨 다크
  foreground: '#F9FAFB',
  card: '#1F2937',
  cardForeground: '#F9FAFB',
  primary: '#93C5FD',         // 파스텔 블루
  primaryForeground: '#111827',
  secondary: '#374151',
  secondaryForeground: '#F9FAFB',
  muted: '#1F2937',
  mutedForeground: '#9CA3AF',
  accent: '#374151',
  accentForeground: '#F9FAFB',
  destructive: '#FCA5A5',     // 파스텔 레드
  destructiveForeground: '#111827',
  border: '#374151',
  input: '#1F2937',
  ring: '#93C5FD',

  // Activity type colors (파스텔)
  training: '#FDE68A',        // 파스텔 옐로
  match: '#A7F3D0',           // 파스텔 그린
  plab: '#C4B5FD',            // 파스텔 바이올렛
  other: '#E9D5FF',           // 소프트 퍼플
  teamkakao: '#FDBA74',       // 파스텔 오렌지
  lesson: '#67E8F9',          // 파스텔 시안

  // Result colors (파스텔)
  win: '#A7F3D0',
  lose: '#FCA5A5',
  draw: '#FDE68A',

  // Weekend colors
  sunday: '#FCA5A5',
  saturday: '#93C5FD',
}

// 라이트 테마 색상 (화이트 & 파스텔)
export const lightColors: ThemeColors = {
  background: '#FFFFFF',      // 순백
  foreground: '#374151',      // 쿨 차콜
  card: '#FFFFFF',
  cardForeground: '#374151',
  primary: '#93C5FD',         // 파스텔 블루
  primaryForeground: '#FFFFFF',
  secondary: '#F3F4F6',
  secondaryForeground: '#374151',
  muted: '#F3F4F6',
  mutedForeground: '#9CA3AF',
  accent: '#F3F4F6',
  accentForeground: '#374151',
  destructive: '#FCA5A5',     // 파스텔 레드
  destructiveForeground: '#FFFFFF',
  border: '#E5E7EB',
  input: '#F3F4F6',
  ring: '#93C5FD',

  // Activity type colors (파스텔)
  training: '#FDE68A',        // 파스텔 옐로
  match: '#A7F3D0',           // 파스텔 그린
  plab: '#C4B5FD',            // 파스텔 바이올렛
  other: '#E9D5FF',           // 소프트 퍼플
  teamkakao: '#FDBA74',       // 파스텔 오렌지
  lesson: '#67E8F9',          // 파스텔 시안

  // Result colors (파스텔)
  win: '#A7F3D0',
  lose: '#FCA5A5',
  draw: '#FDE68A',

  // Weekend colors
  sunday: '#FCA5A5',
  saturday: '#93C5FD',
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
      shadowColor: '#9CA3AF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
}

// 기존 호환성을 위한 기본 Colors (다크 테마)
export const Colors = darkColors
