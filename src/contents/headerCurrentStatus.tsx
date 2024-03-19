import styleText from "data-text:./styles/headerCurrentStatus.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { codeCount as codeCountUtils } from "src/utils/count/codeCount"
import { getResponseDailyCount } from "src/utils/count/responseCount"
import { headerClassName } from "src/utils/elements"
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

import styles from "./styles/headerCurrentStatus.module.css"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const element = document.querySelector(headerClassName)
  return element as Element
}

export const getStyle = () => {
  const styles = document.createElement("style")
  styles.textContent = styleText
  return styles
}

export const getShadowHostId = () => "header-current-status"

// eslint-disable-next-line complexity
const HeaderCurrentStatus = () => {
  const [count, setCount] = useState(0)
  const [codeCount, setCodeCount] = useState(0)
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSettingType>(defaultLayoutSetting)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const remainingCounts = limitSetting.limit - count
  const codeRemainingCounts = (limitSetting.codeLimit as number) - codeCount

  const removeLimit = async () => {
    if (window.confirm("本日の制限を解除しますか？")) {
      const unlimitedSetting = {
        ...limitSetting,
        isLimitRemoved: true,
        limit: Number.MAX_SAFE_INTEGER,
        codeLimit: Number.MAX_SAFE_INTEGER
      }
      setLimitSetting(unlimitedSetting)
      await saveLimitSetting(unlimitedSetting)
    }
  }

  const fetchTodayCount = async () => {
    await getResponseDailyCount().then((count) => {
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
    fetchTodayCount()
    fetchLayoutSetting()
    fetchLimitSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchTodayCount()
    fetchLayoutSetting()
    fetchLimitSetting()
  })

  if (
    layoutSetting.header === false ||
    limitSetting.isLimitRemoved === true ||
    (limitSetting.isCountOnly === true && limitSetting.isCodeLimit === false)
  )
    return null
  if (remainingCounts <= 0 && limitSetting.isCountOnly === false)
    return (
      <div className={styles.container}>
        <div onClick={removeLimit} style={{ cursor: "pointer" }}>
          質問数の制限になりました。本日は使用できません。
        </div>
      </div>
    )
  if (codeRemainingCounts <= 0 && limitSetting.isCodeLimit === true)
    return (
      <div className={styles.container}>
        <div onClick={removeLimit} style={{ cursor: "pointer" }}>
          コードの出力数が制限に達しました。本日は使用できません。
        </div>
      </div>
    )

  if (
    (layoutSetting.content === "codeCount" &&
      limitSetting.difficulty === "custom" &&
      limitSetting.isCodeLimit === true) ||
    (layoutSetting.content === "responseCount" &&
      limitSetting.isCountOnly === true)
  ) {
    return (
      <div className={styles.container}>
        本日の残りコード出力回数は{codeRemainingCounts}回です。
      </div>
    )
  }
  return (
    <div className={styles.container}>
      本日の残り質問可能回数は{remainingCounts}回です。
    </div>
  )
}

export default HeaderCurrentStatus
