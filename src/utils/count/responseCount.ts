import { key, storage, today, type CountStorageType } from "../storage"

export const updateResponseDailyCount = async (event: string) => {
  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts = (storageResult as CountStorageType) ?? {}
  if (allCounts[today] === undefined || allCounts[today] === null) {
    allCounts[today] = {}
  }
  if (!allCounts[today][event]) {
    allCounts[today][event] = 0
  }
  allCounts[today][event] += 1
  await storage.set(key.gptResponses(), allCounts)
}

export const getResponseDailyCount = async (): Promise<number> => {
  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts = (storageResult as CountStorageType) ?? {}

  const dailyCounts = allCounts[today]
  let totalDailyCount = 0
  if (dailyCounts !== undefined && dailyCounts !== null) {
    totalDailyCount = Object.values(dailyCounts).reduce(
      (total, currentCount) => total + currentCount,
      0
    )
  }

  return totalDailyCount
}

export const getResponseAllCounts = async (): Promise<CountStorageType> => {
  const storageResult = (await storage.get(key.gptResponses())) as unknown
  const allCounts = (storageResult as CountStorageType) ?? {}

  return allCounts
}
