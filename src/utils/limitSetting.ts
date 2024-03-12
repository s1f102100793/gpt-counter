import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

export const limitSettingKey = "limitSetting"
export const customLimitSettingKey = "customLimitSetting"

export type LimitSettingType = {
  difficulty: "easy" | "normal" | "hard" | "custom"
  limit: number
  isLimitRemoved: boolean
  isCountOnly?: boolean
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

export const defaultCustomLimitSetting: LimitSettingType = {
  difficulty: "custom",
  limit: 10,
  isLimitRemoved: false,
  isCountOnly: false
} as const

export const getLimitSetting = async (): Promise<LimitSettingType> => {
  const limitSetting = await storage.get(limitSettingKey)
  if (limitSetting === null || limitSetting === undefined)
    return normalLimitSetting

  return JSON.parse(limitSetting)
}

export const savetLimitSetting = async (setting: LimitSettingType) => {
  await storage.set(limitSettingKey, JSON.stringify(setting))
}

const getCustomLimitSetting = async (): Promise<LimitSettingType> => {
  const limitSetting = await storage.get(customLimitSettingKey)
  if (limitSetting === null || limitSetting === undefined)
    return defaultCustomLimitSetting

  return JSON.parse(limitSetting)
}

export const getLimitSettingByDifficulty = async (
  difficulty: string
): Promise<LimitSettingType | undefined> => {
  switch (difficulty) {
    case "easy":
      return easyLimitSetting
    case "normal":
      return normalLimitSetting
    case "hard":
      return hardLimitSetting
    case "custom":
      return await getCustomLimitSetting()
    default:
      return undefined
  }
}

export const getValueByLimitSetting = (
  limitSettingType: LimitSettingType
): number => {
  switch (limitSettingType.difficulty) {
    case "easy":
      return 0
    case "normal":
      return 1
    case "hard":
      return 2
    case "custom":
      return 3
    default:
      return 0
  }
}
