import React, { useState, useMemo, useCallback, useRef } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { Calendar, ActivityCard, FloatingButton } from '@/components/futsal'
import { BottomSheetWrapper, type BottomSheetWrapperRef } from '@/components/ui/BottomSheetWrapper'
import { mockActivities, mockMonthlyStats } from '@/lib/mock-data'
import { useColors, useTheme } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

export default function HomeScreen() {
  const router = useRouter()
  const colors = useColors()
  const { isDark } = useTheme()
  const styles = createStyles(colors, isDark)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null)

  const selectedActivities = useMemo(() => {
    if (!selectedDate) return []
    return mockActivities.filter((a) => a.date === selectedDate)
  }, [selectedDate])

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate((prev) => {
      const newDate = date === prev ? null : date
      if (newDate) {
        bottomSheetRef.current?.expand()
      } else {
        bottomSheetRef.current?.close()
      }
      return newDate
    })
  }, [])

  const handleDateLongPress = useCallback((date: string) => {
    router.push(`/record/new?date=${date}`)
  }, [router])

  const handleCloseSheet = useCallback(() => {
    setSelectedDate(null)
    bottomSheetRef.current?.close()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    return `${month}월 ${day}일 (${weekday})`
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitleAccent}>Futsal</Text> Log
          </Text>
          <Text style={styles.headerSubtitle}>나의 풋살 성장 기록</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {mockMonthlyStats.totalGoals}
            </Text>
            <Text style={styles.statLabel}>득점</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {mockMonthlyStats.totalAssists}
            </Text>
            <Text style={styles.statLabel}>도움</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {mockMonthlyStats.totalActivities}
            </Text>
            <Text style={styles.statLabel}>활동</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Calendar
          activities={mockActivities}
          onDateSelect={handleDateSelect}
          onDateLongPress={handleDateLongPress}
          selectedDate={selectedDate}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingButton href="/record/new" />

      {/* Bottom Sheet for selected date */}
      <BottomSheetWrapper
        ref={bottomSheetRef}
        snapPoints={['50%']}
        onClose={() => setSelectedDate(null)}
        scrollable
      >
        {selectedDate && (
          <>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{formatDate(selectedDate)}</Text>
              <Pressable onPress={handleCloseSheet} style={styles.closeButton}>
                <X color={colors.foreground} size={20} />
              </Pressable>
            </View>

            <View style={styles.sheetContent}>
              {selectedActivities.length > 0 ? (
                <View style={styles.activitiesList}>
                  {selectedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>이 날의 기록이 없습니다</Text>
                  <Pressable
                    style={styles.addButton}
                    onPress={() => handleDateLongPress(selectedDate)}
                  >
                    <Text style={styles.addButtonText}>기록 추가하기</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}
      </BottomSheetWrapper>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerTitleAccent: {
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  statLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    padding: 16,
  },
  activitiesList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: StyleConstants.borderRadius.button,
    ...StyleConstants.shadow.light,
  },
  addButtonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
})
