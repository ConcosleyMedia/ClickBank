'use client'

import { useState, useEffect } from 'react'

const names = [
  'James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophia',
  'Matthew', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander',
]

const countries = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
]

function generateNotification() {
  const name = names[Math.floor(Math.random() * names.length)]
  const country = countries[Math.floor(Math.random() * countries.length)]
  const iqScore = 95 + Math.floor(Math.random() * 45) // 95-140
  const gender = Math.random() > 0.5 ? 'his' : 'her'

  return {
    id: Date.now(),
    name,
    country,
    iqScore,
    gender,
  }
}

export function SocialProofBanner() {
  const [notification, setNotification] = useState(generateNotification())
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide out
      setIsVisible(false)

      // Generate new notification and slide in
      setTimeout(() => {
        setNotification(generateNotification())
        setIsVisible(true)
      }, 500)
    }, 4000) // New notification every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 px-4 z-50 overflow-hidden">
      <div
        className={`flex items-center justify-center gap-2 text-sm transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <span className="text-lg">{notification.country.flag}</span>
        <span>
          <strong>{notification.name}</strong> Just Bought {notification.gender} IQ Score!
        </span>
        <span className="bg-white/20 px-2 py-0.5 rounded font-semibold">
          IQ {notification.iqScore}
        </span>
      </div>
    </div>
  )
}
