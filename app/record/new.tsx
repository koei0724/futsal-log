import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, MapPin } from 'lucide-react-native'
import { DatePicker } from '@/components/ui/DatePicker'
import type { ActivityType } from '@/lib/types'
import { activityIconImages } from '@/lib/activityIcons'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

export default function NewRecordScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ date?: string }>()
  const colors = useColors()
  const { isDark } = useTheme()
  const styles = createStyles(colors, isDark)

  // 활동 유형별 배경색/테두리: 블루 / 핑크 / 옐로
  const activityTypes: { type: ActivityType; label: string; borderColor: string; bgColor: string }[] = [
    { type: 'training', label: '훈련', borderColor: '#93C5FD', bgColor: '#93C5FD18' },
    { type: 'match', label: '경기', borderColor: '#F9A8D4', bgColor: '#FFF8FC' },
    { type: 'plab', label: '플랩', borderColor: '#F9A8D4', bgColor: '#FFF8FC' },
    { type: 'other', label: '뒷연습', borderColor: '#FDE68A', bgColor: '#FFFEF8' },
    { type: 'teamkakao', label: '팀카카오', borderColor: '#93C5FD', bgColor: '#93C5FD18' },
    { type: 'lesson', label: '개인레슨', borderColor: '#93C5FD', bgColor: '#93C5FD18' },
  ]

  const matchTypes = [
    { value: 'tournament', label: '대회' },
    { value: 'friendly', label: '친선' },
    { value: 'plab', label: '플랩' },
  ]

  const [activityType, setActivityType] = useState<ActivityType>('training')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')

  // Training fields
  const [trainingTopic, setTrainingTopic] = useState('')
  const [lessonsLearned, setLessonsLearned] = useState('')
  const [effortScore, setEffortScore] = useState(3)
  const [kptKeep, setKptKeep] = useState('')
  const [kptProblem, setKptProblem] = useState('')
  const [kptTry, setKptTry] = useState('')

  // Match fields
  const [matchType, setMatchType] = useState('plab')
  const [result, setResult] = useState<'win' | 'lose' | 'draw'>('win')
  const [teamScore, setTeamScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [goals, setGoals] = useState(0)
  const [assists, setAssists] = useState(0)
  const [goodPoints, setGoodPoints] = useState('')
  const [badPoints, setBadPoints] = useState('')
  const [tacticalNotes, setTacticalNotes] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (params.date) {
      setDate(new Date(params.date))
    }
  }, [params.date])

  const handleSubmit = () => {
    console.log('[RN] Submitting record:', {
      activityType,
      date: date.toISOString().split('T')[0],
      title,
      location,
      trainingTopic,
      lessonsLearned,
      effortScore,
      kpt: { keep: kptKeep, problem: kptProblem, try: kptTry },
      matchType,
      result,
      score: { team: teamScore, opponent: opponentScore },
      personalStats: { goals, assists },
      goodPoints,
      badPoints,
      tacticalNotes,
      videoUrl,
    })
    router.back()
  }

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  // On web, use a plain View instead of KeyboardAvoidingView
  const ContentWrapper = Platform.OS === 'web' ? View : require('react-native').KeyboardAvoidingView

  const contentWrapperProps = Platform.OS === 'web'
    ? { style: { flex: 1 } }
    : { behavior: Platform.OS === 'ios' ? 'padding' as const : 'height' as const, style: { flex: 1 } }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ContentWrapper {...contentWrapperProps}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={colors.foreground} size={20} />
          </Pressable>
          <Text style={styles.headerTitle}>기록 추가</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Activity Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>활동 유형</Text>
            <View style={styles.activityTypes}>
              {activityTypes.map((item) => (
                <Pressable
                  key={item.type}
                  onPress={() => setActivityType(item.type)}
                  style={[
                    styles.activityTypeButton,
                    activityType === item.type
                      ? { borderColor: item.borderColor, backgroundColor: item.bgColor }
                      : { borderColor: colors.border, backgroundColor: colors.card },
                  ]}
                >
                  <Image source={activityIconImages[item.type]} style={styles.activityTypeIcon} />
                  <Text style={styles.activityTypeLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>기본 정보</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>날짜</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </Pressable>
              {showDatePicker && (
                <DatePicker
                  value={date}
                  onChange={(selectedDate) => {
                    setDate(selectedDate)
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>제목</Text>
              <TextInput
                style={styles.input}
                placeholder="활동 제목을 입력하세요"
                placeholderTextColor={colors.mutedForeground}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>장소</Text>
              <View style={styles.inputWithIcon}>
                <MapPin color={colors.mutedForeground} size={16} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  placeholder="장소를 입력하세요"
                  placeholderTextColor={colors.mutedForeground}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>
          </View>

          {/* Training Mode Fields */}
          {activityType === 'training' && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>훈련 내용</Text>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>훈련 주제</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="오늘의 훈련 주제"
                    placeholderTextColor={colors.mutedForeground}
                    value={trainingTopic}
                    onChangeText={setTrainingTopic}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>배운 내용</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="오늘 배운 점을 기록하세요"
                    placeholderTextColor={colors.mutedForeground}
                    value={lessonsLearned}
                    onChangeText={setLessonsLearned}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    노력 점수: <Text style={{ color: colors.primary }}>{effortScore}</Text>
                  </Text>
                  <View style={styles.scoreButtons}>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Pressable
                        key={score}
                        onPress={() => setEffortScore(score)}
                        style={[
                          styles.scoreButton,
                          score <= effortScore
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: colors.muted, borderColor: colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scoreButtonText,
                            { color: score <= effortScore ? colors.primaryForeground : colors.mutedForeground },
                          ]}
                        >
                          {score}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* KPT Review */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>KPT 회고</Text>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.win }]}>Keep (유지)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="계속 유지할 점"
                    placeholderTextColor={colors.mutedForeground}
                    value={kptKeep}
                    onChangeText={setKptKeep}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.lose }]}>Problem (문제)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="개선이 필요한 점"
                    placeholderTextColor={colors.mutedForeground}
                    value={kptProblem}
                    onChangeText={setKptProblem}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.saturday }]}>Try (시도)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="다음에 시도할 점"
                    placeholderTextColor={colors.mutedForeground}
                    value={kptTry}
                    onChangeText={setKptTry}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </>
          )}

          {/* Match/Plab Mode Fields */}
          {(activityType === 'match' || activityType === 'plab') && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>경기 정보</Text>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>경기 종류</Text>
                  <View style={styles.optionButtons}>
                    {matchTypes.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => setMatchType(option.value)}
                        style={[
                          styles.optionButton,
                          matchType === option.value
                            ? { borderColor: colors.primary, backgroundColor: `${colors.primary}20` }
                            : { borderColor: colors.border, backgroundColor: colors.muted },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            { color: matchType === option.value ? colors.primary : colors.mutedForeground },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>경기 결과</Text>
                  <View style={styles.optionButtons}>
                    {[
                      { value: 'win' as const, label: '승리', color: colors.win },
                      { value: 'draw' as const, label: '무승부', color: colors.draw },
                      { value: 'lose' as const, label: '패배', color: colors.lose },
                    ].map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => setResult(option.value)}
                        style={[
                          styles.optionButton,
                          result === option.value
                            ? { borderColor: option.color, backgroundColor: `${option.color}20` }
                            : { borderColor: colors.border, backgroundColor: colors.muted },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            { color: result === option.value ? option.color : colors.mutedForeground },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>스코어</Text>
                  <View style={styles.scoreContainer}>
                    <View style={styles.scoreTeam}>
                      <Text style={styles.teamLabel}>우리팀</Text>
                      <View style={styles.counterRow}>
                        <Pressable
                          onPress={() => setTeamScore(Math.max(0, teamScore - 1))}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterButtonText}>-</Text>
                        </Pressable>
                        <Text style={[styles.counterValue, { color: colors.primary }]}>{teamScore}</Text>
                        <Pressable
                          onPress={() => setTeamScore(teamScore + 1)}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>

                    <Text style={styles.scoreSeparator}>:</Text>

                    <View style={styles.scoreTeam}>
                      <Text style={styles.teamLabel}>상대팀</Text>
                      <View style={styles.counterRow}>
                        <Pressable
                          onPress={() => setOpponentScore(Math.max(0, opponentScore - 1))}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterButtonText}>-</Text>
                        </Pressable>
                        <Text style={styles.counterValue}>{opponentScore}</Text>
                        <Pressable
                          onPress={() => setOpponentScore(opponentScore + 1)}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Personal Stats */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>개인 기록</Text>

                <View style={styles.statsGrid}>
                  <View style={styles.statField}>
                    <Text style={styles.fieldLabel}>득점</Text>
                    <View style={styles.counterRow}>
                      <Pressable
                        onPress={() => setGoals(Math.max(0, goals - 1))}
                        style={styles.counterButton}
                      >
                        <Text style={styles.counterButtonText}>-</Text>
                      </Pressable>
                      <Text style={[styles.bigCounterValue, { color: colors.primary }]}>{goals}</Text>
                      <Pressable
                        onPress={() => setGoals(goals + 1)}
                        style={styles.counterButton}
                      >
                        <Text style={styles.counterButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.statField}>
                    <Text style={styles.fieldLabel}>도움</Text>
                    <View style={styles.counterRow}>
                      <Pressable
                        onPress={() => setAssists(Math.max(0, assists - 1))}
                        style={styles.counterButton}
                      >
                        <Text style={styles.counterButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.bigCounterValue}>{assists}</Text>
                      <Pressable
                        onPress={() => setAssists(assists + 1)}
                        style={styles.counterButton}
                      >
                        <Text style={styles.counterButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

              {/* Review */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>경기 회고</Text>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.win }]}>잘한 점</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="경기에서 잘한 점"
                    placeholderTextColor={colors.mutedForeground}
                    value={goodPoints}
                    onChangeText={setGoodPoints}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.lose }]}>아쉬운 점</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="개선이 필요한 점"
                    placeholderTextColor={colors.mutedForeground}
                    value={badPoints}
                    onChangeText={setBadPoints}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.saturday }]}>전술 노트</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="포메이션, 역할 등 전술적인 내용"
                    placeholderTextColor={colors.mutedForeground}
                    value={tacticalNotes}
                    onChangeText={setTacticalNotes}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Video */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>영상 첨부</Text>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>YouTube/Vimeo 링크</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://youtube.com/watch?v=..."
                    placeholderTextColor={colors.mutedForeground}
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              </View>
            </>
          )}

          {/* Submit Button */}
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>기록 저장</Text>
          </Pressable>
        </ScrollView>
      </ContentWrapper>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  activityTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  activityTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: StyleConstants.borderRadius.button,
    borderWidth: 2,
  },
  activityTypeIcon: {
    width: 84,
    height: 84,
    marginBottom: 4,
  },
  activityTypeLabel: {
    fontSize: 12,
    color: colors.foreground,
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
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.muted,
    borderRadius: StyleConstants.borderRadius.input,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    backgroundColor: colors.muted,
    borderRadius: StyleConstants.borderRadius.input,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.foreground,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  dateButton: {
    backgroundColor: colors.muted,
    borderRadius: StyleConstants.borderRadius.input,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.foreground,
  },
  scoreButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scoreTeam: {
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
    width: 32,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statField: {
    flex: 1,
  },
  bigCounterValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
    width: 48,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: StyleConstants.borderRadius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...StyleConstants.shadow.light,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})
