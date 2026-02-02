import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import type { Activity, ActivityType } from '@/lib/types'
import { activityIconImages, activityTypeLabels } from '@/lib/activityIcons'
import { useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface CalendarProps {
  activities: Activity[]
  onDateSelect: (date: string) => void
  onDateLongPress: (date: string) => void
  selectedDate: string | null
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

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

  const rows = useMemo((): DayItem[][] => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const allItems: DayItem[] = []

    for (let i = 0; i < firstDay; i++) {
      allItems.push({ type: 'empty', key: `empty-${i}` })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      allItems.push({
        type: 'day',
        key: dateStr,
        day,
        dateStr,
        activities: activitiesByDate[dateStr] || [],
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      })
    }

    // 마지막 행을 7의 배수로 패딩
    const remainder = allItems.length % 7
    if (remainder > 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        allItems.push({ type: 'empty', key: `empty-end-${i}` })
      }
    }

    // 7개씩 행으로 분할
    const result: DayItem[][] = []
    for (let i = 0; i < allItems.length; i += 7) {
      result.push(allItems.slice(i, i + 7))
    }
    return result
  }, [year, month, activitiesByDate, todayStr, selectedDate])

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1))
  }, [year, month])

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1))
  }, [year, month])

  const renderDayCell = (item: DayItem) => {
    if (item.type === 'empty') {
      return <View key={item.key} style={styles.dayCell} />
    }

    const uniqueTypes = [...new Set(item.activities?.map((a) => a.type) || [])]
    const hasActivity = uniqueTypes.length > 0
    const hasMatchOrPlab = uniqueTypes.includes('match') || uniqueTypes.includes('plab')
    const hasOther = uniqueTypes.includes('other')

    return (
      <Pressable
        key={item.key}
        onPress={() => onDateSelect(item.dateStr!)}
        onLongPress={() => onDateLongPress(item.dateStr!)}
        delayLongPress={500}
        style={({ pressed }) => [
          styles.dayCell,
          styles.dayButton,
          hasActivity && { backgroundColor: `${colors.primary}10` },
          hasOther && { backgroundColor: '#FFFEF8' },
          hasMatchOrPlab && { backgroundColor: '#FFF8FC' },
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
              <Image
                key={type}
                source={activityIconImages[type]}
                style={styles.activityIcon}
              />
            ))}
            {uniqueTypes.length > 2 && (
              <Text style={styles.moreText}>+{uniqueTypes.length - 2}</Text>
            )}
          </View>
        )}
      </Pressable>
    )
  }

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
      <View style={styles.row}>
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
      {rows.map((rowItems, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {rowItems.map(renderDayCell)}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        {(Object.keys(activityIconImages) as ActivityType[]).map((type, index, arr) => (
          <React.Fragment key={type}>
            <View style={styles.legendItem}>
              <Text style={styles.legendText}>
                {activityTypeLabels[type]}
              </Text>
              <Image source={activityIconImages[type]} style={styles.legendIcon} />
            </View>
            {index < arr.length - 1 && (
              <Text style={styles.legendDivider}>|</Text>
            )}
          </React.Fragment>
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
  row: {
    flexDirection: 'row',
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
  dayCell: {
    flex: 1,
    height: 92,
    alignItems: 'center',
    padding: 4,
    margin: 2,
  },
  dayButton: {
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
    width: 60,
    height: 60,
  },
  moreText: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendIcon: {
    width: 48,
    height: 48,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  legendDivider: {
    fontSize: 16,
    color: colors.border,
  },
})
