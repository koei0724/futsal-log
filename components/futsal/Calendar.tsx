import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import type { Activity, ActivityType } from '@/lib/types'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface CalendarProps {
  activities: Activity[]
  onDateSelect: (date: string) => void
  onDateLongPress: (date: string) => void
  selectedDate: string | null
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const activityIcons: Record<ActivityType, string> = {
  training: '⚽',
  match: '🏆',
  plab: '🔥',
  other: '📝',
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

interface DayItem {
  type: 'empty' | 'day'
  key: string
  day?: number
  dateStr?: string
  activities?: Activity[]
  isToday?: boolean
  isSelected?: boolean
}

export function Calendar({
  activities,
  onDateSelect,
  onDateLongPress,
  selectedDate,
}: CalendarProps) {
  const colors = useColors()
  const styles = createStyles(colors)
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const activitiesByDate = useMemo(() => {
    const map: Record<string, Activity[]> = {}
    activities.forEach((activity) => {
      if (!map[activity.date]) {
        map[activity.date] = []
      }
      map[activity.date].push(activity)
    })
    return map
  }, [activities])

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const days = useMemo((): DayItem[] => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const items: DayItem[] = []

    for (let i = 0; i < firstDay; i++) {
      items.push({ type: 'empty', key: `empty-${i}` })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      items.push({
        type: 'day',
        key: dateStr,
        day,
        dateStr,
        activities: activitiesByDate[dateStr] || [],
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      })
    }

    return items
  }, [year, month, activitiesByDate, todayStr, selectedDate])

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1))
  }, [year, month])

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1))
  }, [year, month])

  const renderDay = useCallback(
    ({ item }: { item: DayItem }) => {
      if (item.type === 'empty') {
        return <View style={styles.emptyDay} />
      }

      const uniqueTypes = [...new Set(item.activities?.map((a) => a.type) || [])]

      return (
        <Pressable
          onPress={() => onDateSelect(item.dateStr!)}
          onLongPress={() => onDateLongPress(item.dateStr!)}
          delayLongPress={500}
          style={({ pressed }) => [
            styles.dayButton,
            item.isToday && styles.todayBorder,
            item.isSelected && styles.selectedDay,
            pressed && styles.pressedDay,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              item.isToday && styles.todayText,
            ]}
          >
            {item.day}
          </Text>

          {uniqueTypes.length > 0 && (
            <View style={styles.iconsContainer}>
              {uniqueTypes.slice(0, 2).map((type) => (
                <Text key={type} style={styles.activityIcon}>
                  {activityIcons[type]}
                </Text>
              ))}
              {uniqueTypes.length > 2 && (
                <Text style={styles.moreText}>+{uniqueTypes.length - 2}</Text>
              )}
            </View>
          )}
        </Pressable>
      )
    },
    [onDateSelect, onDateLongPress, styles]
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft color={colors.foreground} size={20} />
        </Pressable>

        <Text style={styles.headerTitle}>
          {year}년 {month + 1}월
        </Text>

        <Pressable onPress={nextMonth} style={styles.navButton}>
          <ChevronRight color={colors.foreground} size={20} />
        </Pressable>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day, index) => (
          <View key={day} style={styles.weekdayCell}>
            <Text
              style={[
                styles.weekdayText,
                index === 0 && { color: colors.sunday },
                index === 6 && { color: colors.saturday },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <FlatList
        data={days}
        renderItem={renderDay}
        keyExtractor={(item) => item.key}
        numColumns={7}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
      />

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(activityIcons).map(([type, icon]) => (
          <View key={type} style={styles.legendItem}>
            <Text style={styles.legendIcon}>{icon}</Text>
            <Text style={styles.legendText}>
              {type === 'training'
                ? '훈련'
                : type === 'match'
                  ? '경기'
                  : type === 'plab'
                    ? '플랩'
                    : '기타'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  row: {
    gap: 4,
  },
  emptyDay: {
    flex: 1,
    height: 72,
  },
  dayButton: {
    flex: 1,
    height: 72,
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectedDay: {
    backgroundColor: colors.muted,
  },
  pressedDay: {
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    marginTop: 2,
  },
  activityIcon: {
    fontSize: 20,
  },
  moreText: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendIcon: {
    fontSize: 20,
  },
  legendText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
})
