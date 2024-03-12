import { FormControlLabel } from "@mui/material"
import React from "react"
import { IOSSwitch } from "src/components/mui/IosSwitch"

import styles from "../Difficulty.module.css"
import type { DifficultyLimitSettingProps } from "../Easy/EasyLimitSetting"

const CustomLimitSetting: React.FC<DifficultyLimitSettingProps> = ({
  handleDifficultyChange
}) => {
  return (
    <div className={styles.container}>
      <ul className={styles.content}>
        <li>質問数の制限をかける</li>
        <FormControlLabel
          control={<IOSSwitch />}
          label=""
          labelPlacement="start"
        />
      </ul>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleDifficultyChange("custom")}
          className={styles.changeButton}>
          この設定に変更
        </button>
      </div>
    </div>
  )
}

export default CustomLimitSetting
