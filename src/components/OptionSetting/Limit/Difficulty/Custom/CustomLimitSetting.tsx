import { FormControlLabel } from "@mui/material"
import { IOSSwitch } from "src/components/mui/IosSwitch"

import styles from "./CustomLimitSetting.module.css"

const CustomLimitSetting = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.content}>
        <li>質問の制限をかける</li>
        <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} />}
          label=""
          labelPlacement="start"
        />
      </ul>
    </div>
  )
}

export default CustomLimitSetting
