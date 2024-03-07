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
  type ChartData
} from "chart.js"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth
} from "date-fns"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { getCountData } from "src/utils/dailyCount"

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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: []
  })
  const [options, setOptions] = useState({
    plugins: {
      title: {
        display: true,
        text: format(currentDate, "yyyy年MM月")
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
        beginAtZero: true
      }
    }
  })

  const findOldestDataMonth = async () => {
    const allCounts = await getCountData()
    let oldestDate = new Date()

    Object.keys(allCounts).forEach((dateStr) => {
      const date = parseISO(dateStr)
      if (isBefore(date, oldestDate)) {
        oldestDate = date
      }
    })

    return startOfMonth(oldestDate)
  }

  const updateChartData = async (date: Date) => {
    const allCounts = await getCountData()
    const today = new Date()
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)
    const eachDay = eachDayOfInterval({ start: startDate, end: endDate })
    const labels = eachDay.map((day) => format(day, "yyyy-MM-dd"))
    const model3Data = labels.map((date) =>
      isAfter(new Date(date), today) ? null : allCounts[date]?.["3.5"] || 0
    )
    const model4Data = labels.map((date) =>
      isAfter(new Date(date), today) ? null : allCounts[date]?.["4"] || 0
    )

    setData({
      labels,
      datasets: [
        {
          label: "Model 3.5",
          data: model3Data,
          borderColor: "rgb(24, 195, 125)",
          backgroundColor: "rgba(24, 195, 125, 0.5)",
          tension: 0.3,
          stack: "1",
          fill: "origin"
        },
        {
          label: "Model 4",
          data: model4Data,
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          stack: "1",
          tension: 0.3,
          fill: "-1"
        }
      ]
    })
  }

  useEffect(() => {
    updateChartData(currentDate)
    setOptions((currentOptions) => ({
      ...currentOptions,
      plugins: {
        ...currentOptions.plugins,
        title: {
          ...currentOptions.plugins.title,
          text: format(currentDate, "yyyy年MM月")
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
      <div className={styles.title}>統計ダッシュボード</div>
      <div className={styles.controls}>
        <button onClick={handlePrevMonth}>前の月</button>
        <button onClick={handleNextMonth}>次の月</button>
      </div>
      <div className={styles.content}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default OptionStatistics
