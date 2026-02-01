import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Trophy, Target, Edit } from 'lucide-react-native'
import { VideoPlayer } from '@/components/futsal'
import { getActivityById } from '@/lib/mock-data'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

const typeLabels: Record<string, string> = {
  training: '훈련',
  match: '경기',
  plab: '플랩',
  other: '기타',
}

const resultLabels: Record<string, string> = {
  win: '승리',
  lose: '패배',
  draw: '무승부',
}

const matchTypeLabels: Record<string, string> = {
  tournament: '대회',
  friendly: '친선',
  plab: '플랩',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${weekday})`
}

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colors = useColors()
  const { isDark } = useTheme()
  const styles = createStyles(colors, isDark)
  const activity = getActivityById(id || '')

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>기록을 찾을 수 없습니다</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backLink}>홈으로 돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const handleAddComment = (timestamp: number, content: string) => {
    console.log('[RN] Adding comment:', { timestamp, content })
  }

  // 타입별 색상
  const typeColor = colors[activity.type as keyof ThemeColors] as string || colors.other
  const resultColor = activity.result ? colors[activity.result as keyof ThemeColors] as string : undefined

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={colors.foreground} size={20} />
          </Pressable>
          <View style={styles.typeBadge}>
            <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
            <Text style={styles.typeLabel}>{typeLabels[activity.type]}</Text>
          </View>
        </View>

        <Pressable style={styles.editButton}>
          <Edit color={colors.foreground} size={20} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title and basic info */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{activity.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <CalendarIcon color={colors.mutedForeground} size={16} />
              <Text style={styles.metaText}>{formatDate(activity.date)}</Text>
            </View>

            {activity.location && (
              <View style={styles.metaItem}>
                <MapPin color={colors.mutedForeground} size={16} />
                <Text style={styles.metaText}>{activity.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Match specific content */}
        {(activity.type === 'match' || activity.type === 'plab') && (
          <>
            {/* Score and Result */}
            <View style={styles.card}>
              <View style={styles.matchHeader}>
                {activity.matchType && (
                  <View style={styles.matchTypeBadge}>
                    <Text style={styles.matchTypeText}>{matchTypeLabels[activity.matchType]}</Text>
                  </View>
                )}
                {activity.result && (
                  <Text style={[styles.resultText, { color: resultColor }]}>
                    {resultLabels[activity.result]}
                  </Text>
                )}
              </View>

              {activity.score && (
                <View style={styles.scoreContainer}>
                  <View style={styles.teamScore}>
                    <Text style={styles.teamLabel}>우리팀</Text>
                    <Text style={[styles.scoreValue, { color: colors.primary }]}>
                      {activity.score.team}
                    </Text>
                  </View>
                  <Text style={styles.scoreSeparator}>:</Text>
                  <View style={styles.teamScore}>
                    <Text style={styles.teamLabel}>상대팀</Text>
                    <Text style={styles.scoreValue}>{activity.score.opponent}</Text>
                  </View>
                </View>
              )}

              {activity.personalStats && (
                <View style={styles.personalStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                      {activity.personalStats.goals}
                    </Text>
                    <Text style={styles.statLabel}>득점</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{activity.personalStats.assists}</Text>
                    <Text style={styles.statLabel}>도움</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Match review */}
            {(activity.goodPoints || activity.badPoints || activity.tacticalNotes) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>경기 회고</Text>

                {activity.goodPoints && (
                  <View style={styles.reviewItem}>
                    <Text style={[styles.reviewLabel, { color: colors.win }]}>잘한 점</Text>
                    <Text style={styles.reviewText}>{activity.goodPoints}</Text>
                  </View>
                )}

                {activity.badPoints && (
                  <View style={styles.reviewItem}>
                    <Text style={[styles.reviewLabel, { color: colors.lose }]}>아쉬운 점</Text>
                    <Text style={styles.reviewText}>{activity.badPoints}</Text>
                  </View>
                )}

                {activity.tacticalNotes && (
                  <View style={styles.reviewItem}>
                    <Text style={[styles.reviewLabel, { color: colors.saturday }]}>전술 노트</Text>
                    <Text style={styles.reviewText}>{activity.tacticalNotes}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Video Player */}
            {activity.videoUrl && (
              <View style={styles.card}>
                <View style={styles.cardTitleRow}>
                  <Trophy color={colors.primary} size={16} />
                  <Text style={styles.cardTitle}>경기 영상</Text>
                </View>
                <VideoPlayer
                  videoUrl={activity.videoUrl}
                  comments={activity.comments || []}
                  onAddComment={handleAddComment}
                />
              </View>
            )}
          </>
        )}

        {/* Training specific content */}
        {activity.type === 'training' && (
          <>
            {/* Training info */}
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Target color={colors.primary} size={16} />
                <Text style={styles.cardTitle}>훈련 내용</Text>
              </View>

              {activity.trainingTopic && (
                <View style={styles.trainingItem}>
                  <Text style={styles.trainingLabel}>훈련 주제</Text>
                  <Text style={styles.trainingTopic}>{activity.trainingTopic}</Text>
                </View>
              )}

              {activity.lessonsLearned && (
                <View style={styles.trainingItem}>
                  <Text style={styles.trainingLabel}>배운 내용</Text>
                  <Text style={styles.trainingText}>{activity.lessonsLearned}</Text>
                </View>
              )}

              {activity.effortScore && (
                <View style={styles.trainingItem}>
                  <Text style={styles.trainingLabel}>노력 점수</Text>
                  <View style={styles.effortRow}>
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
                        >
                          <Text
                            style={[
                              styles.effortBarText,
                              {
                                color:
                                  score <= activity.effortScore!
                                    ? colors.primaryForeground
                                    : colors.mutedForeground,
                              },
                            ]}
                          >
                            {score}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.effortValue}>{activity.effortScore}/5</Text>
                  </View>
                </View>
              )}
            </View>

            {/* KPT Review */}
            {activity.kpt && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>KPT 회고</Text>

                {activity.kpt.keep && (
                  <View style={[styles.kptItem, { backgroundColor: `${colors.win}15`, borderColor: `${colors.win}30` }]}>
                    <Text style={[styles.kptLabel, { color: colors.win }]}>Keep</Text>
                    <Text style={styles.kptText}>{activity.kpt.keep}</Text>
                  </View>
                )}

                {activity.kpt.problem && (
                  <View style={[styles.kptItem, { backgroundColor: `${colors.lose}15`, borderColor: `${colors.lose}30` }]}>
                    <Text style={[styles.kptLabel, { color: colors.lose }]}>Problem</Text>
                    <Text style={styles.kptText}>{activity.kpt.problem}</Text>
                  </View>
                )}

                {activity.kpt.try && (
                  <View style={[styles.kptItem, { backgroundColor: `${colors.saturday}15`, borderColor: `${colors.saturday}30` }]}>
                    <Text style={[styles.kptLabel, { color: colors.saturday }]}>Try</Text>
                    <Text style={styles.kptText}>{activity.kpt.try}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  backLink: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  typeLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: StyleConstants.borderRadius.card,
    padding: 16,
    marginBottom: 16,
    ...StyleConstants.shadow.light,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchTypeBadge: {
    backgroundColor: colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  matchTypeText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.mutedForeground,
  },
  scoreSeparator: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  personalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: colors.foreground,
  },
  trainingItem: {
    marginBottom: 16,
  },
  trainingLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  trainingTopic: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  trainingText: {
    fontSize: 14,
    color: colors.foreground,
  },
  effortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  effortBars: {
    flexDirection: 'row',
    gap: 4,
  },
  effortBar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effortBarText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  effortValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  kptItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  kptLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  kptText: {
    fontSize: 14,
    color: colors.foreground,
  },
})
