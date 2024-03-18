import { key, storage } from "../storage"
import { getCurrentDateInJST } from "./responseCount"

export const codeCount = {
  createStorage: async () => {
    const today = getCurrentDateInJST()
    const initialData = {
      [today]: {
        "3.5": 0,
        "4": 0
      }
    }
    const existingData = await storage.get(key.codeResponses())
    if (existingData !== null && existingData !== undefined) {
      await storage.set(key.codeResponses(), initialData)
    }
  },
  createDailyStorage: async () => {
    const today = getCurrentDateInJST()
    const storageResult = (await storage.get(key.codeResponses())) as unknown
    const allCounts =
      (storageResult as Record<string, Record<string, number>>) ?? {}
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = {}
    }
  },
  updateDaily: async (event: string) => {
    const today = getCurrentDateInJST()
    const allCounts = (await storage.get(key.codeResponses())) as Record<
      string,
      Record<string, number>
    >
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = {}
    }
    if (!allCounts[today][event]) {
      allCounts[today][event] = 0
    }
    allCounts[today][event] += 1
    await storage.set(key.codeResponses(), allCounts)
  }
}
