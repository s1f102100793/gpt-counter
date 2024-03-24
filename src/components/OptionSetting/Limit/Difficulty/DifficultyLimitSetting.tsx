import { ChangeButton } from "src/components/Button/ChangeButton/ChangeButton"
import type { LimitSettingType } from "src/utils/limitSetting"

import styles from "./Difficulty.module.css"

export interface DifficultyLimitSettingProps {
  handleDifficultyChange: (difficulty: string) => void
  limitSetting: LimitSettingType
}

const DifficultyLimitSetting: React.FC<DifficultyLimitSettingProps> = ({
  handleDifficultyChange,
  limitSetting
}) => {
  return (
    <div className={styles.container}>
      <ul className={styles.difficultyContent}>
        <li>質問可能回数:{limitSetting.limit}回</li>
        <li>
          {limitSetting.canChangeDifficulty ? (
            "他の難易度に変更可能"
          ) : (
            <>
              他の難易度に変更不可能
              <br />
              ※1日に質問を行なっていない場合のみ変更可能
            </>
          )}
        </li>
        <li>
          {limitSetting.canLimitRemoved
            ? "制限到達時に質問回数の制限を解除可能"
            : "制限到達時に質問回数の制限を解除不可能"}
        </li>
      </ul>
      <ChangeButton
        onClick={() => handleDifficultyChange(limitSetting.difficulty)}
      />
    </div>
  )
}

export default DifficultyLimitSetting
