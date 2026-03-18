export type Vote = {
  name: string
  available: string[]
  priorities: string[]
}

export interface Poll {
  id: string
  title: string
  dates: string[]
  votes: Vote[]
}

export interface Results {
  winner: string | null
  disqualifiedDates: string[]
  scores: Record<string, number>
}

export interface CreatePollInput {
  title: string
  dates: string[]
}
