# BRAIN TRAINING MODULE — IMPLEMENTATION BLUEPRINT
**For Claude Code | Dashboard Feature Build**

> This document is the canonical agent instruction set for building the Brain Training section of the dashboard. It mirrors the structure of the main AGENTS.md. Read top to bottom before writing a single line of code.

---

## 0. CONTEXT & SCOPE

The Brain Training module lives **inside the subscriber dashboard** at `/dashboard/train`. It is a **retention feature** — its job is to keep paying subscribers engaged so they don't cancel. It is NOT part of the conversion funnel.

Users land here after completing the IQ quiz and paying. They've been promised:
- "Neuroscience-backed training exercises"
- 5 cognitive skill categories
- 150+ intelligence puzzles
- Daily challenges
- Progress tracking over time

This document specifies how to build exactly that.

**What is NOT in scope here:**
- Quiz engine (separate AGENTS.md)
- Paywall / Whop checkout (separate AGENTS.md)
- Email system
- Affiliate system

---

## 1. FEATURE OVERVIEW

### 1.1 The Six Sections to Build

```
/dashboard/train
├── Brain Training Hub (category selector)
│   ├── /dashboard/train/memory          (3 exercises)
│   ├── /dashboard/train/logic           (4 exercises)
│   ├── /dashboard/train/speed           (3 exercises)
│   ├── /dashboard/train/focus           (2 exercises)
│   └── /dashboard/train/puzzles         (150+ puzzles)
└── Daily Challenge (1 new puzzle/exercise per day)
```

### 1.2 The 5 Cognitive Categories + Exercises

**MEMORY (3 exercises)**
1. `sequence-recall` — Show a sequence of items, hide them, user recalls in order
2. `spatial-grid` — Flash pattern on a grid, user recreates it
3. `word-pairs` — Show word pairs briefly, test recall of paired word

**LOGIC & REASONING (4 exercises)**
1. `number-series` — Complete the next number in a pattern
2. `syllogisms` — "All A are B. Some B are C. Therefore...?" true/false/maybe
3. `deduction-grid` — Simple Einstein-style logic grid puzzles
4. `analogies` — "Dog : Puppy :: Cat : ___"

**PROCESSING SPEED (3 exercises)**
1. `rapid-classification` — Classify items as fast as possible (e.g., even/odd, animal/object)
2. `symbol-match` — Does this symbol match the one shown 2 steps ago? (N-back style)
3. `reaction-tap` — Tap when target appears, don't tap for distractors

**FOCUS & ATTENTION (2 exercises)**
1. `stroop-color` — Classic Stroop test (word "RED" written in blue — name the ink color)
2. `dual-task` — Track a moving target while answering simple math questions

**PUZZLES (150+)**
- Pattern recognition matrices (reuses SVG generator from quiz engine)
- Strategic thinking grids
- Analytical reasoning chains
- Refreshes daily (new puzzle set each day)

---

## 2. DATA MODELS

Add these tables to the existing Supabase schema.

### 2.1 `training_sessions`
```sql
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,          -- e.g. "memory/sequence-recall"
  category TEXT NOT NULL,             -- memory | logic | speed | focus | puzzle
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INTEGER,                      -- raw score for this session
  accuracy FLOAT,                     -- 0.0–1.0
  avg_response_ms INTEGER,            -- average milliseconds per trial
  difficulty_level INTEGER DEFAULT 1, -- 1–5, auto-advances
  trials_completed INTEGER,
  trials_correct INTEGER
);
```

### 2.2 `training_progress`
```sql
CREATE TABLE training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,     -- difficulty level unlocked
  total_sessions INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  streak_days INTEGER DEFAULT 0,
  UNIQUE(user_id, category)
);
```

### 2.3 `daily_challenges`
```sql
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  exercise_id TEXT NOT NULL,
  config JSONB NOT NULL,               -- exercise-specific config/seed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE daily_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  challenge_id UUID REFERENCES daily_challenges(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER,
  UNIQUE(user_id, challenge_id)
);
```

### 2.4 `puzzle_bank`
```sql
CREATE TABLE puzzle_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,              -- pattern | strategic | analytical
  difficulty INTEGER NOT NULL,         -- 1–5
  config JSONB NOT NULL,               -- seed/rules for procedural generation
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. FILE STRUCTURE

Add the following to the existing Next.js app directory:

```
app/
└── dashboard/
    └── train/
        ├── page.tsx                          ← Hub / category selector
        ├── layout.tsx                        ← Shared layout (nav, progress bar)
        ├── daily/
        │   └── page.tsx                      ← Today's daily challenge
        ├── memory/
        │   ├── page.tsx                      ← Memory category landing
        │   ├── sequence-recall/
        │   │   └── page.tsx
        │   ├── spatial-grid/
        │   │   └── page.tsx
        │   └── word-pairs/
        │       └── page.tsx
        ├── logic/
        │   ├── page.tsx
        │   ├── number-series/page.tsx
        │   ├── syllogisms/page.tsx
        │   ├── deduction-grid/page.tsx
        │   └── analogies/page.tsx
        ├── speed/
        │   ├── page.tsx
        │   ├── rapid-classification/page.tsx
        │   ├── symbol-match/page.tsx
        │   └── reaction-tap/page.tsx
        ├── focus/
        │   ├── page.tsx
        │   ├── stroop-color/page.tsx
        │   └── dual-task/page.tsx
        └── puzzles/
            ├── page.tsx
            └── [puzzleId]/
                └── page.tsx

components/
└── training/
    ├── TrainingHub.tsx                       ← Category grid
    ├── CategoryCard.tsx                      ← Individual category card with stats
    ├── ExerciseCard.tsx                      ← Individual exercise card
    ├── ExerciseShell.tsx                     ← Wrapper: countdown, score, complete screen
    ├── ProgressRing.tsx                      ← Circular SVG progress indicator
    ├── StreakBadge.tsx                        ← Daily streak display
    ├── DifficultyBadge.tsx                   ← Level indicator
    ├── ScoreDisplay.tsx                      ← Post-exercise results
    ├── DailyChallengeBanner.tsx              ← Persistent banner if challenge incomplete
    └── exercises/
        ├── SequenceRecall.tsx
        ├── SpatialGrid.tsx
        ├── WordPairs.tsx
        ├── NumberSeries.tsx
        ├── Syllogisms.tsx
        ├── DeductionGrid.tsx
        ├── Analogies.tsx
        ├── RapidClassification.tsx
        ├── SymbolMatch.tsx
        ├── ReactionTap.tsx
        ├── StroopColor.tsx
        ├── DualTask.tsx
        └── PuzzleMatrix.tsx

lib/
└── training/
    ├── scoring.ts                            ← Score calculation + difficulty advancement
    ├── generators/
    │   ├── sequenceGenerator.ts
    │   ├── gridGenerator.ts
    │   ├── numberSeriesGenerator.ts
    │   ├── syllogismGenerator.ts
    │   ├── stroopGenerator.ts
    │   └── puzzleGenerator.ts               ← Reuses/extends quiz SVG generator
    └── hooks/
        ├── useExerciseSession.ts             ← Session start/complete/save
        ├── useTrainingProgress.ts            ← Fetch user progress per category
        └── useDailyChallenge.ts              ← Fetch today's challenge + completion status
```

---

## 4. PHASE-BY-PHASE BUILD PLAN

### PHASE A — Foundation & Shell (Build First)
*No exercises yet. Just the routing, layout, and data layer.*

**Steps:**

**A1.** Create `app/dashboard/train/layout.tsx`
- Shared sidebar or top nav showing: Home, Memory, Logic, Speed, Focus, Puzzles, Daily
- Import `useTrainingProgress` hook and display progress bars per category in the sidebar
- Mobile: bottom tab bar with 5 category icons + Daily

**A2.** Create `app/dashboard/train/page.tsx` — Training Hub
- Grid of 5 `CategoryCard` components + 1 `DailyChallengeBanner`
- Each CategoryCard shows: icon, name, tagline, exercise count, user's current level, "Start" CTA
- If user has never played a category: show "New" badge
- If user has played today: show checkmark + today's score
- Layout: 2 columns mobile, 3 columns desktop

**A3.** Build `components/training/ExerciseShell.tsx`
This is the most reusable component. Every exercise uses this wrapper.
- Props: `exerciseId`, `category`, `difficulty`, `onComplete(result)`
- States: `idle` → `countdown` → `playing` → `completed`
- `idle`: Show exercise name, description, difficulty badge, "Start" button
- `countdown`: 3... 2... 1... Go! (full screen, animated)
- `playing`: Renders `{children}` (the actual exercise component)
  - Top bar: progress dots (one per trial), timer countdown
  - If timed exercise: prominent countdown clock
- `completed`: Score screen (see Section 5)
- On mount: call `useExerciseSession.start()`
- On complete: call `useExerciseSession.save(result)` then show score screen

**A4.** Build `lib/training/hooks/useExerciseSession.ts`
```typescript
// Manages session lifecycle
export function useExerciseSession(exerciseId: string, category: string) {
  // start() — records session start in DB, returns sessionId
  // save(result) — updates training_sessions, updates training_progress
  // Returns: sessionId, isSaving, error
}
```

**A5.** Build `lib/training/hooks/useTrainingProgress.ts`
```typescript
// Fetches user progress for all categories
export function useTrainingProgress(userId: string) {
  // Returns: { memory, logic, speed, focus, puzzles } each with:
  // currentLevel, totalSessions, bestScore, streakDays, lastPlayedAt
}
```

**A6.** Build `lib/training/scoring.ts`
```typescript
// Score calculation for all exercise types
export function calculateScore(
  correct: number,
  total: number,
  avgResponseMs: number,
  difficultyLevel: number
): number { ... }

// Difficulty advancement logic
export function shouldAdvanceDifficulty(
  recentSessions: TrainingSession[],
  currentLevel: number
): boolean {
  // If last 3 sessions: accuracy >= 80% AND avgResponseMs within target range
  // → return true (advance level)
  // If last 3 sessions: accuracy < 50%
  // → return false, flag for difficulty decrease
}
```

**A7.** Create Supabase tables (migration file)
- Run the SQL from Section 2 as a Supabase migration
- Add RLS policies: users can only read/write their own training data

---

### PHASE B — Memory Exercises (3 exercises)

**B1.** `components/training/exercises/SequenceRecall.tsx`

Game loop (per trial):
1. Show N items in sequence, one at a time, 800ms each (items: colored squares, digits, or animal icons)
2. Show blank screen for 1 second
3. User must tap/click items in the correct order from a shuffled grid
4. Correct = green flash, Wrong = red flash + show correct item
5. After 10 trials, complete

Difficulty scaling:
- Level 1: 3 items, colored squares
- Level 2: 4 items, colored squares
- Level 3: 5 items, digits
- Level 4: 6 items, digits with distractors
- Level 5: 7 items, mixed shapes+colors

Generator: `lib/training/generators/sequenceGenerator.ts`
```typescript
export function generateSequence(level: number): {
  items: SequenceItem[];
  distractors: SequenceItem[];
}
```

**B2.** `components/training/exercises/SpatialGrid.tsx`

Game loop (per trial):
1. Show an N×N grid with some cells highlighted (500ms flash)
2. Grid goes blank
3. User taps the cells that were highlighted
4. Score: correct cells / total highlighted cells

Difficulty scaling:
- Level 1: 3×3 grid, 3 cells lit, 2s display
- Level 2: 3×3 grid, 4 cells lit, 1.5s display
- Level 3: 4×4 grid, 5 cells lit, 1.5s display
- Level 4: 4×4 grid, 6 cells lit, 1s display
- Level 5: 5×5 grid, 7 cells lit, 1s display

**B3.** `components/training/exercises/WordPairs.tsx`

Game loop:
1. Show 4–6 word pairs for 5 seconds (e.g., "OCEAN — BLUE")
2. Show cue word only (e.g., "OCEAN — ?")
3. User types or selects the paired word from 4 options
4. 8 trials per session

Difficulty scaling:
- Level 1: 4 pairs, concrete nouns, 5s study time, multiple choice
- Level 2: 5 pairs, abstract concepts, 4s study time, multiple choice
- Level 3: 6 pairs, 3s study time, multiple choice
- Level 4: 6 pairs, 2s study time, typed recall
- Level 5: 8 pairs, 2s study time, typed recall, semantically similar distractors

Word bank: 200 pairs hardcoded in `lib/training/generators/wordPairBank.ts` (provide the list)

---

### PHASE C — Logic & Reasoning Exercises (4 exercises)

**C1.** `components/training/exercises/NumberSeries.tsx`

Game loop:
1. Show series: "2, 4, 8, 16, ___"
2. User selects from 4 options
3. 10 questions per session, 15s per question

Pattern types (hardcode 100+ patterns, select randomly per session):
- Arithmetic: +N each step
- Geometric: ×N each step
- Alternating: +N, -M, +N, -M
- Fibonacci variants
- Square numbers, cubes
- Two interleaved sequences

Each pattern stored as:
```typescript
type NumberSeriesPattern = {
  sequence: number[];       // first 5 numbers
  answer: number;           // 6th number
  rule: string;             // explanation for "Learn" screen
  difficulty: 1 | 2 | 3 | 4 | 5;
}
```

**C2.** `components/training/exercises/Syllogisms.tsx`

Game loop:
1. Show 2 premise statements
2. Show conclusion
3. User selects: "Valid" / "Invalid" / "Can't Tell"
4. 10 questions per session, 20s per question

Example:
```
All mammals breathe air.
All whales are mammals.
Therefore: All whales breathe air.
→ VALID
```

Hardcode 80+ syllogism sets in `lib/training/generators/syllogismBank.ts`
Difficulty splits: 30 easy (Level 1-2), 30 medium (Level 3), 20 hard (Level 4-5)

**C3.** `components/training/exercises/DeductionGrid.tsx`

Simple Einstein-style logic grid. 3×3 for easy, 4×4 for hard.

Game loop:
1. Show clues (text list on left)
2. Interactive grid (rows = people/things, columns = attributes)
3. User clicks cells to mark ✓ (yes) or ✗ (no)
4. "Submit" when grid is complete
5. Highlight errors in red, show solution

Hardcode 30 grids total at launch (not generated):
- 10 easy (3×3, 4–5 clues)
- 15 medium (4×4, 6–8 clues)
- 5 hard (4×4, 9–10 clues)

Store as JSON in `lib/training/generators/deductionGridBank.ts`

**C4.** `components/training/exercises/Analogies.tsx`

Game loop:
1. Show: "Dog : Puppy :: Cat : ___"
2. 4 answer choices
3. 10 questions per session, 12s per question

Types:
- Animal young (Dog : Puppy :: Cat : Kitten)
- Part to whole (Wheel : Car :: Page : Book)
- Antonyms (Hot : Cold :: Light : Dark)
- Cause/effect (Fire : Ash :: Rain : Flood)
- Tool/user (Brush : Painter :: Scalpel : Surgeon)

Hardcode 150+ analogies in `lib/training/generators/analogyBank.ts`

---

### PHASE D — Processing Speed Exercises (3 exercises)

**D1.** `components/training/exercises/RapidClassification.tsx`

Game loop:
1. Item appears on screen (word or image)
2. User must tap LEFT or RIGHT key/button immediately
3. Classification rule shown at top (e.g., "EVEN → LEFT | ODD → RIGHT")
4. 30 items per session, score = correct + speed bonus

Classification types (rotate through):
- Even vs Odd numbers
- Animal vs Object (word)
- Living vs Non-living
- Bigger or smaller than 50

Visual: Large item in center. Two large tap zones (left half = one answer, right half = other).

Response time target: < 600ms for full points, scaled penalty up to 1500ms.

**D2.** `components/training/exercises/SymbolMatch.tsx`

N-back style (2-back for Level 1, 3-back for Level 3+):

Game loop:
1. Symbol appears for 800ms (simple geometric shapes: circle, square, triangle, star, etc.)
2. "Does this match the symbol from N steps ago?"
3. User taps YES or NO within 2 seconds
4. 25 trials per session

Difficulty:
- Level 1–2: 2-back, 6 symbols
- Level 3: 2-back, 8 symbols
- Level 4: 3-back, 6 symbols
- Level 5: 3-back, 8 symbols

**D3.** `components/training/exercises/ReactionTap.tsx`

Game loop:
1. Screen is blank with a large circle
2. Wait random 1–4 seconds (anti-anticipation)
3. Circle turns green → TAP AS FAST AS POSSIBLE
4. 10 trials, measure reaction time in ms
5. Occasionally show RED circle (not green) → do NOT tap (missed tap = penalty)

Score: Based on average reaction time. Display as "Your reaction: 245ms — Faster than 73% of users."

Baseline data: Store averages so users can track improvement over sessions.

---

### PHASE E — Focus & Attention Exercises (2 exercises)

**E1.** `components/training/exercises/StroopColor.tsx`

Classic Stroop implementation:

Game loop:
1. Word appears (e.g., "BLUE" written in red ink)
2. User taps the color OF THE INK (not the word)
3. 4 color buttons at the bottom: Red, Blue, Green, Yellow
4. 20 trials per session

Types (cycle through):
- Congruent (word and color match) — should be easy
- Incongruent (word and color differ) — creates cognitive conflict
- Neutral (non-color words like "TABLE" in colored ink)

Scoring: Accuracy × speed. Display error rate separately (tells user where their attention broke).

**E2.** `components/training/exercises/DualTask.tsx`

Split attention task:

Game loop:
1. A target (colored dot) moves around the screen slowly
2. User must keep their finger/mouse on the dot (tracking task)
3. Simultaneously, math problems appear at top (2+3=?, 7-4=?, etc.)
4. User taps correct answer from 3 choices while keeping dot tracked
5. Session ends after 60 seconds

Score: Combined (tracking accuracy %) × (math accuracy %)

Difficulty scaling:
- Level 1: Slow dot, easy math (add/subtract single digits)
- Level 3: Medium dot speed, medium math (2-digit)
- Level 5: Fast dot with direction changes, harder math

---

### PHASE F — Puzzles Section (150+)

**F1.** Reuse the quiz SVG matrix generator

The puzzle generator from the quiz engine (`lib/puzzleGenerator.ts`) already generates pattern matrices. This section reuses it directly.

Route: `/dashboard/train/puzzles`

Layout:
- Filter tabs: Pattern Recognition | Strategic Thinking | Analytical Reasoning
- Difficulty filter: All | Easy | Medium | Hard
- Grid of puzzle cards (3 per row desktop, 1 per row mobile)
- Each card: puzzle thumbnail (SVG preview), difficulty dots, "Solved" badge if completed

Individual puzzle (`/dashboard/train/puzzles/[puzzleId]`):
- Full-size matrix display
- 6 answer choices in 2×3 grid (same as quiz format)
- "Check Answer" button
- On correct: green overlay + explanation
- On incorrect: highlight wrong choice red, show correct, explain the rule
- "Next Puzzle" button

**F2.** Puzzle seeding strategy
At launch: Procedurally generate 200 puzzles server-side using the generator. Store seeds in `puzzle_bank` table. Serve them from DB (not re-generated each time). This ensures consistent puzzle delivery and "solved" tracking.

Cron job: Add 5 new puzzles per day (easy to automate: run generator, store seeds).

**F3.** Daily puzzle rotation
`/dashboard/train/daily` shows:
1. "Today's Challenge" — 1 puzzle from each category (5 total)
2. Streak tracker: "🔥 7-day streak"
3. "Come back tomorrow for new puzzles"

---

### PHASE G — Progress & Gamification

**G1.** Build `components/training/ProgressRing.tsx`
SVG circular progress ring. Props: `percentage`, `color`, `size`, `label`
Used in: category cards, post-exercise score screen, profile

**G2.** Post-exercise score screen (inside `ExerciseShell.tsx`)
After every session, show:
- Large score number (animate count-up from 0)
- "Accuracy: 80%" | "Avg Speed: 420ms"
- "Your best: 94" (highlight if new best)
- Star rating: 1–3 stars based on score thresholds
- If unlocked new difficulty: "🎉 Level 2 Unlocked!"
- Graph: Last 5 sessions for this exercise (sparkline)
- Two buttons: "Play Again" | "Try Another Exercise"

**G3.** Progress dashboard section (`/dashboard/train` — bottom section)
After the category grid, show:
- "Your Progress This Week" — 5 mini progress rings (one per category)
- "Sessions this week: 12" | "Best streak: 5 days" | "Exercises mastered: 3"
- Simple bar chart: score improvement over last 30 days (per category, toggle between)

Use recharts for charts (already in dependencies).

**G4.** Streak system
- Streak increments if user completes ≥ 1 exercise on a given calendar day
- Show streak on hub page: "🔥 3 day streak — keep it going!"
- Streak breaks at midnight if no session that day
- "Streak freezes" as a future premium feature (don't build now, just note in comments)

---

### PHASE H — Content Seeding

Before shipping, these content files must be populated:

**H1.** `lib/training/generators/wordPairBank.ts`
200 word pairs, tagged by difficulty and type. Example format:
```typescript
export const WORD_PAIRS: WordPair[] = [
  { word1: "OCEAN", word2: "BLUE", difficulty: 1, category: "color-association" },
  { word1: "DEMOCRACY", word2: "FREEDOM", difficulty: 3, category: "concept-association" },
  ...
]
```

**H2.** `lib/training/generators/syllogismBank.ts`
80 syllogisms. Each includes premises, conclusion, validity, and explanation.

**H3.** `lib/training/generators/deductionGridBank.ts`
30 logic grids as JSON. Each includes: grid size, entities, attributes, clues array, solution matrix.

**H4.** `lib/training/generators/analogyBank.ts`
150 analogies with 4 answer choices each and correct answer index.

**H5.** `lib/training/generators/numberSeriesBank.ts`
100 number sequences with answers, rules, and difficulty ratings.

---

## 5. UI/UX SPECIFICATION

### 5.1 Training Hub Page Layout

```
┌─────────────────────────────────────────────┐
│  🔥 3-day streak    Train Your Brain         │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │ TODAY'S     │  │ YOUR PROGRESS       │   │
│  │ CHALLENGE   │  │ ████░░ Memory 60%   │   │
│  │ 5 puzzles   │  │ ██░░░░ Logic  40%   │   │
│  │ [Start Now] │  │ ...                 │   │
│  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────┤
│  TRAIN BY SKILL                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 🧠       │ │ 🔢       │ │ ⚡       │    │
│  │ Memory   │ │ Logic    │ │ Speed    │    │
│  │ Level 2  │ │ Level 1  │ │ New      │    │
│  │ 3 exer.  │ │ 4 exer.  │ │ 3 exer.  │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐                 │
│  │ 🎯       │ │ 🧩       │                 │
│  │ Focus    │ │ Puzzles  │                 │
│  │ New      │ │ 2 solved │                 │
│  └──────────┘ └──────────┘                 │
└─────────────────────────────────────────────┘
```

### 5.2 Category Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Memory Training                          │
│  "Enhance your short and long-term memory"  │
│                                             │
│  Your Memory Level: ██████░░ Level 2        │
│  Best score this week: 847                  │
├─────────────────────────────────────────────┤
│  EXERCISES                                  │
│  ┌────────────────────────────────────────┐ │
│  │ 🔢 Sequence Recall          Level 2   │ │
│  │ "Remember and repeat sequences"        │ │
│  │ Best: 94 | Last played: Today  [Play]  │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ ⬛ Spatial Grid             Level 1   │ │
│  │ "Memorize grid patterns"               │ │
│  │ Best: 78 | Last played: 2 days  [Play] │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ 📝 Word Pairs               New       │ │
│  │ "Learn and recall word associations"   │ │
│  │                                 [Play] │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 5.3 Exercise Shell States

**Countdown state:**
```
        [Exercise Name]

           3
      (large, animated)

     Get ready...
```

**Playing state:**
```
┌─── ● ● ○ ○ ○ ○ ○ ○ ○ ○ ──── 00:12 ─┐
│                                      │
│         [EXERCISE CONTENT]           │
│                                      │
└──────────────────────────────────────┘
```

**Completed state:**
```
        ✓ Complete!

           847
        Your Score

  ★ ★ ★  (animate in)

  Accuracy: 80%    Avg: 420ms
  Best: 912  ↓  New best? 🎉

  [▓▓▓░░] Last 5 sessions

  [Play Again]  [Try Another]
```

### 5.4 Color Palette (per category)
Match the dashboard's teal primary, with category accent colors:
- Memory: `#7C3AED` (purple)
- Logic: `#2563EB` (blue)
- Speed: `#DC2626` (red/orange)
- Focus: `#059669` (green)
- Puzzles: `#D97706` (amber)

Category cards use these as their icon background and progress ring color.

### 5.5 Animation Requirements
- Exercise countdown: Scale animation on numbers (1.5x → 1x over 800ms)
- Answer feedback: 200ms color flash (green correct, red wrong)
- Score count-up: 1.5 second count from 0 to final score (use requestAnimationFrame)
- Level unlock: Confetti burst (use `canvas-confetti` npm package)
- Progress ring: Animate from previous value to new value on load (500ms ease)
- Streak badge: Flame pulse animation (CSS keyframes, subtle)

---

## 6. API ROUTES

Add these to the existing Next.js API structure:

```
app/api/training/
├── progress/
│   └── route.ts          GET — fetch user's all-category progress
├── session/
│   ├── start/
│   │   └── route.ts      POST — record session start
│   └── complete/
│       └── route.ts      POST — save session result, update progress
├── daily/
│   └── route.ts          GET — fetch today's daily challenge + completion status
└── puzzles/
    ├── route.ts           GET — list puzzles with filters
    └── [id]/
        └── route.ts       GET — single puzzle   POST — record solve
```

### Route Details

**POST `/api/training/session/complete`**
```typescript
Body: {
  sessionId: string;
  exerciseId: string;
  category: string;
  difficultyLevel: number;
  trialsCompleted: number;
  trialsCorrect: number;
  avgResponseMs: number;
}
Response: {
  score: number;
  accuracy: number;
  newLevel?: number;        // present if difficulty advanced
  newBest?: boolean;
  updatedProgress: TrainingProgress;
}
```

**GET `/api/training/daily`**
```typescript
Response: {
  challenge: DailyChallenge;
  isCompleted: boolean;
  completedAt?: string;
  streakDays: number;
}
```

---

## 7. CRON JOBS & BACKGROUND TASKS

**Daily Challenge Generation** (runs at 00:00 UTC):
- Script: `scripts/generateDailyChallenge.ts`
- Selects 5 puzzles from `puzzle_bank` (one per category)
- Rotates through difficulty levels across days (Mon=Easy, Tue=Medium, etc.)
- Inserts into `daily_challenges` for the next day
- Can run as a Vercel Cron Job or Supabase Edge Function

**Puzzle Bank Seeding** (one-time + periodic top-up):
- Script: `scripts/seedPuzzleBank.ts`
- Runs the matrix generator 200 times with varying seeds
- Stores seed + config in `puzzle_bank`
- Run manually initially, then +5/day via cron

---

## 8. IMPLEMENTATION ORDER (EXACT SEQUENCE FOR CLAUDE CODE)

Work in this exact order to avoid blocking:

```
1.  DB migrations (Section 2 tables)
2.  API routes skeleton (empty handlers, correct types)
3.  useExerciseSession hook
4.  useTrainingProgress hook
5.  ExerciseShell component (idle + countdown + completed states)
6.  Training Hub page (hardcode fake progress data first)
7.  CategoryCard component
8.  Connect hub page to real useTrainingProgress data
9.  Memory/sequence-recall exercise (first real exercise — test the full loop)
10. Wire sequence-recall through ExerciseShell → API → DB
11. Verify full loop works (play → score → saved to DB → visible in hub)
12. Build remaining 2 memory exercises
13. Build 4 logic exercises
14. Build 3 speed exercises
15. Build 2 focus exercises
16. Build puzzle listing page (reuse quiz generator)
17. Build individual puzzle page
18. Daily challenge page + cron job
19. Progress charts (recharts)
20. Polish: animations, transitions, mobile layout
21. Seed content banks (word pairs, syllogisms, deduction grids, analogies)
22. QA: play through every exercise at every difficulty level
```

---

## 9. KNOWN RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dual-task exercise is technically complex | Medium | Build it last in Focus; skip for MVP if needed |
| Deduction grid solver logic is tricky | Medium | Hardcode the 30 grids — don't auto-generate |
| Puzzle generator produces visually bad SVGs | High | Test extensively; hand-curate the first 50 |
| Content banks take time to write | Medium | Prioritize number series + analogies first (easiest to generate); save syllogisms for post-launch |
| Mobile touch targets too small | Medium | All tap zones minimum 48×48px; test on real device before shipping |
| Animation jank on low-end devices | Low | Use CSS transforms only (no layout-triggering properties); `will-change: transform` on animated elements |

---

## 10. DEFINITION OF DONE

The Brain Training module is considered shippable when:

- [ ] All 5 category pages load with real data
- [ ] At least 2 exercises per category are fully playable end-to-end
- [ ] Session results save to DB and appear in progress tracking
- [ ] Difficulty advances after 3 high-accuracy sessions
- [ ] Daily challenge shows new content each day
- [ ] Streak counter increments on daily play
- [ ] Post-exercise score screen shows previous best and improvement
- [ ] Mobile layout is usable on iPhone 12-size screen
- [ ] No exercise has a broken state (e.g., can't get stuck, can always reach "Complete")
- [ ] "Coming Soon" badge removed from all 5 category cards on the dashboard landing

---

## 11. POST-MVP ENHANCEMENTS (DO NOT BUILD NOW — LOG ONLY)

- [ ] Leaderboard: "Top scorers this week in your country"
- [ ] Training reminders: Push notification / email if no session in 48 hours
- [ ] Personalized training plan: "Based on your IQ test, focus on Memory and Speed"
- [ ] Adaptive difficulty: Difficulty shifts mid-session, not just between sessions
- [ ] Head-to-head: Real-time challenge against another user
- [ ] Video course integration: "Watch the Memory module course, then practice here"
- [ ] Certificate of completion: After completing all exercises at Level 3+
- [ ] Streak freeze: Purchasable in-app (future monetization angle)
- [ ] Brain age estimate: Composite score across all categories → "Your brain age: 24"

---

*End of Brain Training Implementation Blueprint*
*Version 1.0 — Built to complement main AGENTS.md*
