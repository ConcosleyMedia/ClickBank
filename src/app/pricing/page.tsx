'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    id: 'trial',
    name: '7-Day Trial',
    price: '$1.00',
    period: 'one-time',
    description: 'Try BrainRank risk-free',
    features: [
      'Full IQ test access',
      'Complete cognitive analysis',
      'Personalized IQ certificate',
      'Basic brain training games',
      'Category score breakdown',
    ],
    cta: 'Start Trial',
    popular: false,
    envKey: 'NEXT_PUBLIC_WHOP_PLAN_TRIAL',
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: '$9.99',
    period: 'week',
    description: 'Flexible weekly access',
    features: [
      'Everything in Trial',
      'Unlimited test retakes',
      'Full training library',
      '150+ puzzles',
      'Progress tracking',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
    envKey: 'NEXT_PUBLIC_WHOP_PLAN_WEEKLY',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$29.99',
    period: 'month',
    description: 'Best value for serious learners',
    features: [
      'Everything in Weekly',
      '20+ hours of video courses',
      'Advanced analytics',
      'Personalized learning path',
      'Certificate customization',
      'Family sharing (coming soon)',
    ],
    cta: 'Get Started',
    popular: false,
    savings: 'Save 25%',
    envKey: 'NEXT_PUBLIC_WHOP_PLAN_MONTHLY',
  },
]

const planIds: Record<string, string | undefined> = {
  trial: process.env.NEXT_PUBLIC_WHOP_PLAN_TRIAL,
  weekly: process.env.NEXT_PUBLIC_WHOP_PLAN_WEEKLY,
  monthly: process.env.NEXT_PUBLIC_WHOP_PLAN_MONTHLY,
}

export default function PricingPage() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  const handlePlanSelect = (planId: string) => {
    const whopPlanId = planIds[planId]

    if (!whopPlanId) {
      console.error(`Plan ID not configured for: ${planId}`)
      return
    }

    let checkoutUrl = `https://whop.com/checkout/${whopPlanId}/`

    if (email) {
      checkoutUrl += `?email=${encodeURIComponent(email)}`
    }

    // Set flag so dashboard knows to poll for subscription
    localStorage.setItem('payment_pending', Date.now().toString())

    window.location.href = checkoutUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BrainRank</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a $1 trial and choose the plan that fits your learning journey. Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 transition-shadow hover:shadow-lg ${
                plan.popular ? 'border-teal-500' : 'border-gray-100'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Savings badge */}
              {plan.savings && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== 'one-time' && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`block w-full text-center py-4 rounded-xl font-semibold transition-colors cursor-pointer ${
                  plan.popular
                    ? 'bg-teal-500 hover:bg-teal-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">What happens after the trial?</h3>
              <p className="text-gray-600 text-sm">
                After your 7-day trial, you&apos;ll be automatically enrolled in the weekly plan at $9.99/week unless you cancel. You can switch to monthly billing at any time.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can cancel your subscription at any time with no penalties. You&apos;ll continue to have access until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600 text-sm">
                Yes, we offer refunds on a case-by-case basis within 14 days of purchase. Contact our support team for assistance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, Apple Pay, and Google Pay through our secure payment processor.
              </p>
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-700 font-medium">14-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}
