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

export const updateDailyCount = async () => {
  const storageResult = (await storage.get(gptResponsesStorageKey)) as unknown
  const allCounts = (storageResult as Record<string, number>) ?? {}
  const today = getCurrentDateInJST()
  const currentCount = allCounts[today] || 0
  allCounts[today] = currentCount + 1
  await storage.set(gptResponsesStorageKey, allCounts)
}

export const getDailyCount = async (date?: string): Promise<number> => {
  const targetDate = date ?? getCurrentDateInJST()

  const storageResult = (await storage.get(gptResponsesStorageKey)) as unknown
  const allCounts = (storageResult as Record<string, number>) ?? {}

  return allCounts[targetDate] || 0
}
