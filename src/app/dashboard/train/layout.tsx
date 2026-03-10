'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard/train', label: 'Hub', icon: '🏠' },
  { href: '/dashboard/train/memory', label: 'Memory', icon: '🧠' },
  { href: '/dashboard/train/logic', label: 'Logic', icon: '🔢' },
  { href: '/dashboard/train/speed', label: 'Speed', icon: '⚡' },
  { href: '/dashboard/train/focus', label: 'Focus', icon: '🎯' },
  { href: '/dashboard/train/puzzles', label: 'Puzzles', icon: '🧩' },
]

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show nav during exercise (when path has 3+ segments after /dashboard/train/)
  const pathParts = pathname.split('/').filter(Boolean)
  const isInExercise = pathParts.length > 3

  if (isInExercise) {
    return <>{children}</>
  }

  return (
    <div>
      {/* Training navigation */}
      <nav className="mb-6 -mt-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-gray-100 overflow-x-auto">
        <div className="flex gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard/train' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {children}
    </div>
  )
}
