import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { gptAnserStoragekey } from "src/utils/dailyCount"
import { getLimitSetting, normalLimitSetting } from "src/utils/limitSetting"

import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

const HidePromptTextarea = () => {
  const [count] = useStorage(gptAnserStoragekey)
  const [limit, serLimit] = useState(normalLimitSetting.limit)
  const [url, setUrl] = useState("")

  const fetchLimitSetting = async () => {
    await getLimitSetting().then((setting) => {
      serLimit(setting.limit)
    })
  }
  useEffect(() => {
    fetchLimitSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchLimitSetting()
  })
  chrome.runtime.onMessage.addListener((message) => {
    if (message.name === "url") {
      setUrl(message.body.url)
    }
  })
  
  useEffect(() => {
    const n = limit - count
    setTimeout(() => {
      const textarea = document.getElementById("prompt-textarea")
      if (!textarea) return
      if (n <= 0) {
        textarea.style.setProperty("display", "none", "important")
      } else {
        textarea.style.setProperty("display", "block", "important")
      }
    }, 100)
  }, [count, limit, url])

  return null
}

export default HidePromptTextarea
