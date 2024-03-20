import { key, storage } from "./storage"

export type LayoutSettingType = {
  afterGptResponse: boolean
  header: boolean
  content: "responseCount" | "codeCount"
}

export const defaultLayoutSetting: LayoutSettingType = {
  afterGptResponse: true,
  header: true,
  content: "responseCount"
}

export const layoutSetting = {
  createStorage: async () => {
    await storage.set(key.layoutSetting(), JSON.stringify(defaultLayoutSetting))
  },
  get: async () => {
    const layoutSetting = (await storage.get(key.layoutSetting())) as string
    return JSON.parse(layoutSetting)
  },
  save: async (setting: LayoutSettingType) => {
    await storage.set(key.layoutSetting(), JSON.stringify(setting))
  }
}
