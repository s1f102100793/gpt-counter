import { alertUtils } from "./alert/alert"
import { alertDisplayConditions } from "./alert/alertDisplayConditions"
import type { LimitSettingType } from "./limitSetting"

export const userMessages = {
  cannotChangeDifficulty: async (
    limitSetting: LimitSettingType,
    todayCount: number,
    setAlertOpen?: (value: boolean) => void
  ) => {
    if (
      alertDisplayConditions.cannotChangeDifficulty(limitSetting, todayCount)
    ) {
      setAlertOpen && setAlertOpen(true)
      await alertUtils.cannotChangeDifficulty()
      return false
    }
    return true
  },
  confirmChangeDifficulty: async (
    limitSetting: LimitSettingType,
    todayCount: number
  ) => {
    if (
      alertDisplayConditions.cannotChangeDifficulty(limitSetting, todayCount)
    ) {
      const userConfirmed =
        await alertUtils.changeSettingToCannotChangeDifficulty()
      if (!userConfirmed) return false
    }
    return true
  },
  confirmChangeSettings: async (
    limitSetting: LimitSettingType,
    todayCount: number
  ) => {
    const canContinue = await userMessages.confirmChangeDifficulty(
      limitSetting,
      todayCount
    )
    if (!canContinue) return false

    const userConfirmed = await alertUtils.changeSetting()
    return userConfirmed
  }
}
