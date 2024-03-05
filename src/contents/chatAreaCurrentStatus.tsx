import styleText from "data-text:./styles/chatAreaCurrentStatus.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useState } from "react"
import { getDailyCount } from "src/utils/dailyCount"
import { getLayoutSetting } from "src/utils/layoutSetting"
import {
  getLimitSetting,
  normalLimitSetting,
  savetLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import styles from "./styles/chatAreaCurrentStatus.module.css"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

export const getStyle = () => {
  const styles = document.createElement("style")
  styles.textContent = styleText
  return styles
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const elements = document.querySelectorAll(
    ".relative.flex.w-full.flex-col.agent-turn"
  )
  const parentElements = Array.from(elements)
    .map((element) => element.parentElement)
    .filter((parent) => parent !== null)
  return parentElements[parentElements.length - 1] as Element
}

export const getShadowHostId = () => "chatarea-current-status"

const ChatAreaCurrentStatus = () => {
  const [count, setCount] = useState(0)
  const [isLayoutDisplay, setLayoutDisplay] = useState(false)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const remainingCounts = limitSetting.limit - count

  const removeLimit = async () => {
    const unlimitedSetting = {
      ...limitSetting,
      isLimitRemoved: true,
      limit: Number.MAX_SAFE_INTEGER
    }
    await savetLimitSetting(unlimitedSetting)
    setLimitSetting(unlimitedSetting)
  }
  const fetchTodayCount = async () => {
    await getDailyCount().then((count) => {
      setCount(count)
    })
  }
  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutDisplay(setting.displayAfterGptResponse)
    })
  }
  const fetchLimitSetting = async () => {
    await getLimitSetting().then((setting) => {
      setLimitSetting(setting)
    })
  }

  useEffect(() => {
    const allElements = document.querySelectorAll("#chatarea-current-status")
    if (allElements.length > 1) {
      for (let i = 0; i < allElements.length - 1; i++) {
        allElements[i].remove()
      }
    }
  }, [count])

  useEffect(() => {
    fetchTodayCount()
    fetchLayoutSetting()
    fetchLimitSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchTodayCount()
    fetchLayoutSetting()
    fetchLimitSetting()
  })

  if (!isLayoutDisplay) return null

  return (
    <div className={styles.statusContainer}>
      {remainingCounts > 0 ? (
        <div className={styles.container}>
          <div className={styles.content}>
            本日の残り回数は{remainingCounts}回です。
          </div>
        </div>
      ) : (
        <div className={styles.alertContainer}>
          <div className={styles.content}>本日は使用できません</div>
          <button onClick={removeLimit} className={styles.removeLimitButton}>
            今日は制限を無くす。
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatAreaCurrentStatus
