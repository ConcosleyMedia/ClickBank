import Link from 'next/link'

const pricingPlans = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$9.99',
    period: 'week',
    trialPrice: '$1.00',
    trialDays: 7,
    description: '7-day trial, auto-renews to weekly plan thereafter',
    features: [
      'Personalized IQ Certificate',
      'Comprehensive Cognitive Analysis',
      'Full Access to Development Tools',
      'Brain Training Games',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Monthly Premium',
    price: '$29.99',
    period: 'month',
    trialPrice: '$1.00',
    trialDays: 7,
    description: 'Maximum savings on long-term growth',
    features: [
      'Complete Cognitive Assessment Suite',
      '20+ Hours of Expert-Led Courses',
      'Personalized Development Path',
      'Priority Support',
      '150+ Intelligence Puzzles',
    ],
    cta: 'Get Started',
    popular: true,
  },
]

export function PricingCards() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our flexible offers and choose the one that best suits your learning and personal development journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
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

              {/* Plan name */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>

              {/* Trial info */}
              <div className="bg-teal-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-teal-700">
                  <span className="font-semibold">{plan.trialDays}-day trial for just {plan.trialPrice}</span>
                </p>
                <p className="text-xs text-teal-600 mt-1">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/start"
                className={`block w-full text-center py-4 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-teal-500 hover:bg-teal-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Visit our{' '}
          <Link href="/pricing" className="text-teal-600 hover:underline">
            pricing page
          </Link>{' '}
          to find out more details.
        </p>
      </div>
    </section>
  )
}
