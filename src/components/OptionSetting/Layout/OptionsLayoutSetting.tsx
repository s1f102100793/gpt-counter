import { FormControlLabel } from "@mui/material"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { limitSettingAtom } from "src/atoms/settings"
import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"
import { alertUtils } from "src/utils/alert/alert"
import {
  defaultLayoutSetting,
  layoutSetting as layoutUtils,
  type LayoutSettingType
} from "src/utils/layoutSetting"
import { key } from "src/utils/storage"

import { IOSSwitch } from "../../mui/IosSwitch"
import styles from "./OptionLayoutSetting.module.css"

const OptionsLayoutSetting = () => {
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSettingType>(defaultLayoutSetting)
  const [limitSetting] = useAtom(limitSettingAtom)
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
  }
  const saveLayoutSetting = async () => {
    const userConfirmed = await alertUtils.changeSetting()
    if (!userConfirmed) return
    await layoutUtils.save(layoutSetting)
  }

  const fetchLayoutSetting = useCallback(async () => {
    await layoutUtils.get().then((setting) => {
      setLayoutSetting(setting)
      setDisplayCount(setting.content)
    })
  }, [])
  useEffect(() => {
    fetchLayoutSetting()
  }, [fetchLayoutSetting])
  useEffect(() => {
    const onChangedListener = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      const changedItems = Object.keys(changes)[0]
      if (changedItems === key.layoutSetting()) {
        fetchLayoutSetting()
      }
    }
    chrome.storage.onChanged.addListener(onChangedListener)
    return () => {
      chrome.storage.onChanged.removeListener(onChangedListener)
    }
  }, [fetchLayoutSetting])

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
        <ChangeButton onClick={saveLayoutSetting} />
      </div>
    </div>
  )
}

export default OptionsLayoutSetting
