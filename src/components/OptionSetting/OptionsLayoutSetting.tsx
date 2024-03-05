import { FormControlLabel } from "@mui/material"
import { useState } from "react"
import {
  defaultLayoutSetting,
  savetLayoutSetting
} from "src/utils/layoutSetting"

import { IOSSwitch } from "../IosSwitch"
import styles from "./OptionlayoutSetting.module.css"

const OptionsLayoutSetting = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<Record<string, boolean>>(defaultLayoutSetting)

  const handleSwitchChange = async (settingName: string, checked: boolean) => {
    const updatedSetting = { ...layoutSetting, [settingName]: checked }
    setLayoutSetting(updatedSetting)
    await savetLayoutSetting(updatedSetting)
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>レイアウト設定</div>
      <div>
        {Object.entries(layoutSetting).map(([settingName, isEnabled]) => (
          <div key={settingName} className={styles.content}>
            <p className={styles.contentLabel}>{settingName}</p>
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
    </div>
  )
}

export default OptionsLayoutSetting
