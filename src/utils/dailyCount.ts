import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

const getCurrentDateInJST = (): string => {
  const now = new Date()
  const jstOffset = 9 * 60
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + jstOffset)
  return now.toISOString().split("T")[0]
}

const today = getCurrentDateInJST()

export const gptAnserStoragekey = `gptAnser-${today}`

export const updateDailyCount = async () => {
  const currentCount = ((await storage.get(gptAnserStoragekey)) as number) || 0
  await storage.set(gptAnserStoragekey, currentCount + 1)
  console.log(`Count for ${today}:`, currentCount + 1)
}
