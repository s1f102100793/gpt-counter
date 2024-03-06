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
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
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

const options = {
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}

const OptionStatistics = () => {
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: []
  })

  const getChartData = async () => {
    const allCounts = await getCountData()
    console.log(allCounts)
    const today = new Date()
    const startDate = startOfMonth(new Date())
    const endDate = endOfMonth(new Date())
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
    getChartData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.title}>統計ダッシュボード</div>
      <div className={styles.content}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default OptionStatistics
