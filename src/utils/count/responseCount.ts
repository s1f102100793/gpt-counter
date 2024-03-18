import { key, storage } from "../storage"

export const getCurrentDateInJST = (): string => {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
  const formattedDate = formatter.format(now).replace(/\//g, "-")
  const [year, month, day] = formattedDate.split("-")
  return `${year}-${month}-${day}`
}

export const updateResponseDailyCount = async (event: string) => {
  const today = getCurrentDateInJST()
  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts =
    (storageResult as Record<string, Record<string, number>>) ?? {}
  if (allCounts[today] === undefined || allCounts[today] === null) {
    allCounts[today] = {}
  }
  if (!allCounts[today][event]) {
    allCounts[today][event] = 0
  }
  allCounts[today][event] += 1
  await storage.set(key.gptResponses(), allCounts)
}

export const getResponseDailyCount = async (date?: string): Promise<number> => {
  const targetDate = date ?? getCurrentDateInJST()

  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts =
    (storageResult as Record<string, Record<string, number>>) ?? {}

  const dailyCounts = allCounts[targetDate]

  let totalDailyCount = 0
  if (dailyCounts !== undefined && dailyCounts !== null) {
    totalDailyCount = Object.values(dailyCounts).reduce(
      (total, currentCount) => total + currentCount,
      0
    )
  }

  return totalDailyCount
}

export const getResponseAllCounts = async (): Promise<
  Record<string, Record<string, number>>
> => {
  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts =
    (storageResult as Record<string, Record<string, number>>) ?? {}

  return allCounts
}
