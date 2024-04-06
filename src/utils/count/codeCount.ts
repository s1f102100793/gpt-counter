import type { GptModel } from "../gptModel"
import {
  CurrentDateInJST,
  initialData,
  key,
  storage,
  type CountStorageType
} from "../storage"

export const codeCount = {
  createStorage: async () => {
    const existingData = await storage.get(key.codeResponses())
    if (existingData !== null || existingData !== undefined) {
      await storage.set(key.codeResponses(), initialData)
    }
  },
  createDailyStorage: async () => {
    const today = CurrentDateInJST()
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = { "3.5": 0, "4": 0 }
      await storage.set(key.codeResponses(), allCounts)
    }
  },
  getDaily: async (): Promise<number> => {
    const today = CurrentDateInJST()
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    return allCounts[today]["3.5"] + allCounts[today]["4"]
  },
  updateDaily: async (event: GptModel) => {
    const today = CurrentDateInJST()
    const allCounts = (await storage.get(
      key.codeResponses()
    )) as CountStorageType
    if (allCounts[today] === undefined || allCounts[today] === null) {
      allCounts[today] = { "3.5": 0, "4": 0 }
    }
    if (allCounts[today][event] === undefined) {
      allCounts[today][event] = 0
    }
    allCounts[today][event] += 1
    await storage.set(key.codeResponses(), allCounts)
  }
}
