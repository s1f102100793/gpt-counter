import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { FormControlLabel } from "@mui/material"
import { IOSSwitch } from "src/components/IosSwitch"

import styles from "./index.module.css"

function IndexPopup() {
  const handleOnclick = () => {
    alert("clicked")
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appName}>Gugure</div>
        <SettingsOutlinedIcon onClick={handleOnclick} />
      </div>
      <div className={styles.setting}>
        <div className={styles.settingHeader}>設定</div>
        <select className={styles.select}>
          <option value="option1">選択肢 1</option>
          <option value="option2" selected>
            選択肢 2
          </option>
          <option value="option3">選択肢 3</option>
        </select>
      </div>
      <div className={styles.option}>
        <p className={styles.optionLabel}>GPTの返答後に表示する</p>
        <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
          label=""
          labelPlacement="start"
        />
      </div>
    </div>
  )
}

export default IndexPopup
