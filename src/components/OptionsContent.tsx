import { Typography } from "@mui/material"

import OptionsLayoutSetting from "./OptionSetting/OptionsLayoutSetting"

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
          <OptionsLayoutSetting />
        </Typography>
      ) : (
        <Typography>選択された項目がありません</Typography>
      )}
    </div>
  )
}

export default OptionsContent
