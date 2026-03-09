'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  SocialProofBanner,
  CountdownTimer,
  PaywallHero,
  BlurredReport,
  BenefitBoxes,
  PaymentSection,
} from '@/components/funnel'
import { FAQ } from '@/components/landing'

export default function ResultsPage() {
  const router = useRouter()
  const paymentRef = useRef<HTMLDivElement>(null)
  const [isStickyCTAVisible, setIsStickyCTAVisible] = useState(false)

  // Check for email on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('user_email')
      if (!email) {
        router.replace('/email')
      }
    }
  }, [router])

  // Show sticky CTA after scrolling past payment section
  useEffect(() => {
    const handleScroll = () => {
      if (paymentRef.current) {
        const rect = paymentRef.current.getBoundingClientRect()
        setIsStickyCTAVisible(rect.bottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToPayment = () => {
    paymentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePayment = async () => {
    const email = sessionStorage.getItem('user_email')
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

    // Whop checkout URL format: https://whop.com/checkout/PLAN_ID
    const planId = process.env.NEXT_PUBLIC_WHOP_PLAN_ID || 'plan_xKcYuwkYYT5mB'

    const params = new URLSearchParams()
    params.set('d', `${baseUrl}/dashboard`) // redirect after purchase

    if (email) params.set('email', email)

    // Redirect to Whop checkout
    window.location.href = `https://whop.com/checkout/${planId}/?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Social proof banner */}
      <SocialProofBanner />

      {/* Add top padding for fixed banner */}
      <div className="pt-10">
        {/* Countdown timer */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <CountdownTimer className="justify-center" />
        </div>

        {/* Hero section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PaywallHero onGetScore={scrollToPayment} />
        </div>

        {/* Payment section */}
        <div ref={paymentRef} className="max-w-4xl mx-auto px-4 py-8">
          <PaymentSection onPayment={handlePayment} />
        </div>

        {/* Blurred report preview */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Preview Your Report
          </h2>
          <BlurredReport />
        </div>

        {/* Benefit boxes */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <BenefitBoxes />
        </div>

        {/* FAQ section */}
        <div className="bg-white">
          <FAQ />
        </div>

        {/* Bottom padding for sticky CTA */}
        <div className="h-24" />
      </div>

      {/* Sticky CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 transition-transform duration-300 ${
          isStickyCTAVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Get Your IQ Score</p>
            <p className="text-sm text-gray-500">
              <span className="line-through">$6.99</span>{' '}
              <span className="text-teal-600 font-semibold">$1.00</span> for 7-day trial
            </p>
          </div>
          <button
            onClick={scrollToPayment}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Get My IQ Score Now
          </button>
        </div>
      </div>
    </div>
  )
}
