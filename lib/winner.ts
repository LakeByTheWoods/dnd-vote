export function calculateWinner(votes: any[], allDates: string[]) {
  // 1️⃣ Identify disqualified dates
  // A date is disqualified if **no user selected it**
  const dateSelectionCounts: Record<string, number> = {}
  allDates.forEach(d => (dateSelectionCounts[d] = 0))

  votes.forEach(vote => {
    vote.preferences?.forEach((date: string) => {
      if (dateSelectionCounts[date] !== undefined) dateSelectionCounts[date]++
    })
  })

  const disqualified = Object.keys(dateSelectionCounts).filter(
    d => dateSelectionCounts[d] === 0
  )

  // 2️⃣ Filter valid dates
  const validDates = allDates.filter(d => !disqualified.includes(d))

  // 3️⃣ Initialize scoring
  const scores: Record<string, number> = {}
  const first: Record<string, number> = {}
  validDates.forEach(d => {
    scores[d] = 0
    first[d] = 0
  })

  // 4️⃣ Calculate scores using preferential ranking
  votes.forEach(vote => {
    vote.preferences?.forEach((date: string, i: number) => {
      if (!disqualified.includes(date)) {
        // Higher rank → higher points
        const pts = validDates.length - i
        scores[date] += pts
        if (i === 0) first[date]++
      }
    })
  })

  // 5️⃣ Determine winner
  const winner = validDates.sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a]
    return first[b] - first[a]
  })[0] || null

  return {
    winner,
    scores,
    first,
    disqualified
  }
}

export function formatDateWithDay(dateStr: string) {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString(undefined, options) // e.g., "Wed, Mar 18, 2026"
}