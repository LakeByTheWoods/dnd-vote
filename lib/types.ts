export type Vote = {
  name: string;
  available: string[];
  priorities: string[];
};

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