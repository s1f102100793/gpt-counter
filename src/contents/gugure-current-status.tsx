import styleText from "data-text:./styles/gugure-current-status.module.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useState } from "react"
import { gptAnserStoragekey } from "src/utils/dailyCount"
import { getLayoutSetting } from "src/utils/layoutSetting"

import { useStorage } from "@plasmohq/storage/hook"

import styles from "./styles/gugure-current-status.module.css"

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

export const getShadowHostId = () => "gugure-anser"

const GugureCurrentStatus = () => {
  const [count] = useStorage(gptAnserStoragekey, 0)
  const [isLayoutDisplay, setLayoutDisplay] = useState(false)
  const n = 100 - count

  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutDisplay(setting.displayAfterGptResponse)
    })
  }

  useEffect(() => {
    const allElements = document.querySelectorAll("#gugure-anser")

    if (allElements.length > 1) {
      for (let i = 0; i < allElements.length - 1; i++) {
        allElements[i].remove()
      }
    }
  }, [count])

  useEffect(() => {
    fetchLayoutSetting()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    fetchLayoutSetting()
  })

  if (!isLayoutDisplay) return null

  return (
    <div className={styles.statusContainer}>
      {n > 0 ? (
        <div className={styles.container}>
          <div className={styles.content}>本日の残り回数は{n}回です。</div>
        </div>
      ) : (
        <div className={styles.alertContainer}>
          <div className={styles.content}>本日は使用できません</div>
        </div>
      )}
    </div>
  )
}

export default GugureCurrentStatus
