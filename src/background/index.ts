import { getCurrentDateInJST } from "src/utils/count/responseCount"
import {
  getLimitSetting,
  getLimitSettingByDifficulty,
  savetLimitSetting
} from "src/utils/limitSetting"
import { key, storage } from "src/utils/storage"

import "@plasmohq/messaging/background"

import { codeCount } from "src/utils/count/codeCount"

import { startHub } from "@plasmohq/messaging/pub-sub"

chrome.runtime.onInstalled.addListener(async () => {
  setResetAlarm()
  await initializeDailyCountStorage()
  await codeCount.createStorage()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === key.resetLimit()) {
    await resetLimitSetting()
    chrome.alarms.clear(key.resetLimit())
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
  chrome.alarms.create(key.resetLimit(), { when, periodInMinutes: 24 * 60 })
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

  const existingData = await storage.get(key.gptResponses())
  if (existingData === null || existingData === undefined) {
    await storage.set(key.gptResponses(), initialData)
  }
}

startHub()
