import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help Center - BrainRank',
  description: 'Get help with BrainRank - subscription management, billing, and support.',
}

const helpCategories = [
  {
    icon: '🏦',
    title: 'Subscription Management',
    articles: [
      { title: 'Cancelling your subscription', href: '/help/cancel' },
      { title: 'Does my subscription automatically renew?', href: '/help/auto-renew' },
      { title: 'Updating email address', href: '/help/update-email' },
    ],
  },
  {
    icon: '💳',
    title: 'Billing & Payments',
    articles: [
      { title: 'Where is my refund?', href: '/help/refund-status' },
      { title: "I didn't authorize a subscription", href: '/help/unauthorized-charge' },
      { title: 'I was unaware of the charges', href: '/help/unaware-charges' },
    ],
  },
  {
    icon: '📋',
    title: 'Legal & Policies',
    articles: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms & Conditions', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookie' },
      { title: 'Refund Policy', href: '/terms#refund-policy' },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {helpCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">{category.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h2>
              <ul className="space-y-3">
                {category.articles.map((article) => (
                  <li key={article.href}>
                    <Link
                      href={article.href}
                      className="text-teal-600 hover:text-teal-700 hover:underline text-sm"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-4">💪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect with BrainRank Support</h2>
          <p className="text-gray-600 mb-6">
            Our customer support is available 24/7 and you can expect a response within a few hours.
          </p>
          <a
            href="mailto:support@brainrank.com"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
          <p className="text-sm text-gray-500 mt-4">
            support@brainrank.com
          </p>
        </div>

        {/* Quick answers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Answers</h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
              <p className="text-gray-600 text-sm">
                To cancel your subscription, visit our cancellation portal or contact support. You&apos;ll maintain access until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Does my subscription automatically renew?</h3>
              <p className="text-gray-600 text-sm">
                Yes, all subscriptions auto-renew until cancelled. The trial converts to your selected plan after 7 days. Cancel before renewal to avoid charges.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">How long does the IQ test take?</h3>
              <p className="text-gray-600 text-sm">
                Our IQ test takes approximately 15-20 minutes to complete. The test must be finished in one sitting for accurate results.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Can I retake the test?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Subscribers can retake tests after completing recommended training modules to track progress over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
