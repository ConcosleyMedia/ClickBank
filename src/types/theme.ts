export interface AffiliateTheme {
  id: string
  slug: string
  affiliateId: string
  brandName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl?: string
  heroHeadline?: string
  heroSubheadline?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  success: string
  warning: string
  error: string
}

export interface ThemeContextValue {
  theme: AffiliateTheme | null
  colors: ThemeColors
  brandName: string
  logoUrl?: string
  isAffiliate: boolean
}

export const DEFAULT_THEME: ThemeColors = {
  primary: '#0d9488', // teal-600
  secondary: '#14b8a6', // teal-500
  accent: '#2dd4bf', // teal-400
  background: '#ffffff',
  foreground: '#171717',
  muted: '#f5f5f5',
  mutedForeground: '#737373',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
}
