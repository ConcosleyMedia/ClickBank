export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due'

export type SubscriptionTier = 'standard' | 'premium'

export interface Profile {
  id: string
  authId: string
  email: string
  fullName?: string
  avatarUrl?: string
  whopMembershipId?: string
  subscriptionStatus: SubscriptionStatus
  subscriptionTier?: SubscriptionTier
  subscriptionStartedAt?: string
  subscriptionEndsAt?: string
  createdAt: string
  updatedAt: string
}

export interface EmailCapture {
  id: string
  email: string
  sessionId?: string
  affiliateId?: string
  convertedToProfile: boolean
  profileId?: string
  createdAt: string
}

export interface UserDashboardData {
  profile: Profile
  quizResults: {
    iqScore: number
    percentile: number
    memoryScore: number
    speedScore: number
    reactionScore: number
    concentrationScore: number
    logicScore: number
    strongestSkill: string
    completedAt: string
    totalTimeSeconds: number
  }
  certificateUrl?: string
}

export interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
}
