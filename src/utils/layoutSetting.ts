import { key, storage } from "./storage"

export const defaultLayoutSetting: Record<string, boolean> = {
  afterGptResponse: true,
  header: true
} as const

export const getLayoutSetting = async () => {
  const layoutSetting = await storage.get(key.layoutSetting())
  if (layoutSetting === null || layoutSetting === undefined)
    return defaultLayoutSetting

  return JSON.parse(layoutSetting)
}

export const savetLayoutSetting = async (setting: Record<string, boolean>) => {
  await storage.set(key.layoutSetting(), JSON.stringify(setting))
}
