import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions
} from "chart.js"
import { addMonths, format, isAfter, isBefore, startOfMonth } from "date-fns"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { responseCount } from "src/utils/count/responseCount"
import { findOldestDataMonth } from "src/utils/date-fns"
import {
  calculateMonthlyStatistics,
  transformChartJsChartData
} from "src/utils/statistics"
import type { CountStorageType } from "src/utils/storage"

import styles from "./OptionStatistics.module.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const OptionStatistics = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: []
  })
  const [options, setOptions] = useState<ChartOptions<"line">>({
    plugins: {
      title: {
        display: true,
        text: format(currentDate, "     yyyy年MM月"),
        font: {
          size: 24
        },
        align: "start"
      }
    },
    scales: {
      x: {
        ticks: {
          callback: (val: string | number) => {
            return (val as number) + 1
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  })
  const [statistics, setStatistics] = useState({
    totalQuestions: 0,
    averageQuestionsPerActiveDay: 0,
    ratioToPreviousMonth: 0
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const getChartJsChartData = async (
    date: Date,
    allCounts: CountStorageType
  ) => {
    await transformChartJsChartData(date, allCounts).then((chartData) => {
      setData(chartData)
    })
  }
  const fetchOldestDataMonth = async () => {
    const today = new Date()
    await findOldestDataMonth().then((oldestDataMonth) => {
      if (isBefore(startOfMonth(oldestDataMonth), startOfMonth(today))) {
        setIsButtonDisabled(true)
      }
    })
  }

  useEffect(() => {
    const fetchStatisticsData = async () => {
      const allCounts = await responseCount.getAll()
      getChartJsChartData(currentDate, allCounts)
      const stats = calculateMonthlyStatistics(allCounts, currentDate)
      setStatistics(stats)
    }
    fetchStatisticsData()
    fetchOldestDataMonth()
    setOptions((currentOptions) => ({
      ...currentOptions,
      plugins: {
        ...currentOptions.plugins,
        title: {
          ...currentOptions.plugins?.title,
          text: format(currentDate, "     yyyy年MM月")
        }
      }
    }))
  }, [currentDate])

  const handlePrevMonth = async () => {
    const oldestDataMonth = await findOldestDataMonth()
    setCurrentDate((prevDate) => {
      const newDate = addMonths(prevDate, -1)
      return isBefore(startOfMonth(newDate), startOfMonth(oldestDataMonth))
        ? prevDate
        : newDate
    })
  }
  const handleNextMonth = () => {
    const today = new Date()
    setCurrentDate((prevDate) => {
      const newDate = addMonths(prevDate, 1)
      if (isAfter(startOfMonth(newDate), startOfMonth(today))) {
        return prevDate
      }
      return newDate
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>統計ダッシュボード</div>
        {isButtonDisabled && (
          <div className={styles.controls}>
            <button className={styles.changeButton} onClick={handlePrevMonth}>
              prev
            </button>
            <button className={styles.changeButton} onClick={handleNextMonth}>
              next
            </button>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <Line data={data} options={options} />
        <div className={styles.infoSection}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>その月の質問数</div>
            <div className={styles.infoValue}>{statistics.totalQuestions}</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>質問した日の平均質問数</div>
            <div className={styles.infoValue}>
              {statistics.averageQuestionsPerActiveDay.toFixed(2)}
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>前月との比率</div>
            <div className={styles.infoValue}>
              {statistics.ratioToPreviousMonth !== null
                ? `${statistics.ratioToPreviousMonth.toFixed(2)}%`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionStatistics
