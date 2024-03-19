import React from "react"
import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"

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
      <ChangeButton onClick={() => handleDifficultyChange("normal")} />
    </div>
  )
}

export default NormalLimitSetting
