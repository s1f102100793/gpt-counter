import { Typography } from "@mui/material"

import OptionsLayoutSetting from "./OptionSetting/Layout/OptionsLayoutSetting"
import OptionsLimitSetting from "./OptionSetting/Limit/OptionsLimitSetting"

interface OptionsContentProps {
  selectedItem: string
}

const OptionsContent = ({ selectedItem }: OptionsContentProps) => {
  return (
    <div>
      {selectedItem === "statistics" ? (
        <Typography>統計の内容</Typography>
      ) : selectedItem === "general" ? (
        <Typography>
          <OptionsLimitSetting />
          <OptionsLayoutSetting />
        </Typography>
      ) : (
        <Typography>選択された項目がありません</Typography>
      )}
    </div>
  )
}

export default OptionsContent
