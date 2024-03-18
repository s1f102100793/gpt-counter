import { Storage } from "@plasmohq/storage"

export const storage: Storage = new Storage()

export interface CountStorageType {
  [date: string]: Record<string, number>
}

export const key = {
  resetLimit: () => "resetLimit",
  limitSetting: () => "limitSetting",
  customLimitSetting: () => "customLimitSetting",
  layoutSetting: () => "layoutSetting",
  gptResponses: () => "gptResponses",
  codeResponses: () => "codeResponses"
}

const CurrentDateInJST = (): string => {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
  const formattedDate = formatter.format(now).replace(/\//g, "-")
  const [year, month, day] = formattedDate.split("-")
  return `${year}-${month}-${day}`
}
export const today = CurrentDateInJST()

export const initialData = {
  [today]: {
    "3.5": 0,
    "4": 0
  }
}
