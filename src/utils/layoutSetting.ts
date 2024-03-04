import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

export const layoutSettingKey = "layoutSetting"

export const defaultLayoutSetting: Record<string, boolean> = {
  displayAfterGptResponse: true,
  header: true
} as const

export const getLayoutSetting = async () => {
  const layoutSetting = await storage.get(layoutSettingKey)
  if (layoutSetting === null || layoutSetting === undefined)
    return defaultLayoutSetting

  return JSON.parse(layoutSetting)
}

export const savetLayoutSetting = async (setting: Record<string, boolean>) => {
  await storage.set(layoutSettingKey, JSON.stringify(setting))
}
