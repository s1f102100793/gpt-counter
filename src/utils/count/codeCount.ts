import { initialData, key, storage, today } from "../storage"

export const codeCount = {
  createStorage: async () => {
    const existingData = await storage.get(key.codeResponses())
    if (existingData !== null && existingData !== undefined) {
      await storage.set(key.codeResponses(), initialData)
    }
  },
  createDailyStorage: async () => {
    const allCounts = (await storage.get(key.codeResponses())) as Record<
      string,
      Record<string, number>
    >
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = {
        "3.5": 0,
        "4": 0
      }
      await storage.set(key.codeResponses(), allCounts)
    }
  },
  updateDaily: async (event: string) => {
    const allCounts = (await storage.get(key.codeResponses())) as Record<
      string,
      Record<string, number>
    >
    allCounts[today][event] += 1
    await storage.set(key.codeResponses(), allCounts)
  }
}