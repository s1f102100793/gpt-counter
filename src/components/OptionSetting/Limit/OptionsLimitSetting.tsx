import { Box, Tab, Tabs } from "@mui/material"
import React, { useEffect, useState } from "react"
import { alertUtils } from "src/utils/alert"
import { responseCount } from "src/utils/count/responseCount"
import {
  easyLimitSetting,
  getLimitSettingByDifficulty,
  getValueByLimitSetting,
  hardLimitSetting,
  limitSetting as limitUtils,
  normalLimitSetting,
  type LimitSettingType
} from "src/utils/limitSetting"

import { a11yProps } from "../../mui/a11yProps"
import { TabPanel } from "../../mui/TabPanel"
import CustomLimitSetting from "./Difficulty/Custom/CustomLimitSetting"
import DifficultyLimitSetting from "./Difficulty/DifficultyLimitSetting"
import styles from "./OptionLimitSetting.module.css"

const OptionsLimitSetting = () => {
  const [value, setValue] = useState(0)
  const [limitSetting, setLimitSetting] =
    useState<LimitSettingType>(normalLimitSetting)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  // eslint-disable-next-line complexity
  const handleDifficultyChange = async (difficulty: string) => {
    const todayCount = await responseCount.getDaily()
    if (limitSetting.canChangeDifficulty === false && todayCount > 0) {
      await alertUtils.cannotChangeDifficulty()
      return
    }
    let newSetting = await getLimitSettingByDifficulty(difficulty)
    if (newSetting === undefined) return
    if (newSetting.canChangeDifficulty === false && todayCount > 0) {
      const userConfirmed =
        await alertUtils.changeSettingToCannotChangeDifficulty()
      if (!userConfirmed) return
    } else {
      const userConfirmed = await alertUtils.changeSetting()
      if (!userConfirmed) return
    }
    newSetting = limitUtils.checkLimitRemoved(limitSetting, newSetting)
    setValue(getValueByLimitSetting(newSetting))
    setLimitSetting(newSetting)
    await limitUtils.save(newSetting)
  }

  const fetchLimitSetting = async () => {
    await limitUtils.get().then((setting) => {
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
        <DifficultyLimitSetting
          handleDifficultyChange={handleDifficultyChange}
          limitSetting={easyLimitSetting}
        />
      )
    },
    {
      label: "ノーマル",
      content: (
        <DifficultyLimitSetting
          handleDifficultyChange={handleDifficultyChange}
          limitSetting={normalLimitSetting}
        />
      )
    },
    {
      label: "ハード",
      content: (
        <DifficultyLimitSetting
          handleDifficultyChange={handleDifficultyChange}
          limitSetting={hardLimitSetting}
        />
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
