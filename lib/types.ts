export interface Vote {
  userId: string
  // array of available dates ranked by preference (highest priority first)
  available: string[]
}

export interface Poll {
  id: string
  name: string
  dates: string[]
  votes: Vote[]
}

export interface Results {
  winner: string | null
  disqualifiedDates: string[]
  scores: Record<string, number>
}