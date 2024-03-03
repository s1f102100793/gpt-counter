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

  useEffect(() => {
    const n = limit - count
    if (n <= 0) {
      const textarea = document.getElementById("prompt-textarea")
      if (textarea) {
        textarea.style.display = "none"
      }
    } else {
      const textarea = document.getElementById("prompt-textarea")
      if (textarea) {
        textarea.style.display = "block"
      }
    }
  }, [count, limit])

  return null
}

export default HidePromptTextarea
