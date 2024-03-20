import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { codeCount as codeCountUtils } from "src/utils/count/codeCount"
import { responseCount } from "src/utils/count/responseCount"
import {
  getLimitSetting,
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

const HidePromptTextarea = () => {
  const [count, setCount] = useState(0)
  const [codeCount, setCodeCount] = useState(0)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const [url, setUrl] = useState("")
  const remainingCounts = limitSetting.limit - count
  const codeRemainingCounts = (limitSetting.codeLimit as number) - codeCount
  const hideCondition =
    (remainingCounts <= 0 && limitSetting.isCountOnly === false) ||
    (codeRemainingCounts <= 0 && limitSetting.isCodeLimit === true)

  const fetchTodayCount = async () => {
    await responseCount.getDaily().then((count) => {
      setCount(count)
    })
    await codeCountUtils.getDaily().then((count) => {
      setCodeCount(count)
    })
  }
  const fetchLimitSetting = async () => {
    await getLimitSetting().then((setting) => {
      setLimitSetting(setting)
    })
  }
  useEffect(() => {
    fetchTodayCount()
    fetchLimitSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchTodayCount()
    fetchLimitSetting()
  })
  chrome.runtime.onMessage.addListener((message) => {
    if (message.name === "url") {
      setUrl(message.body.url)
    }
  })

  useEffect(() => {
    setTimeout(() => {
      const textarea = document.getElementById("prompt-textarea")
      if (!textarea) return
      if (hideCondition) {
        textarea.style.setProperty("display", "none", "important")
      } else {
        textarea.style.setProperty("display", "block", "important")
      }
    }, 100)
  }, [url, remainingCounts, codeRemainingCounts, hideCondition])

  return null
}

export default HidePromptTextarea
