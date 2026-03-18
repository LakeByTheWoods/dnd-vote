export interface Vote {
  userId: string
  preferences: string[]      // ordered list of available dates
}

export interface Poll {
  id: string
  dates: string[]
  votes: Vote[]
}

export interface Results {
  winner: string | null
  scores: Record<string, number>
  first: Record<string, number>
  disqualified: string[]
}