'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "What if I'm not satisfied with the program?",
    answer:
      "We're confident that you'll see the value and benefits of BrainRank, but if you're not satisfied or you are experiencing technical issues, you might be eligible for a refund. See our Refund Policy to learn more.",
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      "Canceling is simple and takes less than a few minutes. Visit our Help Center and follow the instructions. You'll maintain access until the end of your current billing period.",
  },
  {
    question: 'How long does the IQ test take?',
    answer:
      'Our IQ test takes up to 20 minutes to complete. Each test must be finished in one sitting and cannot be paused, as this ensures the most accurate results. Please plan for uninterrupted time before starting any test.',
  },
  {
    question: 'Can I retake tests?',
    answer:
      'Yes! You can retake tests after completing recommended training modules to track your progress and improvement over time.',
  },
  {
    question: 'Can I access BrainRank on multiple devices?',
    answer:
      'Yes! Your subscription works across all devices - smartphones, tablets, and computers. Your progress automatically syncs everywhere you log in.',
  },
  {
    question: 'Is my data secure?',
    answer:
      "We take your privacy seriously. Your data is stored securely and compliant with all applicable laws. Data is encrypted using bank-level security, and we never share your personal information with third parties. Your payment information is processed according to PCI-DSS industry standards. You can read more in our Privacy Policy.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Have questions? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
