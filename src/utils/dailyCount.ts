import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

const getCurrentDateInJST = (): string => {
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

const today = getCurrentDateInJST()

export const gptAnserStoragekey = `gptAnser-${today}`

export const updateDailyCount = async () => {
  const currentCount = ((await storage.get(gptAnserStoragekey)) as number) || 0
  await storage.set(gptAnserStoragekey, currentCount + 1)
  console.log(`Count for ${today}:`, currentCount + 1)
}
