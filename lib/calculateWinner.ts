import type { Vote, Results } from './types'


export function calculateWinner(votes: Vote[], allDates: string[]): Results {
  const dateScores: Record<string, number> = {}

  // Determine disqualified dates (any date that someone is not available for)
  const disqualifiedDates = allDates.filter(date =>
    votes.some(v => !v.available.includes(date))
  )

  // Only consider valid dates
  const validDates = allDates.filter(d => !disqualifiedDates.includes(d))

  // Initialize scores
  validDates.forEach(date => (dateScores[date] = 0))

  // Scoring: geometric progression, first = 1, next = prev * 2/3
  votes.forEach(vote => {
    let score = 1
    vote.ranking.forEach(date => {
      if (validDates.includes(date)) {
        dateScores[date] += score
        score *= 2 / 3 // reduce by 2/3 for next preference
      }
    })
  })

  // Determine winner (highest score)
  const winner = validDates.reduce(
    (best, date) => (dateScores[date] > (dateScores[best] ?? 0) ? date : best),
    validDates[0] ?? null
  )

  return { scores: dateScores, winner, disqualifiedDates }
}

// helper to display day of week
export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}