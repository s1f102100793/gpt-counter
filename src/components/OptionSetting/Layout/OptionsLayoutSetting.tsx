import { FormControlLabel } from "@mui/material"
import { useEffect, useState } from "react"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  savetLayoutSetting
} from "src/utils/layoutSetting"

import { IOSSwitch } from "../../mui/IosSwitch"
import styles from "./OptionLayoutSetting.module.css"

const OptionsLayoutSetting = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<Record<string, boolean>>(defaultLayoutSetting)

  const translateSettingName = (settingName: string): string => {
    const nameMap: Record<string, string> = {
      afterGptResponse: "GPTレスポンス後に残り回数を表示をする。",
      header: "ヘッダーに表示に残り回数を表示する。"
    }
    return nameMap[settingName] || settingName
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
  chrome.storage.onChanged.addListener(() => {
    fetchLayoutSetting()
  })

  return (
    <div className={styles.container}>
      <div className={styles.title}>レイアウト設定</div>
      <div>
        {Object.entries(layoutSetting).map(([settingName, isEnabled]) => (
          <div key={settingName} className={styles.content}>
            <div className={styles.contentLabel}>
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
    </div>
  )
}

export default OptionsLayoutSetting
