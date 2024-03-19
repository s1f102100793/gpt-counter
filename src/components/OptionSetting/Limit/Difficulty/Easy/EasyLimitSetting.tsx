import React from "react"

import styles from "../Difficulty.module.css"
import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"

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
      <ChangeButton onClick={() => handleDifficultyChange("easy")} />
    </div>
  )
}

export default EasyLimitSetting
