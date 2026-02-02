import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, Palette, Bell, Shield, ChevronRight, Sun, Moon } from 'lucide-react-native'
import type { ActivityType } from '@/lib/types'
import { activityIconImages, activityTypeLabels } from '@/lib/activityIcons'
import { useTheme, useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

interface CustomIcon {
  type: ActivityType
  label: string
}

const defaultIcons: CustomIcon[] = [
  { type: 'training', label: '훈련' },
  { type: 'match', label: '경기' },
  { type: 'plab', label: '플랩' },
  { type: 'other', label: '뒷연습' },
  { type: 'teamkakao', label: '팀카카오' },
  { type: 'lesson', label: '개인레슨' },
]

export default function SettingsScreen() {
  const { colorScheme, setColorScheme, isDark } = useTheme()
  const colors = useColors()
  const styles = createStyles(colors)

  const [nickname, setNickname] = useState('풋살러')
  const [team, setTeam] = useState('FC 동호회')
  const [icons] = useState(defaultIcons)
  const [notifications, setNotifications] = useState({
    mentions: true,
    comments: true,
    reminders: false,
  })

  const handleSave = () => {
    console.log('[RN] Saving settings:', { nickname, team, icons, notifications })
  }

  const handleDarkModeToggle = (value: boolean) => {
    if (colorScheme === 'system') {
      // 시스템 설정 따르기가 켜져 있으면 끄고 수동으로 설정
      setColorScheme(value ? 'dark' : 'light')
    } else {
      setColorScheme(value ? 'dark' : 'light')
    }
  }

  const handleSystemThemeToggle = (value: boolean) => {
    if (value) {
      setColorScheme('system')
    } else {
      // 시스템 설정 따르기를 끄면 현재 테마 유지
      setColorScheme(isDark ? 'dark' : 'light')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${colors.primary}20` }]}>
              <User color={colors.primary} size={20} />
            </View>
            <Text style={styles.cardTitle}>프로필</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>닉네임</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>소속 팀</Text>
            <TextInput
              style={styles.input}
              value={team}
              onChangeText={setTeam}
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>

        {/* Icon Customization */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${colors.secondary}20` }]}>
              <Palette color={colors.secondary} size={20} />
            </View>
            <Text style={styles.cardTitle}>아이콘 커스터마이징</Text>
          </View>

          <Text style={styles.helpText}>
            캘린더에 표시될 활동 아이콘입니다
          </Text>

          {icons.map((icon) => (
            <View key={icon.type} style={styles.iconRow}>
              <View style={styles.iconRowLeft}>
                <Image source={activityIconImages[icon.type]} style={styles.iconImage} />
                <Text style={styles.iconLabel}>{icon.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#FF950020' }]}>
              <Bell color="#FF9500" size={20} />
            </View>
            <Text style={styles.cardTitle}>알림 설정</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchRowText}>
              <Text style={styles.switchLabel}>멘션 알림</Text>
              <Text style={styles.switchDescription}>누군가 나를 멘션했을 때 알림</Text>
            </View>
            <Switch
              value={notifications.mentions}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, mentions: value }))
              }
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.foreground}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchRowText}>
              <Text style={styles.switchLabel}>댓글 알림</Text>
              <Text style={styles.switchDescription}>내 영상에 새 댓글이 달렸을 때</Text>
            </View>
            <Switch
              value={notifications.comments}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, comments: value }))
              }
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.foreground}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchRowText}>
              <Text style={styles.switchLabel}>훈련 리마인더</Text>
              <Text style={styles.switchDescription}>정기 훈련 일정 알림</Text>
            </View>
            <Switch
              value={notifications.reminders}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, reminders: value }))
              }
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.foreground}
            />
          </View>
        </View>

        {/* Display Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#6366F120' : '#F59E0B20' }]}>
              {isDark ? (
                <Moon color="#6366F1" size={20} />
              ) : (
                <Sun color="#F59E0B" size={20} />
              )}
            </View>
            <Text style={styles.cardTitle}>화면 설정</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchRowText}>
              <Text style={styles.switchLabel}>다크 모드</Text>
              <Text style={styles.switchDescription}>
                {isDark ? '다크 모드 사용 중' : '라이트 모드 사용 중'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.foreground}
              disabled={colorScheme === 'system'}
            />
          </View>

          <Pressable
            style={styles.optionRow}
            onPress={() => handleSystemThemeToggle(colorScheme !== 'system')}
          >
            <View style={styles.switchRowText}>
              <Text style={styles.switchLabel}>시스템 설정 따르기</Text>
              <Text style={styles.switchDescription}>
                기기의 다크모드 설정을 따릅니다
              </Text>
            </View>
            <View style={[
              styles.checkBox,
              colorScheme === 'system' && styles.checkBoxChecked
            ]}>
              {colorScheme === 'system' && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </View>
          </Pressable>
        </View>

        {/* Privacy */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
              <Shield color={colors.mutedForeground} size={20} />
            </View>
            <Text style={styles.cardTitle}>개인정보</Text>
          </View>

          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>이용약관</Text>
            <ChevronRight color={colors.mutedForeground} size={16} />
          </Pressable>

          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>개인정보처리방침</Text>
            <ChevronRight color={colors.mutedForeground} size={16} />
          </Pressable>

          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>데이터 내보내기</Text>
            <ChevronRight color={colors.mutedForeground} size={16} />
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>
            <Text style={{ color: colors.primary }}>Futsal</Text> Log
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>기록하고, 분석하고, 성장하자</Text>
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: StyleConstants.borderRadius.card,
    padding: 16,
    marginBottom: 16,
    ...StyleConstants.shadow.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
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
  helpText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  iconRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconImage: {
    width: 96,
    height: 96,
  },
  iconLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchRowText: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: colors.primaryForeground,
    fontSize: 14,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 14,
    color: colors.foreground,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  appTagline: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: StyleConstants.borderRadius.button,
    paddingVertical: 16,
    alignItems: 'center',
    ...StyleConstants.shadow.light,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})
