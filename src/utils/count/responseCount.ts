import {
  initialData,
  key,
  storage,
  today,
  type CountStorageType
} from "../storage"

export const responseCount = {
  createStorage: async () => {
    const existingData = await storage.get(key.gptResponses())
    if (existingData !== null || existingData !== undefined) {
      await storage.set(key.gptResponses(), initialData)
    }
  },
  createDailyStorage: async () => {
    const allCounts = (await storage.get(
      key.gptResponses()
    )) as CountStorageType
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = {
        "3.5": 0,
        "4": 0
      }
      await storage.set(key.gptResponses(), allCounts)
    }
  },
  getDaily: async (): Promise<number> => {
    const allCounts = (await storage.get(
      key.gptResponses()
    )) as CountStorageType
    return allCounts[today]["3.5"] + allCounts[today]["4"]
  },
  getAll: async (): Promise<CountStorageType> => {
    return (await storage.get(key.gptResponses())) as CountStorageType
  },
  updateDaily: async (event: string) => {
    const allCounts = (await storage.get(
      key.gptResponses()
    )) as CountStorageType
    allCounts[today][event] += 1
    await storage.set(key.gptResponses(), allCounts)
  }
}
