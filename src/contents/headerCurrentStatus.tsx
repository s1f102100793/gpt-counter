import styleText from "data-text:./styles/headerCurrentStatus.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { getDailyCount } from "src/utils/dailyCount"
import { headerClassName } from "src/utils/elements"
import { getLayoutSetting } from "src/utils/layoutSetting"
import {
  getLimitSetting,
  normalLimitSetting,
  savetLimitSetting,
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

const HeaderCurrentStatus = () => {
  const [count, setCount] = useState(0)
  const [isLayoutDisplay, setLayoutDisplay] = useState(false)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const remainingCounts = limitSetting.limit - count

  const removeLimit = async () => {
    if (window.confirm("本日の制限を解除しますか？")) {
      const unlimitedSetting = {
        ...limitSetting,
        isLimitRemoved: true,
        limit: Number.MAX_SAFE_INTEGER
      }
      setLimitSetting(unlimitedSetting)
      await savetLimitSetting(unlimitedSetting)
    }
  }

  const fetchTodayCount = async () => {
    await getDailyCount().then((count) => {
      setCount(count)
    })
  }
  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutDisplay(setting.header)
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
    !isLayoutDisplay ||
    limitSetting.isLimitRemoved ||
    limitSetting?.isCountOnly === true
  )
    return null

  return (
    <div className={styles.container}>
      {remainingCounts > 0 ? (
        `本日の残り回数は${remainingCounts}回です。`
      ) : (
        <div onClick={removeLimit} style={{ cursor: "pointer" }}>
          本日は使用できません
        </div>
      )}
    </div>
  )
}

export default HeaderCurrentStatus
