import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - BrainRank',
  description: 'Learn how BrainRank uses cookies and similar technologies.',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">BrainRank uses cookies for the following purposes:</p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies are necessary for the website to function properly. They enable core features like user authentication, session management, and quiz progress tracking.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h3>
            <p className="text-gray-600 mb-4">
              We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Functional Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies remember your preferences, such as language settings and display options, to provide a personalized experience.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Cookies</h3>
            <p className="text-gray-600 mb-4">
              With your consent, we may use marketing cookies to track affiliate referrals and measure the effectiveness of our advertising campaigns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">brainrank_session</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">Quiz session tracking</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">7 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">affiliate_id</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">Affiliate tracking</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">sb-*</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">Authentication (Supabase)</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-600">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>View cookies stored on your device</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Please note that blocking essential cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about our use of cookies, contact us at: privacy@brainrank.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
