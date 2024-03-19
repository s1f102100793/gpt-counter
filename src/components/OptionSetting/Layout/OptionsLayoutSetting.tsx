import { FormControlLabel } from "@mui/material"
import { useEffect, useState } from "react"
import {
  defaultLayoutSetting,
  getLayoutSetting,
  saveLayoutSetting,
  type LayoutSettingType
} from "src/utils/layoutSetting"
import {
  getLimitSetting,
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import { IOSSwitch } from "../../mui/IosSwitch"
import styles from "./OptionLayoutSetting.module.css"

const OptionsLayoutSetting = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSettingType>(defaultLayoutSetting)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)
  const [customDisplayCount, setDisplayCount] = useState<
    "responseCount" | "codeCount"
  >("responseCount")

  const translateSettingName = (settingName: string): string => {
    const nameMap: Record<string, string> = {
      afterGptResponse: "GPTレスポンス後に残り回数を表示をする。",
      header: "ヘッダーに残り回数を表示する。"
    }
    return nameMap[settingName] || settingName
  }

  const handleSwitchChange = async (settingName: string, checked: boolean) => {
    const updatedSetting = { ...layoutSetting, [settingName]: checked }
    setLayoutSetting(updatedSetting)
    await saveLayoutSetting(updatedSetting)
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
    await saveLayoutSetting(updatedSetting)
  }

  const fetchLayoutSetting = async () => {
    await getLayoutSetting().then((setting) => {
      setLayoutSetting(setting)
      setDisplayCount(setting.content)
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
      <div className={styles.title}>レイアウト設定</div>
      <div>
        {Object.entries(layoutSetting).map(([settingName, isEnabled]) => {
          if (settingName !== "content") {
            return (
              <div key={settingName} className={styles.content}>
                <div className={styles.contentLabel}>
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
        })}
        {limitSetting.isCountOnly === false &&
          limitSetting.isCodeLimit === true && (
            <>
              <div className={styles.content}>
                <div className={styles.contentLabel}>残り質問数を表示する</div>
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
              <div className={styles.content}>
                <div className={styles.contentLabel}>
                  残りコード回答数を表示する
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
    </div>
  )
}

export default OptionsLayoutSetting
