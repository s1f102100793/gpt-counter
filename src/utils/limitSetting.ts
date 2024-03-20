import { key, storage } from "./storage"

export type LimitSettingType = {
  difficulty: "easy" | "normal" | "hard" | "custom"
  limit: number
  isLimitRemoved: boolean
  isCountOnly?: boolean
  isCodeLimit?: boolean
  codeLimit?: number
  canChangeDifficulty: boolean
}
export const easyLimitSetting: LimitSettingType = {
  difficulty: "easy",
  limit: 15,
  isLimitRemoved: false,
  canChangeDifficulty: true
} as const
export const normalLimitSetting: LimitSettingType = {
  difficulty: "normal",
  limit: 10,
  isLimitRemoved: false,
  canChangeDifficulty: true
} as const
export const hardLimitSetting: LimitSettingType = {
  difficulty: "hard",
  limit: 5,
  isLimitRemoved: false,
  canChangeDifficulty: false
} as const
export const defaultCustomLimitSetting: LimitSettingType = {
  difficulty: "custom",
  limit: 10,
  isLimitRemoved: false,
  isCountOnly: false,
  isCodeLimit: false,
  codeLimit: 10,
  canChangeDifficulty: true
} as const

export const limitSetting = {
  createStorage: async () => {
    await storage.set(key.limitSetting(), JSON.stringify(normalLimitSetting))
  },
  get: async (): Promise<LimitSettingType> => {
    const limitSetting = (await storage.get(key.limitSetting())) as string
    return JSON.parse(limitSetting)
  },
  save: async (setting: LimitSettingType) => {
    await storage.set(key.limitSetting(), JSON.stringify(setting))
  },
  checkLimitRemoved: (
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
}

export const customLimitSetting = {
  createStorage: async () => {
    await storage.set(
      key.customLimitSetting(),
      JSON.stringify(defaultCustomLimitSetting)
    )
  },
  get: async (): Promise<LimitSettingType> => {
    const limitSetting = (await storage.get(key.customLimitSetting())) as string
    return JSON.parse(limitSetting)
  },
  save: async (setting: LimitSettingType) => {
    await storage.set(key.customLimitSetting(), JSON.stringify(setting))
  }
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
      return await customLimitSetting.get()
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
