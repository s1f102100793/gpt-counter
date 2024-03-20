import styleText from "data-text:./styles/chatAreaCurrentStatus.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useState } from "react"
import { codeCount as codeCountUtils } from "src/utils/count/codeCount"
import { responseCount } from "src/utils/count/responseCount"
import { gptResponseClassName } from "src/utils/elements"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  type LayoutSettingType
} from "src/utils/layoutSetting"
import {
  getLimitSetting,
  normalLimitSetting,
  saveLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"
import { statusDisplayConditions } from "src/utils/statusDisplayConditions"

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
  const elements = document.querySelectorAll(gptResponseClassName)
  const parentElements = Array.from(elements)
    .map((element) => element.parentElement)
    .filter((parent) => parent !== null)
  return parentElements[parentElements.length - 1] as Element
}

export const getShadowHostId = () => "chatarea-current-status"

const ChatAreaCurrentStatus = () => {
  const [count, setCount] = useState(0)
  const [codeCount, setCodeCount] = useState(0)
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSettingType>(defaultLayoutSetting)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const remainingCounts = limitSetting.limit - count
  const codeRemainingCounts = (limitSetting.codeLimit as number) - codeCount

  const removeLimit = async () => {
    const unlimitedSetting = {
      ...limitSetting,
      isLimitRemoved: true,
      limit: Number.MAX_SAFE_INTEGER,
      codeLimit: Number.MAX_SAFE_INTEGER
    }
    await saveLimitSetting(unlimitedSetting)
    setLimitSetting(unlimitedSetting)
  }
  const fetchTodayCount = async () => {
    await responseCount.getDaily().then((count) => {
      setCount(count)
    })
    await codeCountUtils.getDaily().then((count) => {
      setCodeCount(count)
    })
  }
  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutSetting(setting)
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

  if (statusDisplayConditions.chatAreaNull(layoutSetting, limitSetting))
    return null

  if (statusDisplayConditions.limitAlert(remainingCounts, limitSetting)) {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.alertContainer}>
          <div className={styles.content}>
            質問数の制限になりました。本日は使用できません。
          </div>
          <button onClick={removeLimit} className={styles.removeLimitButton}>
            今日は制限を無くす。
          </button>
        </div>
      </div>
    )
  }
  if (
    statusDisplayConditions.codeLimitAlert(codeRemainingCounts, limitSetting)
  ) {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.alertContainer}>
          <div className={styles.content}>
            コードの出力数が制限に達しました。本日は使用できません。
          </div>
          <button onClick={removeLimit} className={styles.removeLimitButton}>
            今日は制限を無くす。
          </button>
        </div>
      </div>
    )
  }
  if (statusDisplayConditions.codeLimitDisplay(layoutSetting, limitSetting)) {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.container}>
          <div className={styles.content}>
            本日の残りコード出力回数は{codeRemainingCounts}回です。
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.statusContainer}>
      <div className={styles.container}>
        <div className={styles.content}>
          本日の残り質問可能回数は{remainingCounts}回です。
        </div>
      </div>
    </div>
  )
}

export default ChatAreaCurrentStatus
