interface QuizTimerProps {
  formattedTime: string
}

export function QuizTimer({ formattedTime }: QuizTimerProps) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-mono text-lg font-medium">{formattedTime}</span>
    </div>
  )
}
