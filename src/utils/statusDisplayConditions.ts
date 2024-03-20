import type { LayoutSettingType } from "./layoutSetting"
import type { LimitSettingType } from "./limitSetting"

export const statusDisplayConditions = {
  chatAreaNull: (
    layoutSetting: LayoutSettingType,
    limitSetting: LimitSettingType
  ) => {
    return (
      layoutSetting.afterGptResponse === false ||
      limitSetting.isLimitRemoved === true ||
      (limitSetting.isCountOnly === true && limitSetting.isCodeLimit === false)
    )
  },
  headerNull: (
    layoutSetting: LayoutSettingType,
    limitSetting: LimitSettingType
  ) => {
    return (
      layoutSetting.header === false ||
      limitSetting.isLimitRemoved === true ||
      (limitSetting.isCountOnly === true && limitSetting.isCodeLimit === false)
    )
  },
  limitAlert: (remainingCounts: number, limitSetting: LimitSettingType) => {
    return (
      remainingCounts <= 0 &&
      (limitSetting.isCountOnly === false ||
        limitSetting.difficulty !== "custom")
    )
  },
  codeLimitAlert: (
    codeRemainingCounts: number,
    limitSetting: LimitSettingType
  ) => {
    return codeRemainingCounts <= 0 && limitSetting.isCodeLimit === true
  },
  codeLimitDisplay: (
    layoutSetting: LayoutSettingType,
    limitSetting: LimitSettingType
  ) => {
    return (
      (layoutSetting.content === "codeCount" &&
        limitSetting.difficulty === "custom" &&
        limitSetting.isCodeLimit === true) ||
      (layoutSetting.content === "responseCount" &&
        limitSetting.isCountOnly === true)
    )
  }
}
