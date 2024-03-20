import {
  getLimitSetting,
  getLimitSettingByDifficulty,
  saveLimitSetting
} from "src/utils/limitSetting"
import { key } from "src/utils/storage"

import "@plasmohq/messaging/background"

import { codeCount } from "src/utils/count/codeCount"
import { responseCount } from "src/utils/count/responseCount"
import { layoutSetting } from "src/utils/layoutSetting"

import { startHub } from "@plasmohq/messaging/pub-sub"

chrome.runtime.onInstalled.addListener(async (details) => {
  // 本番時には下の行を消す
  if (details.reason === "install") {
    setResetAlarm()
    await responseCount.createStorage()
    await codeCount.createStorage()
    await layoutSetting.createStorage()
  }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === key.resetLimit()) {
    await resetLimitSetting()
    await responseCount.createDailyStorage()
    await codeCount.createDailyStorage()
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
  await saveLimitSetting(defaultSetting)
}

startHub()
