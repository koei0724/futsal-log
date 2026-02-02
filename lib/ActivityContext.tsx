import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Activity } from './types'
import { mockActivities as initialActivities, mockMonthlyStats } from './mock-data'

interface ActivityContextValue {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void
  getActivityById: (id: string) => Activity | undefined
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)

  const addActivity = useCallback((data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newActivity: Activity = {
      ...data,
      id: `user-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setActivities((prev) => [...prev, newActivity])
  }, [])

  const getActivityById = useCallback((id: string) => {
    return activities.find((a) => a.id === id)
  }, [activities])

  return (
    <ActivityContext.Provider value={{ activities, addActivity, getActivityById }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivities() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider')
  }
  return context
}
