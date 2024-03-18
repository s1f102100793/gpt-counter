import { Storage } from "@plasmohq/storage"

export const storage: Storage = new Storage()

export const key = {
  resetLimit: () => "resetLimit",
  limitSetting: () => "limitSetting",
  customLimitSetting: () => "customLimitSetting",
  layoutSetting: () => "layoutSetting",
  gptResponses: () => "gptResponses"
}
