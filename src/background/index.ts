import {
  getCurrentDateInJST,
  gptResponsesStorageKey
} from "src/utils/dailyCount"
import {
  getLimitSetting,
  getLimitSettingByDifficulty,
  savetLimitSetting
} from "src/utils/limitSetting"

import { Storage } from "@plasmohq/storage"

import "@plasmohq/messaging/background"

import { startHub } from "@plasmohq/messaging/pub-sub"

const storage: Storage = new Storage()
const resetLimitKey = "resetLimit"

chrome.runtime.onInstalled.addListener(async () => {
  setResetAlarm()
  await initializeDailyCountStorage()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === resetLimitKey) {
    await resetLimitSetting()
    chrome.alarms.clear(resetLimitKey)
    setResetAlarm()
  }
})

const setResetAlarm = () => {
  const now = new Date()
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  )
  const when = nextMidnight.getTime()
  chrome.alarms.create(resetLimitKey, { when, periodInMinutes: 24 * 60 })
}

const resetLimitSetting = async () => {
  const previousSetting = await getLimitSetting()
  const defaultSetting = await getLimitSettingByDifficulty(
    previousSetting.difficulty
  )
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

startHub()
