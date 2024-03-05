import {
  getCurrentDateInJST,
  gptResponsesStorageKey
} from "src/utils/dailyCount"
import {
  getLimitSetting,
  getLimitSettingByDifficulty,
  savetLimitSetting
} from "src/utils/limitSetting"

const storage: Storage = new Storage()

chrome.runtime.onInstalled.addListener(async () => {
  setDailyResetAlarm()
  await initializeDailyCountStorage()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "resetLimit") {
    resetLimitSetting()
  }
})

const setDailyResetAlarm = () => {
  const now = new Date()
  const resetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    15
  )
  const when = resetTime.getTime() + 24 * 60 * 60 * 1000
  chrome.alarms.create("resetLimit", { when, periodInMinutes: 1440 })
}

const resetLimitSetting = async () => {
  const previousSetting = await getLimitSetting()
  const defaultSetting = getLimitSettingByDifficulty(previousSetting.difficulty)
  if (defaultSetting === undefined) return

  await savetLimitSetting(defaultSetting)
}

const initializeDailyCountStorage = async () => {
  const today = getCurrentDateInJST()
  const initialData = { [today]: 0 }

  const existingData = await storage.get(gptResponsesStorageKey)
  if (existingData === null || existingData === undefined) {
    await storage.set(gptResponsesStorageKey, initialData)
  }
}
