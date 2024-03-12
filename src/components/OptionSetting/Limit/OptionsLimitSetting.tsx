import { Box, Tab, Tabs } from "@mui/material"
import React, { useEffect, useState } from "react"
import { changeSettingAlert } from "src/utils/alert"
import {
  checkLimitRemoved,
  getLimitSetting,
  getLimitSettingByDifficulty,
  getValueByLimitSetting,
  normalLimitSetting,
  savetLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import { a11yProps } from "../../mui/a11yProps"
import { TabPanel } from "../../mui/TabPanel"
import CustomLimitSetting from "./Difficulty/Custom/CustomLimitSetting"
import EasyLimitSetting from "./Difficulty/Easy/EasyLimitSetting"
import HardLimitSetting from "./Difficulty/Hard/HardLimitSetting"
import NormalLimitSetting from "./Difficulty/Normal/NormalLimitSetting"
import styles from "./OptionLimitSetting.module.css"

const OptionsLimitSetting = () => {
  const [value, setValue] = useState(0)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleDifficultyChange = async (difficulty: string) => {
    const userConfirmed = await changeSettingAlert()
    if (!userConfirmed) return
    let newSetting = await getLimitSettingByDifficulty(difficulty)
    if (newSetting === undefined) return
    newSetting = checkLimitRemoved(limitSetting, newSetting)
    setValue(getValueByLimitSetting(newSetting))
    setLimitSetting(newSetting)
    await savetLimitSetting(newSetting)
  }

  const fetchLimitSetting = async () => {
    await getLimitSetting().then((setting) => {
      setValue(getValueByLimitSetting(setting))
      setLimitSetting(setting)
    })
  }

  useEffect(() => {
    fetchLimitSetting()
  }, [])
  chrome.storage.onChanged.addListener(() => {
    fetchLimitSetting()
  })

  const tabData = [
    {
      label: "イージー",
      content: (
        <EasyLimitSetting handleDifficultyChange={handleDifficultyChange} />
      )
    },
    {
      label: "ノーマル",
      content: (
        <NormalLimitSetting handleDifficultyChange={handleDifficultyChange} />
      )
    },
    {
      label: "ハード",
      content: (
        <HardLimitSetting handleDifficultyChange={handleDifficultyChange} />
      )
    },
    {
      label: "カスタム",
      content: (
        <CustomLimitSetting
          limitSetting={limitSetting}
          setLimitSetting={setLimitSetting}
        />
      )
    }
  ]

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
                color: "lightGreen"
              }
            }}
            onChange={handleChange}
            aria-label="limit setting tabs"
            centered>
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                {...a11yProps(index)}
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: `calc(100% / ${tabData.length})`,
                  "&.Mui-selected": { color: "green" }
                }}
              />
            ))}
          </Tabs>
        </Box>
        {tabData.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </div>
  )
}

export default OptionsLimitSetting
