import styleText from "data-text:./styles/header-current-status.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { gptAnserStoragekey } from "src/utils/dailyCount"
import { getLayoutSetting } from "src/utils/layoutSetting"
import {
  getLimitSetting,
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import { useStorage } from "@plasmohq/storage/hook"

import styles from "./styles/header-current-status.module.css"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const element = document.querySelector(
    ".group.flex.cursor-pointer.items-center.gap-1.rounded-xl.py-2.px-3.text-lg.font-medium.hover\\:bg-token-main-surface-secondary.radix-state-open\\:bg-token-main-surface-secondary"
  )
  return element as Element
}

export const getStyle = () => {
  const styles = document.createElement("style")
  styles.textContent = styleText
  return styles
}

export const getShadowHostId = () => "header-current-status"

const HeaderCurrentStatus = () => {
  const [count] = useStorage(gptAnserStoragekey, 0)
  const [isLayoutDisplay, setLayoutDisplay] = useState(false)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const n = limitSetting.limit - count

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
    fetchLayoutSetting()
    fetchLimitSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchLayoutSetting()
    fetchLimitSetting()
  })

  if (!isLayoutDisplay) return null

  return (
    <div className={styles.container}>
      {n > 0 ? `本日の残り回数は${n}回です。` : "本日は使用できません"}
    </div>
  )
}

export default HeaderCurrentStatus
