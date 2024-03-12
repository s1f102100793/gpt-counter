import { FormControlLabel } from "@mui/material"
import React, { useEffect, useState } from "react"
import { IOSSwitch } from "src/components/mui/IosSwitch"
import {
  checkLimitRemoved,
  getCustomLimitSetting,
  saveCustomLimitSetting,
  savetLimitSetting,
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
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value))
  }
  const changeToCustomLimitSetting = async () => {
    const CustomLimitSetting = await getCustomLimitSetting()
    let newSetting: LimitSettingType = {
      ...CustomLimitSetting,
      limit,
      isCountOnly
    }
    await saveCustomLimitSetting(newSetting)
    newSetting = checkLimitRemoved(limitSetting, newSetting)
    setLimitSetting(newSetting)
    await savetLimitSetting(newSetting)
  }

  const fetchCustomLimitSetting = async () => {
    await getCustomLimitSetting().then((setting) => {
      setLimit(setting.limit)
      setIsCountOnly(setting.isCountOnly as boolean)
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
      </ul>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => changeToCustomLimitSetting()}
          className={styles.changeButton}>
          この設定に変更
        </button>
      </div>
    </div>
  )
}

export default CustomLimitSetting
