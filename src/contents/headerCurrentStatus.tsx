import styleText from "data-text:./styles/headerCurrentStatus.module.css"
import { useAtom } from "jotai"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useCallback, useEffect } from "react"
import { codeCountAtom, responseCountAtom } from "src/atoms/counts"
import { layoutSettingAtom, limitSettingAtom } from "src/atoms/settings"
import { codeCount as codeCountUtils } from "src/utils/count/codeCount"
import { responseCount } from "src/utils/count/responseCount"
import { headerClassName } from "src/utils/elements"
import { layoutSetting as layoutUtils } from "src/utils/layoutSetting"
import { limitSetting as limitUtils } from "src/utils/limitSetting"
import { statusDisplayConditions } from "src/utils/statusDisplayConditions"
import { key } from "src/utils/storage"

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
  const [count, setCount] = useAtom(responseCountAtom)
  const [codeCount, setCodeCount] = useAtom(codeCountAtom)
  const [layoutSetting, setLayoutSetting] = useAtom(layoutSettingAtom)
  const [limitSetting, setLimitSetting] = useAtom(limitSettingAtom)
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
      await limitUtils.save(unlimitedSetting)
    }
  }

  const fetchTodayCount = useCallback(async () => {
    await responseCount.getDaily().then((count) => {
      setCount(count)
    })
    await codeCountUtils.getDaily().then((count) => {
      setCodeCount(count)
    })
  }, [setCount, setCodeCount])
  const fetchLayoutSetting = useCallback(async () => {
    await layoutUtils.get().then((setting) => {
      setLayoutSetting(setting)
    })
  }, [setLayoutSetting])
  const fetchLimitSetting = useCallback(async () => {
    await limitUtils.get().then((setting) => {
      setLimitSetting(setting)
    })
  }, [setLimitSetting])

  useEffect(() => {
    fetchTodayCount()
    fetchLayoutSetting()
    fetchLimitSetting()
  }, [fetchTodayCount, fetchLayoutSetting, fetchLimitSetting])
  useEffect(() => {
    const onChangedListener = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      const changedItems = Object.keys(changes)[0]
      if (changedItems === key.gptResponses()) {
        fetchTodayCount()
      } else if (changedItems === key.layoutSetting()) {
        fetchLayoutSetting()
      } else if (changedItems === key.limitSetting()) {
        fetchLimitSetting()
      }
    }
    chrome.storage.onChanged.addListener(onChangedListener)
    return () => {
      chrome.storage.onChanged.removeListener(onChangedListener)
    }
  }, [fetchLayoutSetting, fetchLimitSetting, fetchTodayCount])

  if (statusDisplayConditions.headerNull(layoutSetting, limitSetting))
    return null

  if (statusDisplayConditions.limitAlert(remainingCounts, limitSetting))
    return (
      <div className={styles.container}>
        {limitSetting.canLimitRemoved === true ? (
          <div onClick={removeLimit} style={{ cursor: "pointer" }}>
            質問数の制限になりました。本日は使用できません。
          </div>
        ) : (
          <div>質問数の制限になりました。本日は使用できません。</div>
        )}
      </div>
    )
  if (statusDisplayConditions.codeLimitAlert(codeRemainingCounts, limitSetting))
    return (
      <div className={styles.container}>
        {limitSetting.canLimitRemoved === true ? (
          <div onClick={removeLimit} style={{ cursor: "pointer" }}>
            コードの出力数が制限に達しました。本日は使用できません。
          </div>
        ) : (
          <div>コードの出力数が制限に達しました。本日は使用できません。</div>
        )}
      </div>
    )
  if (statusDisplayConditions.codeLimitDisplay(layoutSetting, limitSetting)) {
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
