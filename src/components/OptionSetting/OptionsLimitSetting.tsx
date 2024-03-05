import { Box, Tab, Tabs } from "@mui/material"
import React, { useState } from "react"

import { a11yProps } from "../mui/a11yProps"
import { TabPanel } from "../mui/TabPanel"
import styles from "./OptionLimitSetting.module.css"

const OptionsLimitSetting = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>制限設定</div>
      <Box className={styles.content}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "100%"
          }}>
          <Tabs
            TabIndicatorProps={{
              style: { background: "green", height: "4px" }
            }}
            value={value}
            sx={{
              ".Mui-selected": {
                color: `lightGreen`
              }
            }}
            onChange={handleChange}
            aria-label="limit setting tabs"
            centered>
            <Tab
              label="イージー"
              {...a11yProps(0)}
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                width: "33%",
                "&.Mui-selected": { color: "green" }
              }}
            />
            <Tab
              label="ノーマル"
              {...a11yProps(1)}
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                width: "33%",
                "&.Mui-selected": { color: "green" }
              }}
            />
            <Tab
              label="ハード"
              {...a11yProps(2)}
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                width: "33%",
                "&.Mui-selected": { color: "green" }
              }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* ここにイージー設定に関するコンテンツを追加 */}aaa
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* ここにノーマル設定に関するコンテンツを追加 */}bbb
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* ここにハード設定に関するコンテンツを追加 */}ccc
        </TabPanel>
      </Box>
    </div>
  )
}

export default OptionsLimitSetting
