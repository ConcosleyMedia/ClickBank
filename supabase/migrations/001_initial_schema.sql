-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Stores user profile information after payment
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  whop_membership_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_tier TEXT CHECK (subscription_tier IN ('standard', 'premium')),
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AFFILIATE THEMES TABLE
-- Custom branding/themes for affiliate landing pages
-- ============================================
CREATE TABLE affiliate_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  affiliate_id TEXT NOT NULL,
  brand_name TEXT NOT NULL DEFAULT 'BrainRank',
  primary_color TEXT DEFAULT '#0d9488',
  secondary_color TEXT DEFAULT '#14b8a6',
  accent_color TEXT DEFAULT '#2dd4bf',
  logo_url TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUIZ SESSIONS TABLE
-- Tracks quiz progress for both anonymous and authenticated users
-- ============================================
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  affiliate_id TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  question_ids JSONB NOT NULL DEFAULT '[]',
  current_question_index INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_time_seconds INTEGER,
  -- Calculated scores (populated on completion)
  raw_score INTEGER,
  iq_score INTEGER,
  percentile INTEGER,
  memory_score INTEGER,
  speed_score INTEGER,
  reaction_score INTEGER,
  concentration_score INTEGER,
  logic_score INTEGER,
  strongest_skill TEXT,
  -- Micro-question answers from calculation screen
  likes_puzzles BOOLEAN,
  prefers_numbers BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUIZ ANSWERS TABLE
-- Individual question answers
-- ============================================
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('likert', 'text', 'matrix', 'demographic')),
  answer_value TEXT NOT NULL,
  is_correct BOOLEAN,
  time_taken_ms INTEGER,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- ============================================
-- EMAIL CAPTURES TABLE
-- Email collection before payment (marketing asset)
-- ============================================
CREATE TABLE email_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE SET NULL,
  affiliate_id TEXT,
  converted_to_profile BOOLEAN DEFAULT false,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WHOP EVENTS TABLE
-- Webhook event logging for debugging and audit
-- ============================================
CREATE TABLE whop_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_quiz_sessions_session_token ON quiz_sessions(session_token);
CREATE INDEX idx_quiz_sessions_profile_id ON quiz_sessions(profile_id);
CREATE INDEX idx_quiz_sessions_affiliate_id ON quiz_sessions(affiliate_id);
CREATE INDEX idx_quiz_answers_session_id ON quiz_answers(session_id);
CREATE INDEX idx_email_captures_email ON email_captures(email);
CREATE INDEX idx_email_captures_session_id ON email_captures(session_id);
CREATE INDEX idx_affiliate_themes_slug ON affiliate_themes(slug);
CREATE INDEX idx_profiles_auth_id ON profiles(auth_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_whop_events_event_type ON whop_events(event_type);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE whop_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = auth_id);

-- Affiliate themes: Public read access for active themes
CREATE POLICY "Anyone can view active affiliate themes"
  ON affiliate_themes FOR SELECT
  USING (is_active = true);

-- Quiz sessions: Users can view their own sessions (via profile_id)
CREATE POLICY "Users can view own quiz sessions"
  ON quiz_sessions FOR SELECT
  USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

-- Quiz answers: Users can view answers from their sessions
CREATE POLICY "Users can view own quiz answers"
  ON quiz_answers FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM quiz_sessions
      WHERE profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
    )
  );

-- Email captures: No direct user access (admin only via service role)

-- Whop events: No direct user access (admin only via service role)

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_themes_updated_at
  BEFORE UPDATE ON affiliate_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_sessions_updated_at
  BEFORE UPDATE ON quiz_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
