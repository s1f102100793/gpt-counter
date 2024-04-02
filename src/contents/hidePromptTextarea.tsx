import { useAtom } from "jotai"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { codeCountAtom, responseCountAtom } from "src/atoms/counts"
import { limitSettingAtom } from "src/atoms/settings"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

const HidePromptTextarea = () => {
  const [count] = useAtom(responseCountAtom)
  const [codeCount] = useAtom(codeCountAtom)
  const [limitSetting] = useAtom(limitSettingAtom)
  const [url, setUrl] = useState("")
  const remainingCounts = limitSetting.limit - count
  const codeRemainingCounts = (limitSetting.codeLimit as number) - codeCount
  const hideCondition =
    (remainingCounts <= 0 &&
      (limitSetting.isCountOnly === false ||
        limitSetting.isCodeLimit === undefined)) ||
    (codeRemainingCounts <= 0 && limitSetting.isCodeLimit === true)

  const urlMessageName = "url"
  chrome.runtime.onMessage.addListener((message) => {
    if (message.name === urlMessageName) {
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
