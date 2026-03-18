import type { Vote, Results } from './types'


export function calculateWinner(votes: Vote[], allDates: string[]): Results {
  // Determine disqualified dates (any date that someone is not available for)
  const disqualifiedDates = allDates.filter(date =>
    votes.some(v => !v.available.includes(date))
  )

  // Only consider valid dates
  const validDates = allDates.filter(date => !disqualifiedDates.includes(date))

  const dateScores: Record<string, number> = {}
  validDates.forEach(date => (dateScores[date] = 0))

  votes.forEach(vote => {
    const rankedDates = vote.priorities.length > 0 ? vote.priorities : vote.available
    rankedDates.forEach((date, index) => {
      if (!(date in dateScores)) return
      // weighted score: highest priority = 1, next = 2/3, next = (2/3)^2, etc.
      dateScores[date] += Math.pow(2 / 3, index)
    })
  })

  const winner = validDates.reduce((best, date) => {
    return dateScores[date] > (best.score ?? -1)
      ? { date, score: dateScores[date] }
      : best
  }, {} as { date?: string; score?: number }).date || null

  return {
    winner,
    disqualifiedDates,
    scores: dateScores,
  }
}

// helper to display day of week
export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}
