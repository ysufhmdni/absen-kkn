export type SessionType = "PAGI" | "MALAM"

function getJakartaTime(): Date {
  const now = new Date()
  // Konversi ke waktu Jakarta (WIB, UTC+7) apapun timezone server-nya
  const jakartaString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  return new Date(jakartaString)
}

export function getCurrentSession(): SessionType | null {
  const jakartaNow = getJakartaTime()
  const hour = jakartaNow.getHours()
  const minute = jakartaNow.getMinutes()
  const totalMinutes = hour * 60 + minute

  const pagiStart = 12 * 60
  const pagiEnd = 14 * 60
  const malamStart = 20 * 60
  const malamEnd = 21 * 60

  if (totalMinutes >= pagiStart && totalMinutes < pagiEnd) return "PAGI"
  if (totalMinutes >= malamStart && totalMinutes < malamEnd) return "MALAM"

  return null
}

export function getTodayDateOnly(): Date {
  const jakartaNow = getJakartaTime()
  return new Date(Date.UTC(jakartaNow.getFullYear(), jakartaNow.getMonth(), jakartaNow.getDate()))
}