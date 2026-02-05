// Activity types for Futsal Log
export type ActivityType = 'training' | 'match' | 'plab' | 'other' | 'teamkakao' | 'lesson' | string

export type IconName = 'training' | 'match' | 'plab' | 'other' | 'teamkakao' | 'lesson' | 'icon1' | 'icon2' | 'icon3' | 'ball' | 'clap' | 'flag'

export type RecordType = 'training' | 'match'

export interface CustomActivityType {
  id: string
  label: string
  iconName: IconName
  borderColor: string
  bgColor: string
  enabled: boolean
  recordType: RecordType
}

export interface Activity {
  id: string
  date: string // ISO date string YYYY-MM-DD
  type: ActivityType
  title: string
  location?: string
  weather?: string

  // Training specific
  trainingTopic?: string
  lessonsLearned?: string
  effortScore?: number // 1-5
  kpt?: {
    keep: string
    problem: string
    try: string
  }

  // Match specific
  matchType?: 'tournament' | 'friendly' | 'plab'
  result?: 'win' | 'lose' | 'draw'
  score?: {
    team: number
    opponent: number
  }
  personalStats?: {
    goals: number
    assists: number
  }
  tacticalNotes?: string
  goodPoints?: string
  badPoints?: string

  // Media
  videoUrl?: string
  photos?: string[]

  // Video comments
  comments?: VideoComment[]

  createdAt: string
  updatedAt: string
}

export interface VideoComment {
  id: string
  timestamp: number // seconds
  content: string
  authorId: string
  authorName: string
  mentions?: string[]
  replies?: VideoComment[]
  createdAt: string
}

export interface MonthlyStats {
  month: string
  totalActivities: number
  trainingCount: number
  matchCount: number
  totalGoals: number
  totalAssists: number
  avgEffortScore: number
}

export interface CustomIcon {
  id: string
  emoji: string
  label: string
  type: ActivityType
}
