import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { FormControlLabel } from "@mui/material"
import settingIcon from "data-base64:~/assets/settingIcon.png"
import { useEffect, useState } from "react"
import { IOSSwitch } from "src/components/mui/IosSwitch"
import { responseCount } from "src/utils/count/responseCount"
import {
  defaultLayoutSetting,
  layoutSetting as layoutUtils,
  type LayoutSettingType
} from "src/utils/layoutSetting"
import {
  getLimitSettingByDifficulty,
  limitSetting as limitUtils,
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"
import { userMessages } from "src/utils/userMessages"

import styles from "./index.module.css"

const Popup = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSettingType>(defaultLayoutSetting)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const [customDisplayCount, setDisplayCount] = useState<
    "responseCount" | "codeCount"
  >("responseCount")
  const [isAlertOpen, setAlertOpen] = useState(false)

  const translateSettingName = (settingName: string): string => {
    const nameMap: Record<string, string> = {
      afterGptResponse: "GPTレスポンス後に表示",
      header: "ヘッダーに表示"
    }
    return nameMap[settingName] || settingName
  }

  const navigateToSettings = () => {
    chrome.runtime.openOptionsPage()
  }

  const handleSwitchChange = async (settingName: string, checked: boolean) => {
    const updatedSetting = { ...layoutSetting, [settingName]: checked }
    setLayoutSetting(updatedSetting)
    await layoutUtils.save(updatedSetting)
  }
  const handleCustomSwithChange = async () => {
    const newContent =
      customDisplayCount === "responseCount" ? "codeCount" : "responseCount"
    const updatedSetting: LayoutSettingType = {
      ...layoutSetting,
      content: newContent
    }
    setDisplayCount(newContent)
    setLayoutSetting(updatedSetting)
    await layoutUtils.save(updatedSetting)
  }

  const handleDifficultyChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDifficulty = event.target.value
    const todayCount = await responseCount.getDaily()
    const proceedWithDifficulty = await userMessages.cannotChangeDifficulty(
      limitSetting,
      todayCount,
      setAlertOpen
    )
    if (!proceedWithDifficulty) return
    let newSetting = await getLimitSettingByDifficulty(newDifficulty)
    if (newSetting === undefined) return
    const proceedWithSettings = await userMessages.confirmChangeDifficulty(
      newSetting,
      todayCount
    )
    if (!proceedWithSettings) return
    newSetting = limitUtils.checkLimitRemoved(limitSetting, newSetting)
    setLimitSetting(newSetting)
    await limitUtils.save(newSetting)
  }

  const fetchLayoutSetting = async () => {
    await layoutUtils.get().then((setting) => {
      setLayoutSetting(setting)
      setDisplayCount(setting.content)
    })
  }
  const fetchLimitSetting = async () => {
    await limitUtils.get().then((setting) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appName}>
          <img src={settingIcon} style={{ width: "24px", height: "24px" }} />
          <p>GPT-Counter</p>
        </div>
        <SettingsOutlinedIcon
          className={styles.settingIcon}
          onClick={navigateToSettings}
        />
      </div>
      <div className={styles.limitSetting}>
        <div className={styles.settingHeader}>
          <div>設定</div>
          {isAlertOpen && (
            <div className={styles.settingHeaderAlert}>
              ※本日は質問しているため、設定を変更できません
            </div>
          )}
        </div>
        <select
          className={styles.limitSelect}
          value={limitSetting.difficulty}
          onChange={handleDifficultyChange}>
          <option value="easy">イージー</option>
          <option value="normal">ノーマル</option>
          <option value="hard">ハード</option>
          <option value="custom">カスタム</option>
        </select>
      </div>
      {Object.entries(layoutSetting).map(([settingName, isEnabled]) => {
        if (settingName === "afterGptResponse" || settingName === "header") {
          return (
            <div key={settingName} className={styles.layoutOption}>
              <div className={styles.layoutOptionLabel}>
                {translateSettingName(settingName)}
              </div>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={Boolean(isEnabled)}
                    onChange={(e) =>
                      handleSwitchChange(settingName, e.target.checked)
                    }
                  />
                }
                label=""
                labelPlacement="start"
              />
            </div>
          )
        }
        return null
      })}
      {limitSetting.isCountOnly === false &&
        limitSetting.isCodeLimit === true && (
          <>
            <div className={styles.layoutOption}>
              <div className={styles.layoutOptionLabel}>残り質問数を表示</div>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={customDisplayCount === "responseCount"}
                    onChange={() => handleCustomSwithChange()}
                  />
                }
                label=""
                labelPlacement="start"
              />
            </div>
            <div className={styles.layoutOption}>
              <div className={styles.layoutOptionLabel}>
                残りコード回答数を表示
              </div>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={customDisplayCount === "codeCount"}
                    onChange={() => handleCustomSwithChange()}
                  />
                }
                label=""
                labelPlacement="start"
              />
            </div>
          </>
        )}
    </div>
  )
}

export default Popup
