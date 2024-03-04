import {
  getLimitSetting,
  getLimitSettingByDifficulty,
  savetLimitSetting
} from "src/utils/limitSetting"

chrome.runtime.onInstalled.addListener(() => {
  setDailyResetAlarm()
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
