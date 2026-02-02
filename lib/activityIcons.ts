import type { ActivityType } from './types'
import type { ImageSourcePropType } from 'react-native'

export const activityIconImages: Record<ActivityType, ImageSourcePropType> = {
  training: require('@/assets/icons/training.png'),
  match: require('@/assets/icons/match.png'),
  plab: require('@/assets/icons/plab.png'),
  other: require('@/assets/icons/other.png'),
  teamkakao: require('@/assets/icons/teamkakao.png'),
  lesson: require('@/assets/icons/lesson.png'),
}

export const activityTypeLabels: Record<ActivityType, string> = {
  training: '훈련',
  match: '경기',
  plab: '플랩',
  other: '뒷연습',
  teamkakao: '팀카카오',
  lesson: '개인레슨',
}
