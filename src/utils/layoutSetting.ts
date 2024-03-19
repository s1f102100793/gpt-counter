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

export const getLayoutSetting = async () => {
  const layoutSetting = await storage.get(key.layoutSetting())
  if (layoutSetting === null || layoutSetting === undefined)
    return defaultLayoutSetting

  return JSON.parse(layoutSetting)
}

export const saveLayoutSetting = async (setting: LayoutSettingType) => {
  await storage.set(key.layoutSetting(), JSON.stringify(setting))
}
