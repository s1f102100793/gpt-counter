import { atom } from "jotai"
import {
  defaultLayoutSetting,
  type LayoutSettingType
} from "src/utils/layoutSetting"
import {
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

export const layoutSettingAtom = atom<LayoutSettingType>(defaultLayoutSetting)
export const limitSettingAtom = atom<LimitSettingType>(normalLimitSetting)
