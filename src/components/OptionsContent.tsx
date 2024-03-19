import { Typography } from "@mui/material"

import OptionsLayoutSetting from "./OptionSetting/Layout/OptionsLayoutSetting"
import OptionsLimitSetting from "./OptionSetting/Limit/OptionsLimitSetting"
import OptionStatistics from "./OptionStatistics/OptionStatistics"

interface OptionsContentProps {
  selectedItem: string
}

const OptionsContent = ({ selectedItem }: OptionsContentProps) => {
  return (
    <div>
      {selectedItem === "statistics" ? (
        <div>
          <OptionStatistics />
        </div>
      ) : selectedItem === "general" ? (
        <div>
          <OptionsLimitSetting />
          <OptionsLayoutSetting />
        </div>
      ) : (
        <Typography>選択された項目がありません</Typography>
      )}
    </div>
  )
}

export default OptionsContent
