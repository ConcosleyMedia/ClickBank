/**
 * Puzzle Generation Script v3
 * Creates proper Raven's Progressive Matrices style puzzles
 * with multiple simultaneous rules and real difficulty progression
 *
 * Run with: npx tsx scripts/generate-puzzles.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// ============================================
// SVG HELPERS
// ============================================

const COLORS = ['#1e40af', '#dc2626', '#059669', '#7c3aed', '#ea580c']
const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'cross', 'star']

function svg(content: string, size = 80): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#f8fafc"/>${content}</svg>`
}

function shape(type: string, cx: number, cy: number, size: number, fill: string, stroke = 'none', strokeWidth = 0): string {
  const half = size / 2
  switch (type) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${half}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'square':
      return `<rect x="${cx - half}" y="${cy - half}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'triangle':
      const h = size * 0.866
      return `<polygon points="${cx},${cy - h/2} ${cx + half},${cy + h/2} ${cx - half},${cy + h/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'diamond':
      return `<polygon points="${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'cross':
      const t = size / 4
      return `<path d="M${cx - half},${cy - t} h${size} v${t*2} h-${size} z M${cx - t},${cy - half} v${size} h${t*2} v-${size} z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'star':
      const outer = half, inner = half * 0.4
      let points = ''
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * Math.PI / 180
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
        points += `${cx + outer * Math.cos(outerAngle)},${cy + outer * Math.sin(outerAngle)} `
        points += `${cx + inner * Math.cos(innerAngle)},${cy + inner * Math.sin(innerAngle)} `
      }
      return `<polygon points="${points.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    case 'hexagon':
      let hexPoints = ''
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * Math.PI / 180
        hexPoints += `${cx + half * Math.cos(angle)},${cy + half * Math.sin(angle)} `
      }
      return `<polygon points="${hexPoints.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
    default:
      return `<circle cx="${cx}" cy="${cy}" r="${half}" fill="${fill}"/>`
  }
}

function questionMark(): string {
  return svg(`
    <rect x="8" y="8" width="64" height="64" fill="#dbeafe" rx="8" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="40" y="52" font-size="36" font-weight="bold" fill="#3b82f6" text-anchor="middle" font-family="Arial">?</text>
  `)
}

// ============================================
// MATRIX PUZZLE GENERATORS (Raven's Style)
// ============================================

interface MatrixPuzzle {
  gridSvgs: string[]
  correctAnswer: string
  distractors: string[]
}

// Type 1: Shape addition across rows (A + B = C pattern)
function generateAdditionMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const baseShapes = SHAPES.slice(0, 3 + difficulty)
  const color = COLORS[difficulty % COLORS.length]

  // Row 1: 1 shape + 1 shape = 2 shapes
  // Row 2: 1 shape + 2 shapes = 3 shapes
  // Row 3: 2 shapes + 2 shapes = ? (4 shapes)

  const patterns = [
    [[0], [1], [0, 1]],           // Row 1
    [[2], [0, 1], [0, 1, 2]],     // Row 2
    [[0, 2], [1, 2], null],       // Row 3 (answer = [0, 1, 2, 2])
  ]

  const positions = [
    { x: 25, y: 25 }, { x: 55, y: 25 },
    { x: 25, y: 55 }, { x: 55, y: 55 },
  ]

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const shapeIndices = patterns[row][col]
      if (shapeIndices === null) {
        gridSvgs.push(questionMark())
      } else {
        let content = ''
        shapeIndices.forEach((idx, i) => {
          const pos = positions[i % positions.length]
          content += shape(baseShapes[idx % baseShapes.length], pos.x, pos.y, 20, color)
        })
        gridSvgs.push(svg(content))
      }
    }
  }

  // Correct answer: combination of row 3, col 0 and col 1
  const correctShapes = [0, 2, 1, 2]
  let correctContent = ''
  correctShapes.forEach((idx, i) => {
    const pos = positions[i]
    correctContent += shape(baseShapes[idx % baseShapes.length], pos.x, pos.y, 18, color)
  })
  const correctAnswer = svg(correctContent)

  // Distractors: wrong combinations
  const distractorPatterns = [
    [0, 1, 2],      // Missing one
    [0, 0, 1, 1],   // Wrong shapes
    [1, 2, 1, 2],   // Wrong pattern
    [0, 1, 2, 0],   // Wrong last
    [2, 2, 2, 2],   // All same
  ]

  const distractors = distractorPatterns.map(pattern => {
    let content = ''
    pattern.forEach((idx, i) => {
      const pos = positions[i % positions.length]
      content += shape(baseShapes[idx % baseShapes.length], pos.x, pos.y, 18, color)
    })
    return svg(content)
  })

  return { gridSvgs, correctAnswer, distractors }
}

// Type 2: Rotation progression (each cell rotates 45° more)
function generateRotationMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const color = COLORS[difficulty % COLORS.length]
  const rotationStep = 45

  // Arrow that rotates through the grid
  function arrow(rotation: number): string {
    return `<g transform="rotate(${rotation} 40 40)">
      <line x1="40" y1="55" x2="40" y2="20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <polygon points="40,15 32,28 48,28" fill="${color}"/>
    </g>`
  }

  const rotations = [0, 45, 90, 135, 180, 225, 270, 315]

  for (let i = 0; i < 8; i++) {
    gridSvgs.push(svg(arrow(rotations[i])))
  }
  gridSvgs.push(questionMark())

  // Correct: 315 degrees (continues the pattern)
  // But wait - 8 cells means we need to figure out the 9th
  // Pattern: each increases by 45, so 9th = 360 = 0
  const correctAnswer = svg(arrow(0))

  // Distractors: nearby wrong rotations
  const distractors = [45, 90, 270, 315, 180].map(r => svg(arrow(r)))

  return { gridSvgs, correctAnswer, distractors }
}

// Type 3: Row and column rules (shape varies by row, fill varies by column)
function generateRowColumnMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const shapes = ['circle', 'square', 'triangle']
  const fills = [COLORS[0], COLORS[1], COLORS[2]]

  // Row determines shape, column determines color
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(svg(shape(shapes[row], 40, 40, 35, fills[col])))
      }
    }
  }

  // Correct: row 2 = triangle, col 2 = third color
  const correctAnswer = svg(shape('triangle', 40, 40, 35, fills[2]))

  // Distractors: wrong shape/color combos
  const distractors = [
    svg(shape('triangle', 40, 40, 35, fills[0])),  // Wrong color
    svg(shape('triangle', 40, 40, 35, fills[1])),  // Wrong color
    svg(shape('circle', 40, 40, 35, fills[2])),    // Wrong shape
    svg(shape('square', 40, 40, 35, fills[2])),    // Wrong shape
    svg(shape('square', 40, 40, 35, fills[1])),    // Both wrong
  ]

  return { gridSvgs, correctAnswer, distractors }
}

// Type 4: Overlapping shapes (XOR pattern)
function generateOverlapMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const color1 = COLORS[0]
  const color2 = COLORS[1]

  // Pattern: Col1 XOR Col2 = Col3 (shapes that appear in exactly one)
  function cell(hasCircle: boolean, hasSquare: boolean, hasTriangle: boolean): string {
    let content = ''
    if (hasCircle) content += shape('circle', 28, 28, 20, color1)
    if (hasSquare) content += shape('square', 52, 28, 18, color2)
    if (hasTriangle) content += shape('triangle', 40, 52, 22, COLORS[2])
    return svg(content || shape('circle', 40, 40, 5, '#ccc')) // Empty indicator
  }

  // Row 1: [circle] XOR [square] = [circle, square]
  // Row 2: [square, triangle] XOR [circle] = [circle, square, triangle]
  // Row 3: [circle, triangle] XOR [square, triangle] = [circle, square] (XOR removes triangle)

  const patterns = [
    [{ c: true, s: false, t: false }, { c: false, s: true, t: false }, { c: true, s: true, t: false }],
    [{ c: false, s: true, t: true }, { c: true, s: false, t: false }, { c: true, s: true, t: true }],
    [{ c: true, s: false, t: true }, { c: false, s: true, t: true }, null],
  ]

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const p = patterns[row][col]
      if (p === null) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(cell(p.c, p.s, p.t))
      }
    }
  }

  // Correct: XOR of row 3 col 0 and col 1 = circle XOR square (triangle cancels)
  const correctAnswer = cell(true, true, false)

  // Distractors
  const distractors = [
    cell(true, true, true),   // All three (AND instead of XOR)
    cell(false, false, true), // Only triangle
    cell(true, false, true),  // Missing square
    cell(false, true, true),  // Missing circle
    cell(true, false, false), // Only circle
  ]

  return { gridSvgs, correctAnswer, distractors }
}

// Type 5: Size progression with shape change
function generateSizeShapeMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const color = COLORS[difficulty % COLORS.length]

  // Rows: shape changes (circle, square, triangle)
  // Cols: size increases (small, medium, large)
  const shapes = ['circle', 'square', 'triangle']
  const sizes = [18, 28, 38]

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(svg(shape(shapes[row], 40, 40, sizes[col], color)))
      }
    }
  }

  const correctAnswer = svg(shape('triangle', 40, 40, 38, color))

  const distractors = [
    svg(shape('triangle', 40, 40, 18, color)),  // Wrong size
    svg(shape('triangle', 40, 40, 28, color)),  // Wrong size
    svg(shape('circle', 40, 40, 38, color)),    // Wrong shape
    svg(shape('square', 40, 40, 38, color)),    // Wrong shape
    svg(shape('diamond', 40, 40, 38, color)),   // Wrong shape
  ]

  return { gridSvgs, correctAnswer, distractors }
}

// Type 6: Counting elements (increases across row and down column)
function generateCountMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const color = COLORS[difficulty % COLORS.length]

  function dots(count: number): string {
    const positions: [number, number][] = [
      [40, 40],
      [28, 28], [52, 52],
      [28, 28], [52, 28], [40, 52],
      [25, 25], [55, 25], [25, 55], [55, 55],
      [25, 25], [55, 25], [40, 40], [25, 55], [55, 55],
      [20, 25], [40, 25], [60, 25], [20, 55], [40, 55], [60, 55],
      [20, 20], [40, 20], [60, 20], [20, 45], [40, 45], [60, 45], [40, 65],
      [20, 20], [40, 20], [60, 20], [20, 40], [60, 40], [20, 60], [40, 60], [60, 60],
      [18, 18], [40, 18], [62, 18], [18, 40], [40, 40], [62, 40], [18, 62], [40, 62], [62, 62],
    ]

    let content = ''
    const startIdx = [0, 0, 1, 3, 6, 10, 15, 21, 28, 36][Math.min(count, 9)]
    for (let i = 0; i < Math.min(count, 9); i++) {
      const [x, y] = positions[startIdx + i] || [40, 40]
      content += `<circle cx="${x}" cy="${y}" r="6" fill="${color}"/>`
    }
    return svg(content)
  }

  // Pattern: Row N + Col N = count (1-indexed)
  // So grid[r][c] = r + c + 2
  const counts = [
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, null], // Answer = 6
  ]

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const count = counts[row][col]
      if (count === null) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(dots(count))
      }
    }
  }

  const correctAnswer = dots(6)

  const distractors = [4, 5, 7, 8, 3].map(n => dots(n))

  return { gridSvgs, correctAnswer, distractors }
}

// Type 7: Line direction patterns
function generateLineMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []
  const color = COLORS[difficulty % COLORS.length]

  function lines(horizontal: number, vertical: number, diagonal: number): string {
    let content = ''
    // Horizontal lines
    for (let i = 0; i < horizontal; i++) {
      const y = 25 + i * 15
      content += `<line x1="15" y1="${y}" x2="65" y2="${y}" stroke="${color}" stroke-width="3"/>`
    }
    // Vertical lines
    for (let i = 0; i < vertical; i++) {
      const x = 25 + i * 15
      content += `<line x1="${x}" y1="15" x2="${x}" y2="65" stroke="${COLORS[1]}" stroke-width="3"/>`
    }
    // Diagonal lines
    for (let i = 0; i < diagonal; i++) {
      const offset = i * 12
      content += `<line x1="${15 + offset}" y1="15" x2="${65}" y2="${65 - offset}" stroke="${COLORS[2]}" stroke-width="3"/>`
    }
    return svg(content)
  }

  // Pattern: horizontal increases across row, vertical increases down column
  const patterns = [
    [[1, 1, 0], [2, 1, 0], [3, 1, 0]],
    [[1, 2, 0], [2, 2, 0], [3, 2, 0]],
    [[1, 3, 0], [2, 3, 0], null],
  ]

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const p = patterns[row][col]
      if (p === null) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(lines(p[0], p[1], p[2]))
      }
    }
  }

  const correctAnswer = lines(3, 3, 0)

  const distractors = [
    lines(3, 2, 0),
    lines(2, 3, 0),
    lines(3, 3, 1),
    lines(2, 2, 0),
    lines(1, 3, 0),
  ]

  return { gridSvgs, correctAnswer, distractors }
}

// Type 8: Nested shapes with rule
function generateNestedMatrix(difficulty: number): MatrixPuzzle {
  const gridSvgs: string[] = []

  function nested(outer: string, inner: string, outerColor: string, innerColor: string): string {
    return svg(
      shape(outer, 40, 40, 36, outerColor) +
      shape(inner, 40, 40, 18, innerColor)
    )
  }

  const outerShapes = ['circle', 'square', 'triangle']
  const innerShapes = ['square', 'triangle', 'circle']

  // Row determines outer, column determines inner
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) {
        gridSvgs.push(questionMark())
      } else {
        gridSvgs.push(nested(outerShapes[row], innerShapes[col], COLORS[row], COLORS[col]))
      }
    }
  }

  const correctAnswer = nested('triangle', 'circle', COLORS[2], COLORS[2])

  const distractors = [
    nested('triangle', 'square', COLORS[2], COLORS[0]),
    nested('triangle', 'triangle', COLORS[2], COLORS[1]),
    nested('circle', 'circle', COLORS[0], COLORS[2]),
    nested('square', 'circle', COLORS[1], COLORS[2]),
    nested('triangle', 'circle', COLORS[0], COLORS[2]),
  ]

  return { gridSvgs, correctAnswer, distractors }
}

// ============================================
// GENERATE ALL PUZZLES
// ============================================

const GENERATORS = [
  { name: 'addition', fn: generateAdditionMatrix },
  { name: 'rotation', fn: generateRotationMatrix },
  { name: 'row-column', fn: generateRowColumnMatrix },
  { name: 'overlap-xor', fn: generateOverlapMatrix },
  { name: 'size-shape', fn: generateSizeShapeMatrix },
  { name: 'counting', fn: generateCountMatrix },
  { name: 'lines', fn: generateLineMatrix },
  { name: 'nested', fn: generateNestedMatrix },
]

interface MatrixQuestion {
  id: string
  type: 'matrix'
  gridSvgs: string[]
  correctAnswer: string
  distractors: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  patternCategory: string
}

interface TextQuestion {
  id: string
  type: 'text'
  question: string
  options: string[]
  correctAnswer: string
  category: 'logic'
}

interface LikertQuestion {
  id: string
  type: 'likert'
  statement: string
  category: 'cognitive' | 'behavioral'
}

interface DemographicQuestion {
  id: string
  type: 'demographic'
  question: string
  options: string[]
  field: 'age' | 'education'
}

type Question = MatrixQuestion | TextQuestion | LikertQuestion | DemographicQuestion

function generateAllQuestions() {
  const questions: Question[] = []

  // Matrix puzzles: 8 types × 5 difficulties = 40 puzzles
  GENERATORS.forEach((gen) => {
    for (let diff = 1; diff <= 5; diff++) {
      const puzzle = gen.fn(diff)
      questions.push({
        id: `matrix_${gen.name}_${diff}`,
        type: 'matrix',
        ...puzzle,
        difficulty: diff as 1 | 2 | 3 | 4 | 5,
        patternCategory: gen.name,
      })
    }
  })

  // Text logic questions
  const textQuestions: TextQuestion[] = [
    { id: 'text_1', type: 'text', question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?', options: ['True', 'False', 'Cannot be determined', 'Only some Bloops', 'None of the above'], correctAnswer: 'True', category: 'logic' },
    { id: 'text_2', type: 'text', question: 'What comes next: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '36', '38'], correctAnswer: '42', category: 'logic' },
    { id: 'text_3', type: 'text', question: 'DOG is to PUPPY as CAT is to:', options: ['KITTEN', 'FELINE', 'PET', 'WHISKERS', 'MEOW'], correctAnswer: 'KITTEN', category: 'logic' },
    { id: 'text_4', type: 'text', question: 'Which number does not belong: 2, 3, 5, 7, 9, 11, 13', options: ['2', '3', '9', '11', '13'], correctAnswer: '9', category: 'logic' },
    { id: 'text_5', type: 'text', question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', options: ['5 minutes', '100 minutes', '20 minutes', '1 minute', '500 minutes'], correctAnswer: '5 minutes', category: 'logic' },
    { id: 'text_6', type: 'text', question: 'What comes next: J, F, M, A, M, J, J, ?', options: ['A', 'S', 'O', 'J', 'N'], correctAnswer: 'A', category: 'logic' },
    { id: 'text_7', type: 'text', question: 'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$0.15', '$0.50', '$0.01'], correctAnswer: '$0.05', category: 'logic' },
    { id: 'text_8', type: 'text', question: 'Complete: 1, 1, 2, 3, 5, 8, 13, ?', options: ['18', '20', '21', '26', '15'], correctAnswer: '21', category: 'logic' },
  ]
  questions.push(...textQuestions)

  // Likert questions (just 3 for warm-up)
  const likertQuestions: LikertQuestion[] = [
    { id: 'likert_1', type: 'likert', statement: 'I enjoy solving complex puzzles and brain teasers', category: 'cognitive' },
    { id: 'likert_2', type: 'likert', statement: 'I can easily spot patterns in sequences of numbers or shapes', category: 'cognitive' },
    { id: 'likert_3', type: 'likert', statement: 'I find it easy to concentrate on challenging tasks', category: 'behavioral' },
  ]
  questions.push(...likertQuestions)

  // Demographic questions
  const demoQuestions: DemographicQuestion[] = [
    { id: 'demo_age', type: 'demographic', question: 'What is your age range?', options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'], field: 'age' },
    { id: 'demo_education', type: 'demographic', question: 'What is your highest level of education?', options: ['High School', 'Some College', "Bachelor's", "Master's", 'Doctorate', 'Other'], field: 'education' },
  ]
  questions.push(...demoQuestions)

  return {
    questions,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      categories: {
        matrix: 40,
        text_logic: textQuestions.length,
        likert: likertQuestions.length,
        demographic: demoQuestions.length,
      },
    },
  }
}

// Main
const data = generateAllQuestions()
const outputPath = path.join(__dirname, '..', 'public', 'puzzles', 'bank.json')
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))

console.log(`Generated ${data.metadata.totalQuestions} questions`)
console.log('Categories:', data.metadata.categories)
console.log(`Output: ${outputPath}`)
