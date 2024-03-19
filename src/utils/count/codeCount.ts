import {
  initialData,
  key,
  storage,
  today,
  type CountStorageType
} from "../storage"

export const codeCount = {
  createStorage: async () => {
    const existingData = await storage.get(key.codeResponses())
    if (existingData !== null && existingData !== undefined) {
      await storage.set(key.codeResponses(), initialData)
    }
  },
  createDailyStorage: async () => {
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = {
        "3.5": 0,
        "4": 0
      }
      await storage.set(key.codeResponses(), allCounts)
    }
  },
  getDaily: async (): Promise<number> => {
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    return allCounts[today]["3.5"] + allCounts[today]["4"]
  },
  updateDaily: async (event: string) => {
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    allCounts[today][event] += 1
    await storage.set(key.codeResponses(), allCounts)
  }
}
