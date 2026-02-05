import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { User, Palette, Bell, Shield, ChevronRight, Sun, Moon, Plus, Edit2, Trash2, X, Camera } from 'lucide-react-native'
import type { ActivityType, CustomActivityType, IconName, RecordType } from '@/lib/types'
import { activityIconImages, activityTypeLabels } from '@/lib/activityIcons'
import { useCustomTypes } from '@/lib/CustomTypesContext'
import { useTheme, useColors } from '@/lib/ThemeContext'
import { StyleConstants, type ThemeColors } from '@/constants/Colors'

const SETTINGS_STORAGE_KEY = '@futsal_log:settings'
const CUSTOM_TYPES_STORAGE_KEY = '@futsal_log:custom_types'

// 기본 활동 유형 정의
const defaultActivityTypes: CustomActivityType[] = [
  { id: 'training', label: '훈련', iconName: 'training', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'training' },
  { id: 'match', label: '경기', iconName: 'match', borderColor: '#F9A8D4', bgColor: '#FFF8FC', enabled: true, recordType: 'match' },
  { id: 'plab', label: '플랩', iconName: 'plab', borderColor: '#F9A8D4', bgColor: '#FFF8FC', enabled: true, recordType: 'match' },
  { id: 'other', label: '뒷연습', iconName: 'other', borderColor: '#FDE68A', bgColor: '#FFFEF8', enabled: true, recordType: 'training' },
  { id: 'teamkakao', label: '팀카카오', iconName: 'teamkakao', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'match' },
  { id: 'lesson', label: '개인레슨', iconName: 'lesson', borderColor: '#93C5FD', bgColor: '#93C5FD18', enabled: true, recordType: 'training' },
]

// 사용 가능한 아이콘 목록
const availableIcons = [
  { name: 'training', label: '훈련' },
  { name: 'match', label: '경기' },
  { name: 'plab', label: '플랩' },
  { name: 'other', label: '뒷연습' },
  { name: 'teamkakao', label: '팀카카오' },
  { name: 'lesson', label: '개인레슨' },
  { name: 'icon1', label: '1번' },
  { name: 'icon2', label: '2번' },
  { name: 'icon3', label: '3번' },
  { name: 'ball', label: '공' },
  { name: 'clap', label: '박수' },
  { name: 'flag', label: '깃발' },
] as const

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
  const { refreshTypes } = useCustomTypes()
  const colors = useColors()
  const styles = createStyles(colors)

  const [nickname, setNickname] = useState('풋살러')
  const [team, setTeam] = useState('FC 동호회')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [icons] = useState(defaultIcons)
  const [notifications, setNotifications] = useState({
    mentions: true,
    comments: true,
    reminders: false,
  })
  const [customActivityTypes, setCustomActivityTypes] = useState<CustomActivityType[]>(defaultActivityTypes)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)
  const [editingType, setEditingType] = useState<CustomActivityType | null>(null)
  const [newTypeLabel, setNewTypeLabel] = useState('')
  const [newTypeIconName, setNewTypeIconName] = useState<IconName>('training')
  const [newTypeBorderColor, setNewTypeBorderColor] = useState('#93C5FD')
  const [newTypeBgColor, setNewTypeBgColor] = useState('#93C5FD18')
  const [newTypeRecordType, setNewTypeRecordType] = useState<RecordType>('training')

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setNickname(parsed.nickname || '풋살러')
        setTeam(parsed.team || 'FC 동호회')
        setProfileImage(parsed.profileImage || null)
        setNotifications(parsed.notifications || {
          mentions: true,
          comments: true,
          reminders: false,
        })
      }

      // Load custom activity types
      const customTypes = await AsyncStorage.getItem(CUSTOM_TYPES_STORAGE_KEY)
      if (customTypes) {
        setCustomActivityTypes(JSON.parse(customTypes))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const settings = {
        nickname,
        team,
        profileImage,
        notifications,
      }
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      await AsyncStorage.setItem(CUSTOM_TYPES_STORAGE_KEY, JSON.stringify(customActivityTypes))

      // CustomTypesContext를 새로고침하여 앱 전체에 반영
      await refreshTypes()

      if (Platform.OS === 'web') {
        alert('설정이 저장되었습니다.')
      } else {
        Alert.alert('성공', '설정이 저장되었습니다.')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      if (Platform.OS === 'web') {
        alert('설정을 저장하는데 실패했습니다.')
      } else {
        Alert.alert('오류', '설정을 저장하는데 실패했습니다.')
      }
    }
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

  const handleAddType = () => {
    setEditingType(null)
    setNewTypeLabel('')
    setNewTypeIconName('training')
    setNewTypeBorderColor('#93C5FD')
    setNewTypeBgColor('#93C5FD18')
    setNewTypeRecordType('training')
    setShowAddTypeModal(true)
  }

  const handleEditType = (type: CustomActivityType) => {
    setEditingType(type)
    setNewTypeLabel(type.label)
    setNewTypeIconName(type.iconName)
    setNewTypeBorderColor(type.borderColor)
    setNewTypeBgColor(type.bgColor)
    setNewTypeRecordType(type.recordType)
    setShowAddTypeModal(true)
  }

  const handleSaveType = () => {
    if (!newTypeLabel.trim()) {
      if (Platform.OS === 'web') {
        alert('활동 유형 이름을 입력해주세요.')
      } else {
        Alert.alert('오류', '활동 유형 이름을 입력해주세요.')
      }
      return
    }

    if (editingType) {
      // 수정
      setCustomActivityTypes(prev =>
        prev.map(t =>
          t.id === editingType.id
            ? { ...t, label: newTypeLabel, iconName: newTypeIconName, borderColor: newTypeBorderColor, bgColor: newTypeBgColor, recordType: newTypeRecordType }
            : t
        )
      )
    } else {
      // 추가
      const newType: CustomActivityType = {
        id: `custom-${Date.now()}`,
        label: newTypeLabel,
        iconName: newTypeIconName,
        borderColor: newTypeBorderColor,
        bgColor: newTypeBgColor,
        enabled: true,
        recordType: newTypeRecordType,
      }
      setCustomActivityTypes(prev => [...prev, newType])
    }

    setShowAddTypeModal(false)
  }

  const handleToggleType = (id: string) => {
    setCustomActivityTypes(prev =>
      prev.map(t => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    )
  }

  const handleDeleteType = (id: string) => {
    const confirm = Platform.OS === 'web'
      ? window.confirm('이 활동 유형을 삭제하시겠습니까?')
      : true

    if (Platform.OS !== 'web') {
      Alert.alert('활동 유형 삭제', '이 활동 유형을 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setCustomActivityTypes(prev => prev.filter(t => t.id !== id))
          },
        },
      ])
    } else if (confirm) {
      setCustomActivityTypes(prev => prev.filter(t => t.id !== id))
    }
  }

  const handlePickImage = async () => {
    try {
      // Request permission for mobile
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.')
          return
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        // Store as base64 data URI for cross-platform compatibility
        const imageUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri
        setProfileImage(imageUri)
      }
    } catch (error) {
      console.error('Failed to pick image:', error)
      if (Platform.OS === 'web') {
        alert('이미지를 불러오는데 실패했습니다.')
      } else {
        Alert.alert('오류', '이미지를 불러오는데 실패했습니다.')
      }
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

          {/* Profile Image */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>프로필 사진</Text>
            <View style={styles.profileImageSection}>
              <Pressable onPress={handlePickImage} style={styles.profileImageButton}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.muted }]}>
                    <User color={colors.mutedForeground} size={40} />
                  </View>
                )}
                <View style={[styles.cameraIconBadge, { backgroundColor: colors.primary }]}>
                  <Camera color={colors.primaryForeground} size={16} />
                </View>
              </Pressable>
              <Text style={styles.imageHelpText}>
                클릭하여 프로필 사진을 변경하세요
              </Text>
            </View>
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

        {/* Activity Types Management */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${colors.secondary}20` }]}>
              <Palette color={colors.secondary} size={20} />
            </View>
            <Text style={styles.cardTitle}>활동 유형 관리</Text>
          </View>

          <Text style={styles.helpText}>
            캘린더와 기록에 사용될 활동 유형을 관리합니다
          </Text>

          {customActivityTypes.map((type) => (
            <View key={type.id} style={styles.typeRow}>
              <View style={styles.typeRowLeft}>
                <Switch
                  value={type.enabled}
                  onValueChange={() => handleToggleType(type.id)}
                  trackColor={{ false: colors.muted, true: colors.primary }}
                  thumbColor={colors.foreground}
                />
                <Image source={activityIconImages[type.iconName]} style={styles.typeIconImage} />
                <View>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                  <View style={styles.typeColorRow}>
                    <View style={[styles.colorDot, { backgroundColor: type.borderColor }]} />
                    <View style={[styles.colorDot, { backgroundColor: type.bgColor }]} />
                  </View>
                </View>
              </View>
              <View style={styles.typeActions}>
                <Pressable onPress={() => handleEditType(type)} style={styles.typeActionButton}>
                  <Edit2 color={colors.foreground} size={16} />
                </Pressable>
                {!['training', 'match', 'plab', 'other', 'teamkakao', 'lesson'].includes(type.id) && (
                  <Pressable onPress={() => handleDeleteType(type.id)} style={styles.typeActionButton}>
                    <Trash2 color={colors.lose} size={16} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}

          <Pressable style={styles.addTypeButton} onPress={handleAddType}>
            <Plus color={colors.primary} size={20} />
            <Text style={[styles.addTypeText, { color: colors.primary }]}>새 활동 유형 추가</Text>
          </Pressable>
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

      {/* Add/Edit Type Modal */}
      <Modal
        visible={showAddTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {editingType ? '활동 유형 수정' : '새 활동 유형 추가'}
              </Text>
              <Pressable onPress={() => setShowAddTypeModal(false)} style={styles.modalCloseButton}>
                <X color={colors.foreground} size={24} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>이름</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
                  placeholder="예: 주말 경기"
                  placeholderTextColor={colors.mutedForeground}
                  value={newTypeLabel}
                  onChangeText={setNewTypeLabel}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>기록 방식</Text>
                <Text style={[styles.helpText, { marginBottom: 8 }]}>
                  훈련: 배운 것, 잘한 점, 부족한 점, KPT 회고 중심 | 경기: 득점, 도움, 경기 결과 중심
                </Text>
                <View style={styles.recordTypeButtons}>
                  <Pressable
                    onPress={() => setNewTypeRecordType('training')}
                    style={[
                      styles.recordTypeButton,
                      { backgroundColor: colors.muted },
                      newTypeRecordType === 'training' && {
                        borderColor: colors.primary,
                        borderWidth: 3,
                        backgroundColor: `${colors.primary}20`,
                      },
                    ]}
                  >
                    <Text style={[styles.recordTypeButtonText, { color: colors.foreground }]}>
                      훈련 일지
                    </Text>
                    <Text style={[styles.recordTypeButtonDesc, { color: colors.mutedForeground }]}>
                      배운점, KPT 중심
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setNewTypeRecordType('match')}
                    style={[
                      styles.recordTypeButton,
                      { backgroundColor: colors.muted },
                      newTypeRecordType === 'match' && {
                        borderColor: colors.primary,
                        borderWidth: 3,
                        backgroundColor: `${colors.primary}20`,
                      },
                    ]}
                  >
                    <Text style={[styles.recordTypeButtonText, { color: colors.foreground }]}>
                      경기 기록
                    </Text>
                    <Text style={[styles.recordTypeButtonDesc, { color: colors.mutedForeground }]}>
                      득점, 도움, 결과 중심
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>아이콘</Text>
                <Text style={[styles.helpText, { marginBottom: 8 }]}>
                  활동 유형을 나타낼 아이콘을 선택하세요
                </Text>
                <View style={styles.iconGrid}>
                  {availableIcons.map((icon) => (
                    <Pressable
                      key={icon.name}
                      onPress={() => setNewTypeIconName(icon.name as any)}
                      style={[
                        styles.iconOption,
                        { backgroundColor: colors.muted },
                        newTypeIconName === icon.name && {
                          borderColor: colors.primary,
                          borderWidth: 3,
                          backgroundColor: `${colors.primary}20`,
                        },
                      ]}
                    >
                      <Image source={activityIconImages[icon.name]} style={styles.iconOptionImage} />
                      <Text style={[styles.iconOptionLabel, { color: colors.foreground }]}>
                        {icon.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>테두리 색상</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
                  placeholder="#93C5FD"
                  placeholderTextColor={colors.mutedForeground}
                  value={newTypeBorderColor}
                  onChangeText={setNewTypeBorderColor}
                />
                <View style={[styles.colorPreview, { backgroundColor: newTypeBorderColor }]} />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>배경 색상</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
                  placeholder="#93C5FD18"
                  placeholderTextColor={colors.mutedForeground}
                  value={newTypeBgColor}
                  onChangeText={setNewTypeBgColor}
                />
                <View style={[styles.colorPreview, { backgroundColor: newTypeBgColor }]} />
                <Text style={[styles.helpText, { marginTop: 4 }]}>
                  투명도를 위해 8자리 HEX 코드를 사용하세요 (예: #93C5FD18)
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.muted }]}
                onPress={() => setShowAddTypeModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveType}
              >
                <Text style={[styles.modalButtonText, { color: colors.primaryForeground }]}>저장</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.muted,
  },
  typeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  typeIconImage: {
    width: 40,
    height: 40,
  },
  typeLabel: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  typeColorRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  typeActionButton: {
    padding: 8,
  },
  addTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: StyleConstants.borderRadius.card,
    ...StyleConstants.shadow.light,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalField: {
    marginBottom: 16,
  },
  colorPreview: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: StyleConstants.borderRadius.button,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 100,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionImage: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  iconOptionLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileImageButton: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.border,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  imageHelpText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
    textAlign: 'center',
  },
  recordTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  recordTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  recordTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recordTypeButtonDesc: {
    fontSize: 11,
  },
})
