import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

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

export const gptResponsesStorageKey = `gptResponses`

export const updateEventCount = async (event: string) => {
  const today = getCurrentDateInJST()
  const storageResult = (await storage.get(gptResponsesStorageKey)) as unknown
  const allCounts =
    (storageResult as Record<string, Record<string, number>>) ?? {}
  if (allCounts[today] === undefined || allCounts[today] === null) {
    allCounts[today] = {}
  }
  if (!allCounts[today][event]) {
    allCounts[today][event] = 0
  }
  allCounts[today][event] += 1
  await storage.set(gptResponsesStorageKey, allCounts)
}

export const getDailyCount = async (date?: string): Promise<number> => {
  const targetDate = date ?? getCurrentDateInJST()

  const storageResult = (await storage.get(gptResponsesStorageKey)) as unknown
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
