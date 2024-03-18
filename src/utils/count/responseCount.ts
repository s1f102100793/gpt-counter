import { key, storage, today } from "../storage"

export const updateResponseDailyCount = async (event: string) => {
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
  const targetDate = date ?? today

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
