import React, { useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Trophy, Target, Activity, TrendingUp } from 'lucide-react-native'
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts'
import { mockActivities } from '@/lib/mock-data'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

export default function StatsScreen() {
  const colors = useColors()
  const { isDark } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const styles = createStyles(colors, isDark, screenWidth)

  // 파스텔 차트 색상
  const CHART_COLORS = {
    primary: colors.primary,
    secondary: '#93C5FD',        // 파스텔 블루
    training: colors.training,   // 파스텔 옐로
    match: colors.match,         // 파스텔 그린
    plab: colors.plab,           // 파스텔 바이올렛
  }

  const stats = useMemo(() => {
    const trainingActivities = mockActivities.filter((a) => a.type === 'training')
    const matchActivities = mockActivities.filter((a) => a.type === 'match' || a.type === 'plab')

    const totalGoals = matchActivities.reduce(
      (sum, a) => sum + (a.personalStats?.goals || 0),
      0
    )
    const totalAssists = matchActivities.reduce(
      (sum, a) => sum + (a.personalStats?.assists || 0),
      0
    )

    const avgEffort =
      trainingActivities.length > 0
        ? trainingActivities.reduce((sum, a) => sum + (a.effortScore || 0), 0) /
          trainingActivities.length
        : 0

    const wins = matchActivities.filter((a) => a.result === 'win').length
    const draws = matchActivities.filter((a) => a.result === 'draw').length
    const losses = matchActivities.filter((a) => a.result === 'lose').length

    return {
      totalActivities: mockActivities.length,
      trainingCount: trainingActivities.length,
      matchCount: matchActivities.length,
      totalGoals,
      totalAssists,
      avgEffort: avgEffort.toFixed(1),
      wins,
      draws,
      losses,
      winRate: matchActivities.length > 0 ? Math.round((wins / matchActivities.length) * 100) : 0,
    }
  }, [])

  const pieData = useMemo(() => {
    const counts = {
      training: mockActivities.filter((a) => a.type === 'training').length,
      match: mockActivities.filter((a) => a.type === 'match').length,
      plab: mockActivities.filter((a) => a.type === 'plab').length,
    }
    return [
      { value: counts.training, color: CHART_COLORS.training, text: '훈련' },
      { value: counts.match, color: CHART_COLORS.match, text: '경기' },
      { value: counts.plab, color: CHART_COLORS.plab, text: '플랩' },
    ]
  }, [CHART_COLORS])

  const effortData = useMemo(() => {
    const trainingActivities = mockActivities.filter(
      (a) => a.type === 'training' && a.effortScore
    )
    return trainingActivities.map((a) => ({
      value: a.effortScore || 0,
      label: a.date.slice(8),
      dataPointText: String(a.effortScore),
    }))
  }, [])

  const goalsData = useMemo(() => {
    const matchActivities = mockActivities.filter((a) => a.type === 'match' || a.type === 'plab')
    return matchActivities.map((a) => ({
      value: a.personalStats?.goals || 0,
      label: a.date.slice(8),
      frontColor: CHART_COLORS.primary,
    }))
  }, [CHART_COLORS])

  // Clamp chart width for responsive layout
  const chartWidth = Math.min(screenWidth, 480) - 80

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>통계</Text>
        <Text style={styles.headerSubtitle}>2026년 1월 활동 분석</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${colors.primary}20` }]}>
                <Trophy color={colors.primary} size={16} />
              </View>
              <Text style={styles.summaryLabel}>공격 포인트</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.totalGoals + stats.totalAssists}</Text>
            <Text style={styles.summaryMeta}>
              <Text style={{ color: colors.primary }}>{stats.totalGoals}G</Text>
              {' + '}
              <Text style={{ color: CHART_COLORS.secondary }}>{stats.totalAssists}A</Text>
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${CHART_COLORS.secondary}20` }]}>
                <TrendingUp color={CHART_COLORS.secondary} size={16} />
              </View>
              <Text style={styles.summaryLabel}>승률</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.winRate}%</Text>
            <Text style={styles.summaryMeta}>
              {stats.wins}승 {stats.draws}무 {stats.losses}패
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${CHART_COLORS.training}30` }]}>
                <Target color="#D97706" size={16} />
              </View>
              <Text style={styles.summaryLabel}>평균 노력도</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.avgEffort}</Text>
            <Text style={styles.summaryMeta}>5점 만점</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
                <Activity color={colors.mutedForeground} size={16} />
              </View>
              <Text style={styles.summaryLabel}>총 활동</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.totalActivities}</Text>
            <Text style={styles.summaryMeta}>
              훈련 {stats.trainingCount} | 경기 {stats.matchCount}
            </Text>
          </View>
        </View>

        {/* Activity Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>활동 유형 분포</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              donut
              innerRadius={50}
              radius={80}
              innerCircleColor={colors.card}
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={styles.pieCenterValue}>{stats.totalActivities}</Text>
                  <Text style={styles.pieCenterLabel}>활동</Text>
                </View>
              )}
            />
          </View>
          <View style={styles.legend}>
            {pieData.map((item) => (
              <View key={item.text} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.text} ({item.value})
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Effort Score Trend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>노력 점수 추이</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={effortData}
              width={chartWidth}
              height={180}
              color={CHART_COLORS.training}
              thickness={3}
              dataPointsColor={CHART_COLORS.training}
              dataPointsRadius={4}
              maxValue={5}
              noOfSections={5}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              rulesColor={colors.border}
              rulesType="dashed"
              yAxisColor="transparent"
              xAxisColor="transparent"
              hideDataPoints={false}
              curved
            />
          </View>
        </View>

        {/* Goals & Assists per Match */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>경기별 공격 포인트</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={goalsData}
              width={chartWidth}
              height={180}
              barWidth={20}
              spacing={24}
              noOfSections={4}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              rulesColor={colors.border}
              rulesType="dashed"
              yAxisColor="transparent"
              xAxisColor="transparent"
              barBorderRadius={8}
              frontColor={CHART_COLORS.primary}
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: CHART_COLORS.primary }]} />
              <Text style={styles.legendText}>득점</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: CHART_COLORS.secondary }]} />
              <Text style={styles.legendText}>도움</Text>
            </View>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>이번 달 하이라이트</Text>

          <View style={[styles.highlightItem, { backgroundColor: `${colors.win}15`, borderColor: `${colors.win}30` }]}>
            <Text style={[styles.highlightLabel, { color: colors.win }]}>최고 성적</Text>
            <Text style={styles.highlightText}>사내 대회 준결승 진출 - 1골 2도움</Text>
          </View>

          <View style={[styles.highlightItem, { backgroundColor: `${CHART_COLORS.secondary}15`, borderColor: `${CHART_COLORS.secondary}30` }]}>
            <Text style={[styles.highlightLabel, { color: CHART_COLORS.secondary }]}>성장 포인트</Text>
            <Text style={styles.highlightText}>왼발 슈팅 정확도 향상 - 훈련 효과 확인</Text>
          </View>

          <View style={[styles.highlightItem, { backgroundColor: `${CHART_COLORS.training}30`, borderColor: `${CHART_COLORS.training}60` }]}>
            <Text style={[styles.highlightLabel, { color: '#D97706' }]}>개선 필요</Text>
            <Text style={styles.highlightText}>후반 체력 저하 - 인터벌 트레이닝 필요</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors, isDark: boolean, screenWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    width: (Math.min(screenWidth, 480) - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: StyleConstants.borderRadius.card,
    padding: 16,
    ...(isDark ? StyleConstants.shadow.dark : StyleConstants.shadow.light),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  summaryMeta: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: StyleConstants.borderRadius.card,
    padding: 16,
    marginBottom: 16,
    ...(isDark ? StyleConstants.shadow.dark : StyleConstants.shadow.light),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
  },
  pieCenterLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  axisText: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  highlightItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: colors.foreground,
  },
})
