import { FormControlLabel } from "@mui/material"
import React, { useEffect, useState } from "react"
import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"
import { IOSSwitch } from "src/components/mui/IosSwitch"
import { changeSettingAlert } from "src/utils/alert"
import {
  customLimitSetting,
  limitSetting as limitUtils,
  type LimitSettingType
} from "src/utils/limitSetting"

import styles from "../Difficulty.module.css"

interface CustomLimitSettingProps {
  limitSetting: LimitSettingType
  setLimitSetting: (limitSetting: LimitSettingType) => void
}
const CustomLimitSetting: React.FC<CustomLimitSettingProps> = ({
  limitSetting,
  setLimitSetting
}) => {
  const [isCountOnly, setIsCountOnly] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(0)
  const [isCodeLimit, setIsCodeLimit] = useState<boolean>(false)
  const [codeLimit, setCodeLimit] = useState<number>(0)
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value))
  }
  const handleChangeCodeLimit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCodeLimit(Number(event.target.value))
  }
  const changeToCustomLimitSetting = async () => {
    const userConfirmed = await changeSettingAlert()
    if (!userConfirmed) return
    const CustomLimitSetting = await customLimitSetting.get()
    let newSetting: LimitSettingType = {
      ...CustomLimitSetting,
      limit,
      isCountOnly,
      isCodeLimit,
      codeLimit
    }
    await customLimitSetting.save(newSetting)
    newSetting = limitUtils.checkLimitRemoved(limitSetting, newSetting)
    setLimitSetting(newSetting)
    await limitUtils.save(newSetting)
  }

  const fetchCustomLimitSetting = async () => {
    await customLimitSetting.get().then((setting) => {
      setLimit(setting.limit)
      setIsCountOnly(setting.isCountOnly as boolean)
      setIsCodeLimit(setting.isCodeLimit as boolean)
      setCodeLimit(setting.codeLimit as number)
    })
  }
  useEffect(() => {
    fetchCustomLimitSetting()
  }, [])

  return (
    <div className={styles.container}>
      <ul className={styles.customContent}>
        <li className={styles.content}>
          <div className={styles.divWithMarker}>質問数の制限をかける</div>
          <FormControlLabel
            sx={{ marginRight: "2px" }}
            control={
              <IOSSwitch
                checked={!isCountOnly}
                onChange={() => setIsCountOnly(!isCountOnly)}
              />
            }
            label=""
            labelPlacement="start"
          />
        </li>
        {isCountOnly === false && (
          <li className={styles.content}>
            <div className={styles.divWithMarker}>質問可能回数:</div>
            <input
              className={styles.limitInput}
              type="number"
              value={limit}
              onChange={handleChangeLimit}
            />
          </li>
        )}
        <li className={styles.content}>
          <div className={styles.divWithMarker}>コード回答数の制限をかける</div>
          <FormControlLabel
            sx={{ marginRight: "2px" }}
            control={
              <IOSSwitch
                checked={isCodeLimit}
                onChange={() => setIsCodeLimit(!isCodeLimit)}
              />
            }
            label=""
            labelPlacement="start"
          />
        </li>
        {isCodeLimit === true && (
          <li className={styles.content}>
            <div className={styles.divWithMarker}>コードの制限回数:</div>
            <input
              className={styles.limitInput}
              type="number"
              value={codeLimit}
              onChange={handleChangeCodeLimit}
            />
          </li>
        )}
      </ul>
      <ChangeButton onClick={changeToCustomLimitSetting} />
    </div>
  )
}

export default CustomLimitSetting
