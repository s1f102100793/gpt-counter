import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"
import styles from "../Difficulty.module.css"
import type { DifficultyLimitSettingProps } from "../Easy/EasyLimitSetting"

const HardLimitSetting: React.FC<DifficultyLimitSettingProps> = ({
  handleDifficultyChange
}) => {
  return (
    <div className={styles.container}>
      <ul>
        <li>質問可能回数:5回</li>
      </ul>
      <ChangeButton onClick={() => handleDifficultyChange("hard")} />
    </div>
  )
}

export default HardLimitSetting
