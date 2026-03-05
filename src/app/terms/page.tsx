import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions - BrainRank',
  description: 'Read the terms and conditions for using BrainRank services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using BrainRank services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              BrainRank provides online cognitive assessment tests, including IQ tests, personality assessments, and brain training exercises. Our tests are designed for entertainment and educational purposes only and should not be considered a substitute for professional psychological evaluation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription and Payment</h2>
            <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Trial Period</h3>
            <p className="text-gray-600 mb-4">
              All subscriptions begin with a 7-day trial period for $1.00, which automatically converts to your selected subscription rate after the trial period ends.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Subscription Plans</h3>
            <p className="text-gray-600 mb-4">
              We offer weekly ($9.99/week) and monthly ($29.99/month) subscription plans. Prices may vary based on promotional offers and location.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Automatic Renewal</h3>
            <p className="text-gray-600 mb-4">
              All subscriptions automatically renew until cancelled. You must cancel before your renewal date to avoid being charged for the next billing period.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.4 Cancellation</h3>
            <p className="text-gray-600 mb-4">
              You may cancel your subscription at any time through our cancellation portal or by contacting support. You will retain access until the end of your current billing period.
            </p>
          </section>

          <section className="mb-8" id="refund-policy">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Policy</h2>
            <p className="text-gray-600 mb-4">
              We offer refunds on a case-by-case basis for technical issues or if you are unsatisfied with our service. Refund requests must be made within 14 days of purchase. Contact our support team to request a refund.
            </p>
            <p className="text-gray-600 mb-4">
              Please note that refunds are not available for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Partial or unused subscription periods after renewal</li>
              <li>Services already rendered (tests completed, reports generated)</li>
              <li>Requests made after 14 days from purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content, including tests, questions, graphics, and software, is owned by BrainRank and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              BrainRank tests are for entertainment and educational purposes only. Results should not be used for clinical, diagnostic, or professional purposes. We do not guarantee the accuracy of test results or their applicability to any specific purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, BrainRank shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may update these Terms & Conditions from time to time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
            <p className="text-gray-600">
              For questions about these terms, contact us at: support@brainrank.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
