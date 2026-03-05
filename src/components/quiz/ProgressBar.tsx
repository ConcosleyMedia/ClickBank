interface ProgressBarProps {
  progress: number // 0-100
  currentQuestion: number
  totalQuestions: number
}

export function ProgressBar({ progress, currentQuestion, totalQuestions }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="mt-2 text-sm text-gray-500 text-center">
        <span className="font-medium text-gray-900">{currentQuestion}</span>
        <span> of </span>
        <span>{totalQuestions}</span>
      </div>
    </div>
  )
}
