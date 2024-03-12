import React from "react"

import styles from "../Difficulty.module.css"
import type { DifficultyLimitSettingProps } from "../Easy/EasyLimitSetting"

const NormalLimitSetting: React.FC<DifficultyLimitSettingProps> = ({
  handleDifficultyChange
}) => {
  return (
    <div className={styles.container}>
      <ul>
        <li>質問可能回数:10回</li>
      </ul>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleDifficultyChange("normal")}
          className={styles.changeButton}>
          この設定に変更
        </button>
      </div>
    </div>
  )
}

export default NormalLimitSetting
