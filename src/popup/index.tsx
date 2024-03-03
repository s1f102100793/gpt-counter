import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { FormControlLabel } from "@mui/material"
import { useEffect, useState } from "react"
import { IOSSwitch } from "src/components/IosSwitch"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  savetLayoutSetting
} from "src/utils/layoutSetting"

import styles from "./index.module.css"

function IndexPopup() {
  const [layoutSetting, setLayoutSetting] =
    useState<Record<string, boolean>>(defaultLayoutSetting)

  const handleOnclick = () => {
    alert("clicked")
  }

  const handleSwitchChange = async (settingName: string, checked: boolean) => {
    const updatedSetting = { ...layoutSetting, [settingName]: checked }
    setLayoutSetting(updatedSetting)
    await savetLayoutSetting(updatedSetting)
  }

  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutSetting(setting)
    })
  }

  useEffect(() => {
    fetchLayoutSetting()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appName}>Gugure</div>
        <SettingsOutlinedIcon onClick={handleOnclick} />
      </div>
      <div className={styles.setting}>
        <div className={styles.settingHeader}>設定</div>
        <select className={styles.select}>
          <option value="option1">選択肢 1</option>
          <option value="option2" selected>
            選択肢 2
          </option>
          <option value="option3">選択肢 3</option>
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

export default IndexPopup
