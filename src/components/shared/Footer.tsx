import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Customer Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help/how-to-cancel"
                  className="hover:text-white transition-colors"
                >
                  How to Cancel
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Customer Support 24/7/365
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#refund-policy"
                  className="hover:text-white transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">About Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Work With Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">Work with us</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/affiliates"
                  className="hover:text-white transition-colors"
                >
                  Affiliate program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-semibold">BrainRank</span>
            </div>

            {/* Copyright and disclaimer */}
            <p className="text-sm text-gray-400 text-center max-w-2xl">
              Copyright © 2024-2026 BrainRank™. All rights reserved. All trademarks
              referenced herein are the properties of their respective owners. The test
              is for entertainment or educational purposes only and is not a substitute
              for professional evaluation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
