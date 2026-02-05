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
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, MapPin } from 'lucide-react-native'
import { DatePicker } from '@/components/ui/DatePicker'
import type { ActivityType } from '@/lib/types'
import { activityIconImages } from '@/lib/activityIcons'
import { useActivities } from '@/lib/ActivityContext'
import { useCustomTypes } from '@/lib/CustomTypesContext'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

export default function NewRecordScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ date?: string; id?: string }>()
  const { addActivity, updateActivity, getActivityById } = useActivities()
  const { getEnabledTypes } = useCustomTypes()
  const colors = useColors()
  const { isDark } = useTheme()
  const styles = createStyles(colors, isDark)

  // Edit mode detection
  const isEditMode = !!params.id
  const existingActivity = isEditMode ? getActivityById(params.id!) : null

  // 활성화된 활동 유형 가져오기
  const activityTypes = getEnabledTypes().map(type => ({
    type: type.id as ActivityType,
    label: type.label,
    iconName: type.iconName,
    borderColor: type.borderColor,
    bgColor: type.bgColor,
  }))

  const matchTypes = [
    { value: 'tournament', label: '대회' },
    { value: 'friendly', label: '친선' },
    { value: 'plab', label: '플랩' },
  ]

  const [activityType, setActivityType] = useState<ActivityType>(existingActivity?.type || 'training')
  const [date, setDate] = useState(existingActivity ? new Date(existingActivity.date) : new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [title, setTitle] = useState(existingActivity?.title || '')
  const [location, setLocation] = useState(existingActivity?.location || '')

  // Training fields
  const [trainingTopic, setTrainingTopic] = useState(existingActivity?.trainingTopic || '')
  const [lessonsLearned, setLessonsLearned] = useState(existingActivity?.lessonsLearned || '')
  const [effortScore, setEffortScore] = useState(existingActivity?.effortScore || 3)
  const [kptKeep, setKptKeep] = useState(existingActivity?.kpt?.keep || '')
  const [kptProblem, setKptProblem] = useState(existingActivity?.kpt?.problem || '')
  const [kptTry, setKptTry] = useState(existingActivity?.kpt?.try || '')

  // Match fields
  const [matchType, setMatchType] = useState(existingActivity?.matchType || 'plab')
  const [result, setResult] = useState<'win' | 'lose' | 'draw'>(existingActivity?.result || 'win')
  const [teamScore, setTeamScore] = useState(existingActivity?.score?.team || 0)
  const [opponentScore, setOpponentScore] = useState(existingActivity?.score?.opponent || 0)
  const [goals, setGoals] = useState(existingActivity?.personalStats?.goals || 0)
  const [assists, setAssists] = useState(existingActivity?.personalStats?.assists || 0)
  const [goodPoints, setGoodPoints] = useState(existingActivity?.goodPoints || '')
  const [badPoints, setBadPoints] = useState(existingActivity?.badPoints || '')
  const [tacticalNotes, setTacticalNotes] = useState(existingActivity?.tacticalNotes || '')
  const [videoUrl, setVideoUrl] = useState(existingActivity?.videoUrl || '')

  useEffect(() => {
    if (!isEditMode && params.date) {
      setDate(new Date(params.date))
    }
  }, [params.date, isEditMode])

  const handleSubmit = async () => {
    const logPrefix = isEditMode ? '[EDIT RECORD]' : '[NEW RECORD]'
    console.log(`${logPrefix} Submit started`)
    console.log(`${logPrefix} Title:`, title)
    console.log(`${logPrefix} Activity Type:`, activityType)
    console.log(`${logPrefix} Date:`, date.toISOString().split('T')[0])

    // Validation
    if (!title.trim()) {
      console.error(`${logPrefix} Validation failed: No title`)
      Alert.alert('오류', '제목을 입력해주세요.')
      return
    }

    try {
      const activityData: any = {
        type: activityType,
        date: date.toISOString().split('T')[0],
        title,
        location: location || undefined,
      }

      // Add training-specific fields
      if (activityType === 'training' || activityType === 'lesson' || activityType === 'other') {
        if (trainingTopic) activityData.trainingTopic = trainingTopic
        if (lessonsLearned) activityData.lessonsLearned = lessonsLearned
        if (effortScore) activityData.effortScore = effortScore
        if (kptKeep || kptProblem || kptTry) {
          activityData.kpt = {
            keep: kptKeep,
            problem: kptProblem,
            try: kptTry,
          }
        }
      }

      // Add match-specific fields
      if (activityType === 'match' || activityType === 'plab' || activityType === 'teamkakao') {
        activityData.matchType = matchType
        activityData.result = result
        activityData.score = { team: teamScore, opponent: opponentScore }
        activityData.personalStats = { goals, assists }
        if (goodPoints) activityData.goodPoints = goodPoints
        if (badPoints) activityData.badPoints = badPoints
        if (tacticalNotes) activityData.tacticalNotes = tacticalNotes
        if (videoUrl) activityData.videoUrl = videoUrl
      }

      console.log(`${logPrefix} Activity data prepared:`, activityData)

      if (isEditMode) {
        console.log(`${logPrefix} Calling updateActivity...`)
        await updateActivity(params.id!, activityData)
        console.log(`${logPrefix} Activity updated successfully!`)
      } else {
        console.log(`${logPrefix} Calling addActivity...`)
        await addActivity(activityData)
        console.log(`${logPrefix} Activity added successfully!`)
      }

      // Use setTimeout to ensure the success message appears
      setTimeout(() => {
        router.back()
      }, 100)

      if (Platform.OS === 'web') {
        console.log(`${logPrefix} ✅ 기록이 ${isEditMode ? '수정' : '저장'}되었습니다!`)
      } else {
        Alert.alert('성공', `기록이 ${isEditMode ? '수정' : '저장'}되었습니다.`, [
          { text: '확인', onPress: () => router.back() }
        ])
      }
    } catch (error) {
      console.error(`${logPrefix} Failed to save activity:`, error)
      Alert.alert('오류', `기록을 ${isEditMode ? '수정' : '저장'}하는데 실패했습니다.`)
    }
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
          <Text style={styles.headerTitle}>{isEditMode ? '기록 수정' : '기록 추가'}</Text>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    <Image source={activityIconImages[item.iconName]} style={styles.activityTypeIcon} />
                    <Text style={styles.activityTypeLabel}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
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
          {(activityType === 'training' || activityType === 'lesson' || activityType === 'other') && (
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

              {/* Video for Training */}
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
                  <Text style={[styles.fieldLabel, { fontSize: 12, marginTop: 8 }]}>
                    💡 영상을 첨부하면 타임라인 댓글로 궁금한 점을 기록할 수 있습니다
                  </Text>
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
            <Text style={styles.submitButtonText}>{isEditMode ? '수정 완료' : '기록 저장'}</Text>
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
    minWidth: 100,
    alignItems: 'center',
    padding: 12,
    borderRadius: StyleConstants.borderRadius.button,
    borderWidth: 2,
  },
  activityTypeIcon: {
    width: 64,
    height: 64,
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
