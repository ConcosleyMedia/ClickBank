-- Brain Training Module Tables
-- Run this migration in Supabase SQL Editor

-- Training sessions - records each exercise play
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  category TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INTEGER,
  accuracy FLOAT,
  avg_response_ms INTEGER,
  difficulty_level INTEGER DEFAULT 1,
  trials_completed INTEGER,
  trials_correct INTEGER
);

-- Training progress - tracks user progress per category
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  category TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_sessions INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  streak_days INTEGER DEFAULT 0,
  last_streak_date DATE,
  UNIQUE(user_email, category)
);

-- Daily challenges - one per day
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  exercise_id TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily challenge completions - track who completed which challenge
CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  challenge_id UUID REFERENCES daily_challenges(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER,
  UNIQUE(user_email, challenge_id)
);

-- Puzzle bank - stores procedurally generated puzzles
CREATE TABLE IF NOT EXISTS puzzle_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Puzzle completions - track solved puzzles
CREATE TABLE IF NOT EXISTS puzzle_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  puzzle_id UUID REFERENCES puzzle_bank(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  is_correct BOOLEAN,
  time_taken_ms INTEGER,
  UNIQUE(user_email, puzzle_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_sessions_user ON training_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_training_sessions_category ON training_sessions(category);
CREATE INDEX IF NOT EXISTS idx_training_progress_user ON training_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_puzzle_bank_category ON puzzle_bank(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_puzzle_completions_user ON puzzle_completions(user_email);

-- RLS Policies (enable RLS first in Supabase dashboard)
-- Users can only access their own training data
