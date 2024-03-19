import { key, storage } from "./storage"

export type LimitSettingType = {
  difficulty: "easy" | "normal" | "hard" | "custom"
  limit: number
  isLimitRemoved: boolean
  isCountOnly?: boolean
  isCodeLimit?: boolean
  codeLimit?: number
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
  isCountOnly: false,
  isCodeLimit: false,
  codeLimit: 10
} as const

export const checkLimitRemoved = (
  setting: LimitSettingType,
  copySetting: LimitSettingType
) => {
  if (setting.isLimitRemoved) {
    return {
      ...copySetting,
      isLimitRemoved: true,
      limit: Number.MAX_SAFE_INTEGER,
      codeLimit: Number.MAX_SAFE_INTEGER
    }
  }
  return copySetting
}

export const getLimitSetting = async (): Promise<LimitSettingType> => {
  const limitSetting = await storage.get(key.limitSetting())
  if (limitSetting === null || limitSetting === undefined)
    return normalLimitSetting

  return JSON.parse(limitSetting)
}
export const savetLimitSetting = async (setting: LimitSettingType) => {
  await storage.set(key.limitSetting(), JSON.stringify(setting))
}

export const getCustomLimitSetting = async (): Promise<LimitSettingType> => {
  const limitSetting = await storage.get(key.customLimitSetting())
  if (limitSetting === null || limitSetting === undefined)
    return defaultCustomLimitSetting

  return JSON.parse(limitSetting)
}
export const saveCustomLimitSetting = async (setting: LimitSettingType) => {
  await storage.set(key.customLimitSetting(), JSON.stringify(setting))
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
