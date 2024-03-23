import type { LimitSettingType } from "../limitSetting"

export const alertDisplayConditions = {
  cannotChangeDifficulty: (
    limitSetting: LimitSettingType,
    todayCount: number
  ) => {
    return limitSetting.canChangeDifficulty === false && todayCount > 0
  }
}
