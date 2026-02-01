import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getActivityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    training: '훈련',
    match: '경기',
    plab: '플랩',
    other: '기타',
  }
  return labels[type] || type
}

export function getActivityTypeColor(type: string): string {
  const colors: Record<string, string> = {
    training: '#3B82F6', // blue
    match: '#22C55E', // green
    plab: '#A855F7', // purple
    other: '#6B7280', // gray
  }
  return colors[type] || '#6B7280'
}

export function getResultLabel(result: string): string {
  const labels: Record<string, string> = {
    win: '승리',
    lose: '패배',
    draw: '무승부',
  }
  return labels[result] || result
}

export function getResultColor(result: string): string {
  const colors: Record<string, string> = {
    win: '#22C55E',
    lose: '#EF4444',
    draw: '#F59E0B',
  }
  return colors[result] || '#6B7280'
}
