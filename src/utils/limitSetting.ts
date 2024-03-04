import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

export const limitSettingKey = "limitSetting"

export type LimitSettingType = {
  difficulty: "easy" | "normal" | "hard"
  limit: number
  isLimitRemoved: boolean
}

export const easyLimitSetting: LimitSettingType = {
  difficulty: "easy",
  limit: 15,
  isLimitRemoved: false
} as const

export const normalLimitSetting: LimitSettingType = {
  difficulty: "normal",
  limit: 10,
  isLimitRemoved: false
} as const

export const hardLimitSetting: LimitSettingType = {
  difficulty: "hard",
  limit: 5,
  isLimitRemoved: false
} as const

export const getLimitSetting = async () => {
  const limitSetting = await storage.get(limitSettingKey)
  if (limitSetting === null || limitSetting === undefined)
    return normalLimitSetting

  return JSON.parse(limitSetting)
}

export const savetLimitSetting = async (setting: LimitSettingType) => {
  await storage.set(limitSettingKey, JSON.stringify(setting))
}
