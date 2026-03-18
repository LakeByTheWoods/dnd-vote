import type { Vote, Results } from './types'

export function calculateWinner(votes: Vote[], allDates: string[]): Results {
  const dateSelectionCounts: Record<string, number> = {}
  allDates.forEach(d => (dateSelectionCounts[d] = 0))

  votes.forEach(vote => {
    vote.preferences.forEach(date => {
      if (dateSelectionCounts[date] !== undefined) dateSelectionCounts[date]++
    })
  })

  const disqualified = Object.keys(dateSelectionCounts).filter(d => dateSelectionCounts[d] === 0)
  const validDates = allDates.filter(d => !disqualified.includes(d))

  const scores: Record<string, number> = {}
  const first: Record<string, number> = {}
  validDates.forEach(d => {
    scores[d] = 0
    first[d] = 0
  })

  votes.forEach(vote => {
    vote.preferences.forEach((date, i) => {
      if (!disqualified.includes(date)) {
        const pts = validDates.length - i
        scores[date] += pts
        if (i === 0) first[date]++
      }
    })
  })

  const winner = validDates.sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a]
    return first[b] - first[a]
  })[0] || null

  return { winner, scores, first, disqualified }
}

// helper to display day of week
export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}