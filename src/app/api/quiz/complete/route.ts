import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { calculateScores } from '@/lib/quiz/scoring'
import { createClient } from '@/lib/supabase/server'
import type { QuizAnswer } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('brainrank_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { data: null, error: 'No active quiz session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { answers, totalTimeSeconds, gender, questionIds } = body as {
      answers: QuizAnswer[]
      totalTimeSeconds: number
      gender?: string
      questionIds?: string[]
    }

    // Validate
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { data: null, error: 'Invalid answers data' },
        { status: 400 }
      )
    }

    // Calculate scores
    const scores = calculateScores({
      answers,
      totalTimeSeconds: totalTimeSeconds || 0,
    })

    // Store in Supabase
    try {
      const supabase = await createClient()

      // Create quiz session record
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          session_token: sessionToken,
          gender: gender || null,
          question_ids: questionIds || [],
          completed_at: new Date().toISOString(),
          total_time_seconds: totalTimeSeconds,
          raw_score: scores.rawScore,
          iq_score: scores.iqScore,
          percentile: scores.percentile,
          memory_score: scores.memoryScore,
          speed_score: scores.speedScore,
          reaction_score: scores.reactionScore,
          concentration_score: scores.concentrationScore,
          logic_score: scores.logicScore,
          strongest_skill: scores.strongestSkill,
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Failed to save quiz session:', sessionError)
      } else if (session) {
        // Save individual answers
        const answerRecords = answers.map((a) => ({
          session_id: session.id,
          question_id: a.questionId,
          question_type: a.questionType,
          answer_value: a.answerValue,
          is_correct: a.isCorrect ?? null,
          time_taken_ms: a.timeTakenMs ?? null,
        }))

        const { error: answersError } = await supabase
          .from('quiz_answers')
          .insert(answerRecords)

        if (answersError) {
          console.error('Failed to save quiz answers:', answersError)
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Don't fail the request if DB save fails
    }

    return NextResponse.json({
      data: {
        sessionToken,
        scores,
        completedAt: new Date().toISOString(),
        totalTimeSeconds,
        totalAnswered: answers.length,
      },
      error: null,
    })
  } catch (error) {
    console.error('Quiz complete error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to complete quiz' },
      { status: 500 }
    )
  }
}
