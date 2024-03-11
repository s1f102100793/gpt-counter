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

export {}

const storage: Storage = new Storage()

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled")
  setDailyResetAlarm()
  await initializeDailyCountStorage()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "resetLimit") {
    console.log("resetLimit alarm triggered")
    await resetLimitSetting()
    setDailyResetAlarm()
  }
})

const setDailyResetAlarm = () => {
  const now = new Date()
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 0,
    19,
    56,
    0
  )
  const when = nextMidnight.getTime()
  chrome.alarms.create("resetLimit", { when, periodInMinutes: 24 * 60 })
}

const resetLimitSetting = async () => {
  const previousSetting = await getLimitSetting()
  const defaultSetting = getLimitSettingByDifficulty(previousSetting.difficulty)
  if (defaultSetting === undefined) return
  await savetLimitSetting(defaultSetting)
  console.log("Limit settings have been reset.")
}

const initializeDailyCountStorage = async () => {
  const today = getCurrentDateInJST()
  const initialData = { [today]: 0 }

  const existingData = await storage.get(gptResponsesStorageKey)
  if (existingData === null || existingData === undefined) {
    await storage.set(gptResponsesStorageKey, initialData)
  }
}

console.log(`BGSW - Starting Hub`)
startHub()
