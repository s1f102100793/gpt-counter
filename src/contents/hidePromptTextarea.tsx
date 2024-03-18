import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { getResponseDailyCount } from "src/utils/count/responseCount"
import { getLimitSetting, normalLimitSetting } from "src/utils/limitSetting"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

const HidePromptTextarea = () => {
  const [count, setCount] = useState(0)
  const [limit, serLimit] = useState(normalLimitSetting.limit)
  const [url, setUrl] = useState("")

  const fetchTodayCount = async () => {
    await getResponseDailyCount().then((count) => {
      setCount(count)
    })
  }
  const fetchLimitSetting = async () => {
    await getLimitSetting().then((setting) => {
      serLimit(setting.limit)
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
    const remainingCounts = limit - count
    setTimeout(() => {
      const textarea = document.getElementById("prompt-textarea")
      if (!textarea) return
      if (remainingCounts <= 0) {
        textarea.style.setProperty("display", "none", "important")
      } else {
        textarea.style.setProperty("display", "block", "important")
      }
    }, 100)
  }, [count, limit, url])

  return null
}

export default HidePromptTextarea
