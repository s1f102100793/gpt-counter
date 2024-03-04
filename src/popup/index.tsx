import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { FormControlLabel } from "@mui/material"
import { useEffect, useState } from "react"
import { IOSSwitch } from "src/components/IosSwitch"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  savetLayoutSetting
} from "src/utils/layoutSetting"
import {
  easyLimitSetting,
  getLimitSetting,
  hardLimitSetting,
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

  const handleOnclick = () => {
    alert("clicked")
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
    let newSetting
    switch (newDifficulty) {
      case "easy":
        newSetting = easyLimitSetting
        break
      case "normal":
        newSetting = normalLimitSetting
        break
      case "hard":
        newSetting = hardLimitSetting
        break
      default:
        return
    }
    if (limitSetting.isLimitRemoved) {
      newSetting = {
        ...newSetting,
        isLimitRemoved: true,
        limit: Number.MAX_SAFE_INTEGER
      }
    }
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appName}>Gugure</div>
        <SettingsOutlinedIcon onClick={handleOnclick} />
      </div>
      <div className={styles.setting}>
        <div className={styles.settingHeader}>設定</div>
        <select
          className={styles.select}
          value={limitSetting.difficulty}
          onChange={handleDifficultyChange}>
          <option value="easy">イージー</option>
          <option value="normal">ノーマル</option>
          <option value="hard">ハード</option>
        </select>
      </div>
      {Object.entries(layoutSetting).map(([settingName, isEnabled]) => (
        <div key={settingName} className={styles.option}>
          <p className={styles.optionLabel}>{settingName}</p>
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
