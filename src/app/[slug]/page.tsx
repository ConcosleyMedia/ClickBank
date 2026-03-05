import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Hero,
  HowItWorks,
  AvailableTests,
  BoostAbilities,
  Testimonials,
  PressLogos,
  PricingCards,
  FAQ,
} from '@/components/landing'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getAffiliateTheme(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('affiliate_themes')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch {
    return null
  }
}

export default async function AffiliateLandingPage({ params }: PageProps) {
  const { slug } = await params

  // Skip reserved routes
  const reservedRoutes = [
    'start',
    'quiz',
    'results',
    'dashboard',
    'sign-in',
    'email',
    'calculating',
    'api',
    'privacy',
    'terms',
    'cookie',
    'help',
    'pricing',
    'affiliates',
    'reviews',
  ]

  if (reservedRoutes.includes(slug)) {
    notFound()
  }

  const theme = await getAffiliateTheme(slug)

  if (!theme) {
    notFound()
  }

  // Set affiliate cookie
  const cookieStore = await cookies()
  cookieStore.set('affiliate_id', theme.affiliate_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  // For now, render the default landing page
  // TODO: Pass theme colors to components via context or CSS variables
  return (
    <>
      <Hero />
      <HowItWorks />
      <AvailableTests />
      <BoostAbilities />
      <Testimonials />
      <PressLogos />
      <PricingCards />
      <FAQ />
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const theme = await getAffiliateTheme(slug)

  if (!theme) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${theme.brand_name} - Discover Your Real IQ Score`,
    description:
      theme.hero_subheadline ||
      'Take our accurate online IQ test in just 15 minutes. Get your instant IQ score, detailed analysis, and percentile ranking.',
  }
}
