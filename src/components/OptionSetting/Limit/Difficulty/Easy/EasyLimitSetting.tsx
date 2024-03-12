import React from "react"

import styles from "../Difficulty.module.css"

export interface DifficultyLimitSettingProps {
  handleDifficultyChange: (difficulty: string) => void
}

const EasyLimitSetting: React.FC<DifficultyLimitSettingProps> = ({
  handleDifficultyChange
}) => {
  return (
    <div className={styles.container}>
      <ul>
        <li>質問可能回数:15回</li>
      </ul>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleDifficultyChange("easy")}
          className={styles.changeButton}>
          この設定に変更
        </button>
      </div>
    </div>
  )
}

export default EasyLimitSetting
