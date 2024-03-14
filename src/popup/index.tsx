import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { FormControlLabel } from "@mui/material"
import { useEffect, useState } from "react"
import { IOSSwitch } from "src/components/mui/IosSwitch"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  savetLayoutSetting
} from "src/utils/layoutSetting"
import {
  checkLimitRemoved,
  getLimitSetting,
  getLimitSettingByDifficulty,
  normalLimitSetting,
  savetLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import styles from "./index.module.css"

const Popup = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<Record<string, boolean>>(defaultLayoutSetting)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)

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
    await savetLayoutSetting(updatedSetting)
  }
  const handleDifficultyChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDifficulty = event.target.value
    let newSetting = await getLimitSettingByDifficulty(newDifficulty)
    if (newSetting === undefined) return
    newSetting = checkLimitRemoved(limitSetting, newSetting)
    setLimitSetting(newSetting)
    await savetLimitSetting(newSetting)
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
        <div className={styles.appName}>GPT-Counter</div>
        <SettingsOutlinedIcon
          className={styles.settingIcon}
          onClick={navigateToSettings}
        />
      </div>
      <div className={styles.limitSetting}>
        <div className={styles.settingHeader}>設定</div>
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
      {Object.entries(layoutSetting).map(([settingName, isEnabled]) => (
        <div key={settingName} className={styles.layoutOption}>
          <div className={styles.layoutOptionLabel}>
            {translateSettingName(settingName)}
          </div>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={isEnabled}
                onChange={(e) =>
                  handleSwitchChange(settingName, e.target.checked)
                }
              />
            }
            label=""
            labelPlacement="start"
          />
        </div>
      ))}
    </div>
  )
}

export default Popup
