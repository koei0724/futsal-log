import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { MapPin, Trophy, Target, Video } from 'lucide-react-native'
import type { Activity } from '@/lib/types'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface ActivityCardProps {
  activity: Activity
}

const typeLabels: Record<string, string> = {
  training: '훈련',
  match: '경기',
  plab: '플랩',
  other: '뒷연습',
  teamkakao: '팀카카오',
  lesson: '개인레슨',
}

const resultLabels: Record<string, string> = {
  win: '승리',
  lose: '패배',
  draw: '무승부',
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter()
  const colors = useColors()
  const styles = createStyles(colors)

  const handlePress = () => {
    router.push(`/record/${activity.id}`)
  }

  // 타입별 색상 가져오기
  const typeColor = colors[activity.type as keyof ThemeColors] as string || colors.other
  const resultColor = activity.result ? colors[activity.result as keyof ThemeColors] as string : undefined

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: typeColor },
        { opacity: pressed ? 0.8 : 1 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.typeLabel}>{typeLabels[activity.type]}</Text>
          <Text style={styles.title}>{activity.title}</Text>
        </View>

        {(activity.type === 'match' || activity.type === 'plab') && activity.result && (
          <Text style={[styles.result, { color: resultColor }]}>
            {resultLabels[activity.result]}
          </Text>
        )}
      </View>

      {/* Location */}
      {activity.location && (
        <View style={styles.locationRow}>
          <MapPin color={colors.mutedForeground} size={12} />
          <Text style={styles.location}>{activity.location}</Text>
        </View>
      )}

      {/* Match/Plab specific info */}
      {(activity.type === 'match' || activity.type === 'plab') && activity.score && (
        <View style={styles.matchInfo}>
          <View style={styles.scoreRow}>
            <Trophy color={colors.primary} size={16} />
            <Text style={styles.score}>
              {activity.score.team} - {activity.score.opponent}
            </Text>
          </View>

          {activity.personalStats && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {activity.personalStats.goals}
                </Text>
                <Text style={styles.statLabel}>득점</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  {activity.personalStats.assists}
                </Text>
                <Text style={styles.statLabel}>도움</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Training specific info */}
      {activity.type === 'training' && (
        <View style={styles.trainingInfo}>
          {activity.trainingTopic && (
            <View style={styles.topicRow}>
              <Target color={colors.primary} size={12} />
              <Text style={styles.topic}>{activity.trainingTopic}</Text>
            </View>
          )}

          {activity.effortScore && (
            <View style={styles.effortRow}>
              <Text style={styles.effortLabel}>노력도:</Text>
              <View style={styles.effortBars}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <View
                    key={score}
                    style={[
                      styles.effortBar,
                      {
                        backgroundColor:
                          score <= activity.effortScore!
                            ? colors.primary
                            : colors.muted,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Video indicator */}
      {activity.videoUrl && (
        <View style={styles.videoRow}>
          <Video color={colors.mutedForeground} size={12} />
          <Text style={styles.videoText}>영상 첨부됨</Text>
          {activity.comments && activity.comments.length > 0 && (
            <View style={[styles.commentBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.commentCount, { color: colors.secondaryForeground }]}>
                {activity.comments.length}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: StyleConstants.borderRadius.card,
    padding: 16,
    borderLeftWidth: 4,
    ...StyleConstants.shadow.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: '600',
  },
  result: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  trainingInfo: {
    marginTop: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topic: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  effortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  effortLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  effortBars: {
    flexDirection: 'row',
    gap: 2,
  },
  effortBar: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  videoText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  commentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    marginLeft: 4,
  },
  commentCount: {
    fontSize: 10,
    fontWeight: '500',
  },
})
