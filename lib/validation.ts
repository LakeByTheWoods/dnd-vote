import type { CreatePollInput, Poll, Vote } from '@/lib/types'

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function uniqueStrings(values: string[]) {
  return [...new Set(values)]
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function validateCreatePollInput(payload: unknown): ValidationResult<CreatePollInput> {
  if (!isRecord(payload)) {
    return { success: false, message: 'Invalid request body.' }
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const rawDates = Array.isArray(payload.dates) ? payload.dates : []
  const dates = uniqueStrings(
    rawDates.filter((value): value is string => typeof value === 'string').map((value) => value.trim())
  )

  if (!title) {
    return { success: false, message: 'Poll title is required.' }
  }

  if (dates.length === 0) {
    return { success: false, message: 'At least one date is required.' }
  }

  if (dates.some((date) => !isIsoDate(date))) {
    return { success: false, message: 'Dates must use YYYY-MM-DD format.' }
  }

  return {
    success: true,
    data: {
      title,
      dates,
    },
  }
}

export function validateVoteInput(payload: unknown, poll: Poll): ValidationResult<Vote> {
  if (!isRecord(payload)) {
    return { success: false, message: 'Invalid request body.' }
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const available = uniqueStrings(
    (Array.isArray(payload.available) ? payload.available : [])
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
  )
  const priorities = uniqueStrings(
    (Array.isArray(payload.priorities) ? payload.priorities : [])
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
  )

  if (!name) {
    return { success: false, message: 'Voter name is required.' }
  }

  if (available.length === 0) {
    return { success: false, message: 'Select at least one available date.' }
  }

  const invalidAvailable = available.find((date) => !poll.dates.includes(date))
  if (invalidAvailable) {
    return { success: false, message: `Unknown available date: ${invalidAvailable}.` }
  }

  const invalidPriority = priorities.find((date) => !poll.dates.includes(date))
  if (invalidPriority) {
    return { success: false, message: `Unknown priority date: ${invalidPriority}.` }
  }

  if (priorities.some((date) => !available.includes(date))) {
    return { success: false, message: 'Priority dates must also be marked available.' }
  }

  return {
    success: true,
    data: {
      name,
      available,
      priorities: priorities.length > 0 ? priorities : available,
    },
  }
}

export function validatePoll(value: unknown): ValidationResult<Poll> {
  if (!isRecord(value)) {
    return { success: false, message: 'Stored poll is invalid.' }
  }

  const id = typeof value.id === 'string' ? value.id : ''
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const dates = Array.isArray(value.dates)
    ? uniqueStrings(value.dates.filter((item): item is string => typeof item === 'string'))
    : []
  const votesRaw = Array.isArray(value.votes) ? value.votes : []

  if (!id || !title || dates.length === 0) {
    return { success: false, message: 'Stored poll is missing required fields.' }
  }

  const votes: Vote[] = []
  for (const voteValue of votesRaw) {
    const voteResult = validateVoteInput(voteValue, { id, title, dates, votes: [] })
    if (!voteResult.success) {
      return { success: false, message: voteResult.message }
    }
    votes.push(voteResult.data)
  }

  return {
    success: true,
    data: {
      id,
      title,
      dates,
      votes,
    },
  }
}
