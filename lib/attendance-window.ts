export type SessionType = "PAGI" | "MALAM"

export function getCurrentSession(): SessionType | null {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const totalMinutes = hour * 60 + minute

  const pagiStart = 6 * 60
  const pagiEnd = 7 * 60
  const malamStart = 20 * 60
  const malamEnd = 21 * 60

  if (totalMinutes >= pagiStart && totalMinutes < pagiEnd) return "PAGI"
  if (totalMinutes >= malamStart && totalMinutes < malamEnd) return "MALAM"

  return null
}

export function getTodayDateOnly(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}