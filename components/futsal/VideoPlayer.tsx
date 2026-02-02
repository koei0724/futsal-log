import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { Play, Pause, MessageCircle, Send, Volume2, VolumeX } from 'lucide-react-native'
import type { VideoComment } from '@/lib/types'
import { useColors } from '@/lib/ThemeContext'
import type { ThemeColors } from '@/constants/Colors'

interface VideoPlayerProps {
  videoUrl: string
  comments: VideoComment[]
  onAddComment?: (timestamp: number, content: string) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function VideoPlayer({ videoUrl, comments, onAddComment }: VideoPlayerProps) {
  const colors = useColors()
  const { width: windowWidth } = useWindowDimensions()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(300)
  const [isMuted, setIsMuted] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [activeComment, setActiveComment] = useState<VideoComment | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressBarRef = useRef<View>(null)

  const youtubeId = getYouTubeId(videoUrl)
  const containerWidth = Math.min(windowWidth, 480) - 32

  const styles = createStyles(colors)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (showCommentInput) {
      setShowCommentInput(false)
    }
  }

  const handleAddComment = () => {
    setIsPlaying(false)
    setShowCommentInput(true)
  }

  const handleSubmitComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(currentTime, commentText)
      setCommentText('')
      setShowCommentInput(false)
    }
  }

  const handleCommentDotPress = (comment: VideoComment) => {
    setCurrentTime(comment.timestamp)
    setActiveComment(comment)
    setIsPlaying(false)
  }

  const handleProgressPress = useCallback((e: any) => {
    if (Platform.OS === 'web') {
      // On web, use getBoundingClientRect for accurate position
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      const locationX = e.nativeEvent.pageX - rect.left
      const percent = locationX / rect.width
      setCurrentTime(Math.floor(Math.max(0, Math.min(1, percent)) * duration))
    } else {
      const { locationX } = e.nativeEvent
      const percent = locationX / (containerWidth - 24)
      setCurrentTime(Math.floor(percent * duration))
    }
  }, [containerWidth, duration])

  const progress = (currentTime / duration) * 100

  return (
    <View style={styles.container}>
      {/* Video Container */}
      <View style={[styles.videoContainer, { width: containerWidth }]}>
        <View style={styles.videoPlaceholder}>
          <Play color={colors.primary} size={48} />
          <Text style={styles.placeholderText}>
            {youtubeId ? 'YouTube 영상' : '영상 미리보기'}
          </Text>
        </View>

        {/* Time overlay */}
        <View style={styles.timeOverlay}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Pressable
            ref={progressBarRef}
            style={styles.progressBar}
            onPress={handleProgressPress}
          >
            <View style={[styles.progressFill, { width: `${progress}%` }]} />

            {/* Comment dots */}
            {comments.map((comment) => {
              const position = (comment.timestamp / duration) * 100
              const isMyComment = comment.authorId === 'me'
              return (
                <Pressable
                  key={comment.id}
                  onPress={() => handleCommentDotPress(comment)}
                  style={[
                    styles.commentDot,
                    { left: `${position}%` },
                    { backgroundColor: isMyComment ? colors.primary : colors.mutedForeground },
                  ]}
                />
              )
            })}
          </Pressable>
        </View>

        {/* Control buttons */}
        <View style={styles.buttonRow}>
          <View style={styles.leftButtons}>
            <Pressable style={styles.iconButton} onPress={togglePlay}>
              {isPlaying ? (
                <Pause color={colors.foreground} size={20} />
              ) : (
                <Play color={colors.foreground} size={20} />
              )}
            </Pressable>

            <Pressable style={styles.iconButton} onPress={() => setIsMuted(!isMuted)}>
              {isMuted ? (
                <VolumeX color={colors.foreground} size={20} />
              ) : (
                <Volume2 color={colors.foreground} size={20} />
              )}
            </Pressable>
          </View>

          <Pressable style={[styles.commentButton, { borderColor: colors.border }]} onPress={handleAddComment}>
            <MessageCircle color={colors.foreground} size={16} />
            <Text style={[styles.commentButtonText, { color: colors.foreground }]}>{formatTime(currentTime)}에 댓글</Text>
          </Pressable>
        </View>

        {/* Comment input */}
        {showCommentInput && (
          <View style={[styles.commentInputContainer, { backgroundColor: colors.muted }]}>
            <Text style={[styles.commentInputLabel, { color: colors.mutedForeground }]}>
              <Text style={[styles.timeAccent, { color: colors.primary }]}>{formatTime(currentTime)}</Text>에 댓글 추가
            </Text>
            <View style={styles.commentInputRow}>
              <TextInput
                style={[styles.commentInput, { backgroundColor: colors.card, color: colors.foreground }]}
                placeholder="피드백을 입력하세요..."
                placeholderTextColor={colors.mutedForeground}
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={handleSubmitComment}
              />
              <Pressable style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSubmitComment}>
                <Send color={colors.primaryForeground} size={16} />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Active comment popup */}
      {activeComment && (
        <View style={[styles.activeCommentPopup, { backgroundColor: colors.card, borderColor: `${colors.primary}50` }]}>
          <View style={styles.activeCommentHeader}>
            <View>
              <Text style={[styles.activeCommentMeta, { color: colors.mutedForeground }]}>
                <Text style={[styles.timeAccent, { color: colors.primary }]}>{formatTime(activeComment.timestamp)}</Text>
                {' - '}
                <Text style={[styles.authorName, { color: colors.foreground }]}>{activeComment.authorName}</Text>
              </Text>
              <Text style={[styles.activeCommentContent, { color: colors.foreground }]}>{activeComment.content}</Text>
            </View>
            <Pressable onPress={() => setActiveComment(null)}>
              <Text style={[styles.closeButtonText, { color: colors.mutedForeground }]}>닫기</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Comments List */}
      <View style={styles.commentsList}>
        <Text style={[styles.commentsTitle, { color: colors.foreground }]}>타임라인 댓글 ({comments.length})</Text>

        {comments.length > 0 ? (
          [...comments]
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((comment) => (
              <Pressable
                key={comment.id}
                onPress={() => handleCommentDotPress(comment)}
                style={[
                  styles.commentItem,
                  { backgroundColor: colors.muted },
                  comment.authorId === 'me' && {
                    backgroundColor: `${colors.primary}15`,
                    borderWidth: 1,
                    borderColor: `${colors.primary}30`,
                  },
                ]}
              >
                <View style={styles.commentItemHeader}>
                  <Text style={[styles.commentTimestamp, { color: colors.primary }]}>{formatTime(comment.timestamp)}</Text>
                  <Text style={[styles.commentAuthor, { color: colors.mutedForeground }]}>{comment.authorName}</Text>
                </View>
                <Text style={[styles.commentContent, { color: colors.foreground }]}>{comment.content}</Text>
                {comment.mentions && comment.mentions.length > 0 && (
                  <Text style={[styles.mentions, { color: colors.secondary }]}>@{comment.mentions.join(' @')}</Text>
                )}
              </Pressable>
            ))
        ) : (
          <Text style={[styles.emptyComments, { color: colors.mutedForeground }]}>아직 댓글이 없습니다</Text>
        )}
      </View>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    width: '100%',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#fff',
  },
  controls: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  commentDot: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.card,
    transform: [{ translateX: -6 }, { translateY: -2 }],
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  commentButtonText: {
    fontSize: 12,
  },
  commentInputContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  commentInputLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  timeAccent: {
    fontFamily: 'monospace',
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCommentPopup: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeCommentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activeCommentMeta: {
    fontSize: 12,
  },
  authorName: {
    fontWeight: '500',
  },
  activeCommentContent: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButtonText: {
    fontSize: 12,
  },
  commentsList: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  commentAuthor: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
  },
  mentions: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyComments: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
})
